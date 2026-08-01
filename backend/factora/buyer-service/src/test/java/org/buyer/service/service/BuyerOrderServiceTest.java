package org.buyer.service.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.buyer.service.ResponceEntity.ResponseStructure;
import org.buyer.service.client.InventoryClient;
import org.buyer.service.client.VendorClient;
import org.buyer.service.dto.BuyerOrderDTO;
import org.buyer.service.dto.InventoryDTO;
import org.buyer.service.dto.VendorDTO;
import org.buyer.service.entity.Buyer;
import org.buyer.service.entity.BuyerOrder;
import org.buyer.service.entity.OrderStatus;
import org.buyer.service.exception.BuyerException;
import org.buyer.service.repository.BuyerOrderRepository;
import org.buyer.service.repository.BuyerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;

/**
 * Regression coverage for the automatic order-routing logic that decides
 * whether a new Buyer Order goes to READY_FOR_DISPATCH or IN_PRODUCTION,
 * and for the guard that stops an order being manually re-marked
 * DISPATCHED. These two rules were the root cause of the original
 * "adding dispatch/buyer order fails" bug on the frontend.
 */
class BuyerOrderServiceTest {

    @Mock
    private BuyerOrderRepository repository;
    @Mock
    private BuyerRepository buyerRepository;
    @Mock
    private VendorClient vendorClient;
    @Mock
    private InventoryClient inventoryClient;

    @InjectMocks
    private BuyerOrderService service;

    private final ModelMapper modelMapper = new ModelMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // BuyerOrderService's @Autowired ModelMapper field is private with no
        // setter, so wire a real instance in via the same field Mockito
        // would otherwise leave null.
        try {
            var field = BuyerOrderService.class.getDeclaredField("modelMapper");
            field.setAccessible(true);
            field.set(service, modelMapper);
        } catch (ReflectiveOperationException e) {
            throw new RuntimeException(e);
        }

