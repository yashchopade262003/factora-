package org.production.service.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;
import org.production.service.ResponceEntity.ResponseStructure;
import org.production.service.client.BuyerOrderClient;
import org.production.service.client.InventoryClient;
import org.production.service.client.VendorClient;
import org.production.service.dto.BuyerOrderDTO;
import org.production.service.dto.InventoryDTO;
import org.production.service.dto.ProductionOrderDTO;
import org.production.service.dto.VendorDTO;
import org.production.service.entity.ProductionOrder;
import org.production.service.entity.ProductionStatus;
import org.production.service.exception.ProductionException;
import org.production.service.repository.ProductionOrderRepository;
import org.springframework.http.ResponseEntity;

class ProductionServiceTest {

    @Mock
    private ProductionOrderRepository repository;
    @Mock
    private VendorClient vendorClient;
    @Mock
    private InventoryClient inventoryClient;
    @Mock
    private BuyerOrderClient buyerOrderClient;

    @InjectMocks
    private ProductionService service;

    private final ModelMapper modelMapper = new ModelMapper();

    @BeforeEach
    void setUp() throws ReflectiveOperationException {
        MockitoAnnotations.openMocks(this);
        var field = ProductionService.class.getDeclaredField("modelMapper");
        field.setAccessible(true);
        field.set(service, modelMapper);

        when(vendorClient.getVendor(any())).thenReturn(new VendorDTO());
        when(repository.save(any(ProductionOrder.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    private ProductionOrder plannedOrder() {
        ProductionOrder order = new ProductionOrder();
        order.setProductionOrderId(101L);
        order.setVendorId(101L);
        order.setProductName("Basmati Rice");
        order.setRawMaterialInventoryId(501L);
        order.setRawMaterialQuantity(600d);
        order.setUnit("Kg");
        order.setStatus(ProductionStatus.PLANNED);
        return order;
    }

    @Test
    void startProduction_reservesRawMaterialAndMovesToInProgress() {
        ProductionOrder order = plannedOrder();
        when(repository.findById(101L)).thenReturn(Optional.of(order));

        ResponseEntity<ResponseStructure<ProductionOrderDTO>> response = service.startProduction(101L);

        verify(inventoryClient).stockOut(501L, 600d);
        assertEquals(ProductionStatus.IN_PROGRESS, response.getBody().getData().getStatus());
    }

    @Test
    void startProduction_rejectsAnAlreadyStartedOrder() {
        ProductionOrder order = plannedOrder();
        order.setStatus(ProductionStatus.IN_PROGRESS);
        when(repository.findById(101L)).thenReturn(Optional.of(order));

        assertThrows(ProductionException.class, () -> service.startProduction(101L));
        verify(inventoryClient, never()).stockOut(any(), any());
    }

    @Test
    void completeProduction_stocksInFinishedGoodsAndMarksLinkedOrderReadyForDispatch() {
        ProductionOrder order = plannedOrder();
        order.setStatus(ProductionStatus.IN_PROGRESS);
        order.setBuyerOrderId(205L);
        order.setFinishedGoodsInventoryId(301L);
        when(repository.findById(101L)).thenReturn(Optional.of(order));

        ResponseEntity<ResponseStructure<ProductionOrderDTO>> response = service.completeProduction(101L, 590d);

        verify(inventoryClient).stockIn(301L, 590d);
        verify(buyerOrderClient).updateStatus(205L, "READY_FOR_DISPATCH");
        assertEquals(ProductionStatus.COMPLETED, response.getBody().getData().getStatus());
        assertEquals(590d, response.getBody().getData().getProducedQuantity());
    }

    @Test
    void completeProduction_cannotBeCalledTwice() {
        ProductionOrder order = plannedOrder();
        order.setStatus(ProductionStatus.COMPLETED);
        when(repository.findById(101L)).thenReturn(Optional.of(order));

        // This is exactly the guard that stops finished goods (and the
        // linked buyer order) from being double-counted / double-updated.
        assertThrows(ProductionException.class, () -> service.completeProduction(101L, 100d));
        verify(inventoryClient, never()).stockIn(any(), any());
    }

    @Test
    void completeProduction_rejectsZeroOrNegativeProducedQuantity() {
        ProductionOrder order = plannedOrder();
        order.setStatus(ProductionStatus.IN_PROGRESS);
        order.setFinishedGoodsInventoryId(301L);
        when(repository.findById(101L)).thenReturn(Optional.of(order));

        assertThrows(ProductionException.class, () -> service.completeProduction(101L, 0d));
    }

    @Test
    void completeProduction_findsTheOldestMatchingInProductionOrder_whenNoBuyerOrderIdSupplied() {
        ProductionOrder order = plannedOrder();
        order.setStatus(ProductionStatus.IN_PROGRESS);
        order.setFinishedGoodsInventoryId(301L);
        // no buyerOrderId set - must fall back to FIFO vendor+product match
        when(repository.findById(101L)).thenReturn(Optional.of(order));

        BuyerOrderDTO older = new BuyerOrderDTO();
        older.setOrderId(200L);
        older.setStatus("IN_PRODUCTION");
        older.setProductName("Basmati Rice");
        older.setOrderDate(LocalDate.of(2026, 1, 1));

        BuyerOrderDTO newer = new BuyerOrderDTO();
        newer.setOrderId(210L);
        newer.setStatus("IN_PRODUCTION");
        newer.setProductName("Basmati Rice");
        newer.setOrderDate(LocalDate.of(2026, 6, 1));

        ResponseStructure<List<BuyerOrderDTO>> ordersResponse = new ResponseStructure<>();
        ordersResponse.setData(List.of(newer, older));
        when(buyerOrderClient.getOrdersByVendor(101L)).thenReturn(ordersResponse);

        service.completeProduction(101L, 590d);

        // FIFO: the older order (200) must be the one marked READY_FOR_DISPATCH.
        verify(buyerOrderClient).updateStatus(200L, "READY_FOR_DISPATCH");
    }

    @Test
    void completeProduction_doesNotFailWhenNoMatchingBuyerOrderExists() {
        ProductionOrder order = plannedOrder();
        order.setStatus(ProductionStatus.IN_PROGRESS);
        order.setFinishedGoodsInventoryId(301L);
        when(repository.findById(101L)).thenReturn(Optional.of(order));

        ResponseStructure<List<BuyerOrderDTO>> ordersResponse = new ResponseStructure<>();
        ordersResponse.setData(List.of());
        when(buyerOrderClient.getOrdersByVendor(101L)).thenReturn(ordersResponse);

        assertDoesNotThrow(() -> service.completeProduction(101L, 590d));
        verify(buyerOrderClient, never()).updateStatus(any(), any());
    }

    @Test
    void resolvesFinishedGoodsInventoryByVendorAndProduct_whenNoInventoryIdSupplied() {
        ProductionOrder order = plannedOrder();
        order.setStatus(ProductionStatus.IN_PROGRESS);
        // no finishedGoodsInventoryId set
        when(repository.findById(101L)).thenReturn(Optional.of(order));

        InventoryDTO match = new InventoryDTO();
        match.setInventoryId(301L);
        match.setVendorId(101L);
        match.setMaterialName("Basmati Rice");
        ResponseStructure<List<InventoryDTO>> byName = new ResponseStructure<>();
        byName.setData(List.of(match));
        when(inventoryClient.getByMaterialName("Basmati Rice")).thenReturn(byName);

        ResponseStructure<List<BuyerOrderDTO>> ordersResponse = new ResponseStructure<>();
        ordersResponse.setData(List.of());
        when(buyerOrderClient.getOrdersByVendor(101L)).thenReturn(ordersResponse);

        service.completeProduction(101L, 590d);

        verify(inventoryClient).stockIn(301L, 590d);
    }

    @Test
    void cancelProduction_rejectsCancellingACompletedOrder() {
        ProductionOrder order = plannedOrder();
        order.setStatus(ProductionStatus.COMPLETED);
        when(repository.findById(101L)).thenReturn(Optional.of(order));

        assertThrows(ProductionException.class, () -> service.cancelProduction(101L));
    }

    @Test
    void createOrder_rejectsNegativeRawMaterialQuantity() {
        ProductionOrderDTO dto = new ProductionOrderDTO();
        dto.setVendorId(101L);
        dto.setProductName("Basmati Rice");
        dto.setRawMaterialInventoryId(501L);
        dto.setRawMaterialQuantity(-10d);
        dto.setUnit("Kg");

        assertThrows(ProductionException.class, () -> service.createOrder(dto));
    }
}
