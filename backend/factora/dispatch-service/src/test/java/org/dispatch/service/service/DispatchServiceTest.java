package org.dispatch.service.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import java.util.List;

import org.dispatch.service.ResponceEntity.ResponseStructure;
import org.dispatch.service.client.BuyerOrderClient;
import org.dispatch.service.client.InventoryClient;
import org.dispatch.service.client.VendorClient;
import org.dispatch.service.dto.BuyerOrderDTO;
import org.dispatch.service.dto.DispatchDTO;
import org.dispatch.service.dto.InventoryDTO;
import org.dispatch.service.dto.VendorDTO;
import org.dispatch.service.entity.DeliveryStatus;
import org.dispatch.service.entity.Dispatch;
import org.dispatch.service.exception.DispatchException;
import org.dispatch.service.repository.DispatchRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;

class DispatchServiceTest {

    @Mock
    private DispatchRepository repository;
    @Mock
    private VendorClient vendorClient;
    @Mock
    private InventoryClient inventoryClient;
    @Mock
    private BuyerOrderClient buyerOrderClient;

    @InjectMocks
    private DispatchService service;

    private final ModelMapper modelMapper = new ModelMapper();

    @BeforeEach
    void setUp() throws ReflectiveOperationException {
        MockitoAnnotations.openMocks(this);
        var field = DispatchService.class.getDeclaredField("modelMapper");
        field.setAccessible(true);
        field.set(service, modelMapper);

        when(vendorClient.getVendor(any())).thenReturn(new VendorDTO());
        when(repository.save(any(Dispatch.class))).thenAnswer(inv -> {
            Dispatch d = inv.getArgument(0);
            if (d.getDispatchId() == null) {
                d.setDispatchId(101L);
            }
            return d;
        });
    }

    private DispatchDTO newDispatchDto(Long buyerOrderId) {
        DispatchDTO dto = new DispatchDTO();
        dto.setVendorId(101L);
        dto.setBuyerId(101L);
        dto.setBuyerOrderId(buyerOrderId);
        dto.setProductName("Basmati Rice");
        dto.setQuantity(200d);
        dto.setUnit("Kg");
        dto.setVehicleNumber("KA-01-AB-1234");
        dto.setDriverName("Ravi Kumar");
        dto.setDestinationAddress("Warehouse 4, Bengaluru");
        return dto;
    }

    private ResponseStructure<BuyerOrderDTO> buyerOrderResponse(String status) {
        BuyerOrderDTO order = new BuyerOrderDTO();
        order.setOrderId(205L);
        order.setStatus(status);
        ResponseStructure<BuyerOrderDTO> response = new ResponseStructure<>();
        response.setData(order);
        return response;
    }

    private ResponseStructure<InventoryDTO> inventoryOf(double quantity) {
        InventoryDTO inv = new InventoryDTO();
        inv.setInventoryId(301L);
        inv.setQuantity(quantity);
        ResponseStructure<InventoryDTO> response = new ResponseStructure<>();
        response.setData(inv);
        return response;
    }

    @Test
    void createsDispatchAndMarksTheLinkedOrderDispatched_whenOrderIsReadyForDispatch() {
        DispatchDTO dto = newDispatchDto(205L);
        dto.setFinishedGoodsInventoryId(301L);

        when(repository.findByBuyerOrderId(205L)).thenReturn(List.of());
        when(buyerOrderClient.getOrderById(205L)).thenReturn(buyerOrderResponse("READY_FOR_DISPATCH"));
        when(inventoryClient.getById(301L)).thenReturn(inventoryOf(500d));

        ResponseEntity<ResponseStructure<DispatchDTO>> response = service.createDispatch(dto);

        assertEquals(201, response.getStatusCode().value());
        verify(inventoryClient).stockOut(301L, 200d);
        verify(buyerOrderClient).updateStatus(205L, "DISPATCHED");
    }

    @Test
    void rejectsDispatchWhenLinkedOrderIsNotReadyForDispatch() {
        DispatchDTO dto = newDispatchDto(205L);
        dto.setFinishedGoodsInventoryId(301L);

        when(repository.findByBuyerOrderId(205L)).thenReturn(List.of());
        when(buyerOrderClient.getOrderById(205L)).thenReturn(buyerOrderResponse("IN_PRODUCTION"));

        // This is exactly the case my OrderList.jsx fix prevents from ever
        // being reachable through the UI - covering it here guards the
        // backend rule independently of the frontend.
        assertThrows(DispatchException.class, () -> service.createDispatch(dto));
        verify(inventoryClient, never()).stockOut(any(), any());
        verify(buyerOrderClient, never()).updateStatus(any(), any());
    }