        when(vendorClient.getVendor(any())).thenReturn(new VendorDTO());
        when(buyerRepository.findById(any())).thenReturn(Optional.of(new Buyer()));
        when(repository.save(any(BuyerOrder.class))).thenAnswer(inv -> {
            BuyerOrder o = inv.getArgument(0);
            if (o.getOrderId() == null) {
                o.setOrderId(101L);
            }
            return o;
        });
    }

    private BuyerOrderDTO newOrderDto() {
        BuyerOrderDTO dto = new BuyerOrderDTO();
        dto.setVendorId(101L);
        dto.setBuyerId(101L);
        dto.setProductName("Basmati Rice");
        dto.setQuantity(500d);
        dto.setUnit("Kg");
        dto.setUnitPrice(40d);
        return dto;
    }

    private ResponseStructure<List<InventoryDTO>> inventoryResponse(InventoryDTO... items) {
        ResponseStructure<List<InventoryDTO>> response = new ResponseStructure<>();
        response.setData(List.of(items));
        return response;
    }

    private InventoryDTO inventoryItem(Long vendorId, String materialName, Double qty, String status) {
        InventoryDTO dto = new InventoryDTO();
        dto.setVendorId(vendorId);
        dto.setMaterialName(materialName);
        dto.setQuantity(qty);
        dto.setStatus(status);
        return dto;
    }

    @Test
    void routesToReadyForDispatch_whenEnoughStockExists() {
        when(inventoryClient.getByMaterialName("Basmati Rice"))
                .thenReturn(inventoryResponse(inventoryItem(101L, "Basmati Rice", 1000d, "AVAILABLE")));

        ResponseEntity<ResponseStructure<BuyerOrderDTO>> response = service.createOrder(newOrderDto());

        assertEquals(OrderStatus.READY_FOR_DISPATCH, response.getBody().getData().getStatus());
    }

    @Test
    void routesToInProduction_whenStockIsInsufficient() {
        when(inventoryClient.getByMaterialName("Basmati Rice"))
                .thenReturn(inventoryResponse(inventoryItem(101L, "Basmati Rice", 10d, "AVAILABLE")));

        ResponseEntity<ResponseStructure<BuyerOrderDTO>> response = service.createOrder(newOrderDto());

        assertEquals(OrderStatus.IN_PRODUCTION, response.getBody().getData().getStatus());
    }

    @Test
    void routesToInProduction_whenNoInventoryRecordExistsAtAll() {
        when(inventoryClient.getByMaterialName("Basmati Rice")).thenReturn(inventoryResponse());

        ResponseEntity<ResponseStructure<BuyerOrderDTO>> response = service.createOrder(newOrderDto());

        assertEquals(OrderStatus.IN_PRODUCTION, response.getBody().getData().getStatus());
    }

    @Test
    void ignoresDamagedAndReservedStockWhenCheckingAvailability() {
        when(inventoryClient.getByMaterialName("Basmati Rice")).thenReturn(inventoryResponse(
                inventoryItem(101L, "Basmati Rice", 1000d, "DAMAGED"),
                inventoryItem(101L, "Basmati Rice", 1000d, "RESERVED")));

        ResponseEntity<ResponseStructure<BuyerOrderDTO>> response = service.createOrder(newOrderDto());

        // DAMAGED/RESERVED stock must not count as available, so this still
        // routes to IN_PRODUCTION despite 2000 units existing on paper.
        assertEquals(OrderStatus.IN_PRODUCTION, response.getBody().getData().getStatus());
    }

    @Test
    void ignoresStockBelongingToADifferentVendor() {
        when(inventoryClient.getByMaterialName("Basmati Rice"))
                .thenReturn(inventoryResponse(inventoryItem(999L, "Basmati Rice", 1000d, "AVAILABLE")));

        ResponseEntity<ResponseStructure<BuyerOrderDTO>> response = service.createOrder(newOrderDto());

        assertEquals(OrderStatus.IN_PRODUCTION, response.getBody().getData().getStatus());
    }

    @Test
    void rejectsZeroOrNegativeQuantity() {
        BuyerOrderDTO dto = newOrderDto();
        dto.setQuantity(0d);

        assertThrows(BuyerException.class, () -> service.createOrder(dto));
        verifyNoInteractions(repository);
    }

    @Test
    void rejectsZeroOrNegativeUnitPrice() {
        BuyerOrderDTO dto = newOrderDto();
        dto.setUnitPrice(-5d);

        assertThrows(BuyerException.class, () -> service.createOrder(dto));
    }

    @Test
    void throwsWhenBuyerDoesNotExist() {
        when(buyerRepository.findById(any())).thenReturn(Optional.empty());

        assertThrows(BuyerException.class, () -> service.createOrder(newOrderDto()));
    }

    // ---- updateStatus guard: this is the fix for Business Issue #12 ----

    @Test
    void blocksMarkingAnAlreadyDispatchedOrderDispatchedAgain() {
        BuyerOrder existing = new BuyerOrder();
        existing.setOrderId(101L);
        existing.setStatus(OrderStatus.DISPATCHED);
        when(repository.findById(101L)).thenReturn(Optional.of(existing));

        assertThrows(BuyerException.class, () -> service.updateStatus(101L, OrderStatus.DISPATCHED));
        verify(repository, never()).save(any());
    }

    @Test
    void blocksAnyFurtherChangeOnceDeliveredOrCancelled() {
        BuyerOrder delivered = new BuyerOrder();
        delivered.setOrderId(101L);
        delivered.setStatus(OrderStatus.DELIVERED);
        when(repository.findById(101L)).thenReturn(Optional.of(delivered));

        assertThrows(BuyerException.class, () -> service.updateStatus(101L, OrderStatus.CANCELLED));
    }

    @Test
    void allowsTheFirstTransitionIntoDispatched() {
        BuyerOrder existing = new BuyerOrder();
        existing.setOrderId(101L);
        existing.setStatus(OrderStatus.READY_FOR_DISPATCH);
        when(repository.findById(101L)).thenReturn(Optional.of(existing));
        when(repository.save(any(BuyerOrder.class))).thenAnswer(inv -> inv.getArgument(0));

        ArgumentCaptor<BuyerOrder> captor = ArgumentCaptor.forClass(BuyerOrder.class);
        service.updateStatus(101L, OrderStatus.DISPATCHED);

        verify(repository).save(captor.capture());
        assertEquals(OrderStatus.DISPATCHED, captor.getValue().getStatus());
    }
}