    @Test
    void rejectsASecondDispatchForTheSameOrder() {
        DispatchDTO dto = newDispatchDto(205L);
        dto.setFinishedGoodsInventoryId(301L);

        Dispatch existing = new Dispatch();
        existing.setDeliveryStatus(DeliveryStatus.PENDING);
        when(repository.findByBuyerOrderId(205L)).thenReturn(List.of(existing));

        assertThrows(DispatchException.class, () -> service.createDispatch(dto));
        verify(buyerOrderClient, never()).getOrderById(any());
    }

    @Test
    void allowsRedispatchIfThePreviousDispatchForThatOrderWasCancelled() {
        DispatchDTO dto = newDispatchDto(205L);
        dto.setFinishedGoodsInventoryId(301L);

        Dispatch cancelled = new Dispatch();
        cancelled.setDeliveryStatus(DeliveryStatus.CANCELLED);
        when(repository.findByBuyerOrderId(205L)).thenReturn(List.of(cancelled));
        when(buyerOrderClient.getOrderById(205L)).thenReturn(buyerOrderResponse("READY_FOR_DISPATCH"));
        when(inventoryClient.getById(301L)).thenReturn(inventoryOf(500d));

        assertDoesNotThrow(() -> service.createDispatch(dto));
    }

    @Test
    void rejectsDispatchWhenRequestedQuantityExceedsAvailableStock() {
        DispatchDTO dto = newDispatchDto(205L);
        dto.setFinishedGoodsInventoryId(301L);
        dto.setQuantity(1000d);

        when(repository.findByBuyerOrderId(205L)).thenReturn(List.of());
        when(buyerOrderClient.getOrderById(205L)).thenReturn(buyerOrderResponse("READY_FOR_DISPATCH"));
        when(inventoryClient.getById(301L)).thenReturn(inventoryOf(50d));

        assertThrows(DispatchException.class, () -> service.createDispatch(dto));
        verify(inventoryClient, never()).stockOut(any(), any());
    }

    @Test
    void rejectsZeroOrNegativeQuantity() {
        DispatchDTO dto = newDispatchDto(null);
        dto.setQuantity(0d);

        assertThrows(DispatchException.class, () -> service.createDispatch(dto));
    }

    @Test
    void resolvesInventoryByVendorAndProductWhenNoInventoryIdIsSupplied() {
        DispatchDTO dto = newDispatchDto(null); // no buyerOrderId, no finishedGoodsInventoryId
        InventoryDTO match = new InventoryDTO();
        match.setInventoryId(301L);
        match.setVendorId(101L);
        match.setMaterialName("Basmati Rice");
        ResponseStructure<List<InventoryDTO>> byName = new ResponseStructure<>();
        byName.setData(List.of(match));
        when(inventoryClient.getByMaterialName("Basmati Rice")).thenReturn(byName);
        when(inventoryClient.getById(301L)).thenReturn(inventoryOf(500d));

        assertDoesNotThrow(() -> service.createDispatch(dto));
        verify(inventoryClient).stockOut(eq(301L), eq(200d));
    }

    @Test
    void throwsAHelpfulErrorWhenNoMatchingInventoryExistsAtAll() {
        DispatchDTO dto = newDispatchDto(null);
        ResponseStructure<List<InventoryDTO>> empty = new ResponseStructure<>();
        empty.setData(List.of());
        when(inventoryClient.getByMaterialName("Basmati Rice")).thenReturn(empty);

        DispatchException ex = assertThrows(DispatchException.class, () -> service.createDispatch(dto));
        assertTrue(ex.getMessage().contains("No finished-goods Inventory record found"));
    }

    @Test
    void skipsOrderLookupEntirelyWhenDispatchHasNoLinkedBuyerOrder() {
        DispatchDTO dto = newDispatchDto(null);
        dto.setFinishedGoodsInventoryId(301L);
        when(inventoryClient.getById(301L)).thenReturn(inventoryOf(500d));

        assertDoesNotThrow(() -> service.createDispatch(dto));
        verify(buyerOrderClient, never()).getOrderById(any());
        verify(buyerOrderClient, never()).updateStatus(any(), any());
    }
}
