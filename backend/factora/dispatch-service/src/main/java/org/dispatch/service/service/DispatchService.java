package org.dispatch.service.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.dispatch.service.ResponceEntity.ResponseStructure;
import org.dispatch.service.client.BuyerOrderClient;
import org.dispatch.service.client.InventoryClient;
import org.dispatch.service.client.VendorClient;
import org.dispatch.service.dto.BuyerOrderDTO;
import org.dispatch.service.dto.DispatchDTO;
import org.dispatch.service.dto.InventoryDTO;
import org.dispatch.service.entity.DeliveryStatus;
import org.dispatch.service.entity.Dispatch;
import org.dispatch.service.exception.BuyerOrderServiceException;
import org.dispatch.service.exception.DispatchException;
import org.dispatch.service.repository.DispatchRepository;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class DispatchService {

	private static final Logger log = LoggerFactory.getLogger(DispatchService.class);

	private static final String BUYER_ORDER_STATUS_READY_FOR_DISPATCH = "READY_FOR_DISPATCH";
	private static final String BUYER_ORDER_STATUS_DISPATCHED = "DISPATCHED";

	@Autowired
	private DispatchRepository repository;

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private VendorClient vendorClient;

	@Autowired
	private InventoryClient inventoryClient;

	@Autowired
	private BuyerOrderClient buyerOrderClient;

	// Business Issues #6-#9, #12: validates the linked Buyer Order is really
	// READY_FOR_DISPATCH (and not already dispatched), re-validates and
	// reduces Inventory atomically, then marks the Buyer Order DISPATCHED.
	public ResponseEntity<ResponseStructure<DispatchDTO>> createDispatch(DispatchDTO dto) {

		vendorClient.getVendor(dto.getVendorId());

		if (dto.getQuantity() == null || dto.getQuantity() <= 0) {
			throw new DispatchException("quantity must be greater than zero");
		}

		Long buyerOrderId = dto.getBuyerOrderId();
		if (buyerOrderId != null) {
			// Business Issue #12: block a second dispatch for the same order.
			boolean alreadyDispatched = repository.findByBuyerOrderId(buyerOrderId).stream()
					.anyMatch(d -> d.getDeliveryStatus() != DeliveryStatus.CANCELLED);
			if (alreadyDispatched) {
				throw new DispatchException("Buyer Order " + buyerOrderId + " has already been dispatched.");
			}

			// Business Issue #6/#7: only an order the Buyer Service still
			// considers READY_FOR_DISPATCH may be shipped.
			BuyerOrderDTO buyerOrder = fetchBuyerOrder(buyerOrderId);
			if (!BUYER_ORDER_STATUS_READY_FOR_DISPATCH.equalsIgnoreCase(buyerOrder.getStatus())) {
				throw new DispatchException("Buyer Order " + buyerOrderId
						+ " is not READY_FOR_DISPATCH (current status: " + buyerOrder.getStatus() + ").");
			}
		}

		Long inventoryId = resolveFinishedGoodsInventoryId(dto);

		// Business Issue #7: explicitly re-check available quantity right
		// before dispatch (stock may have changed since the order was
		// placed or since another dispatch was created).
		ResponseStructure<InventoryDTO> inventoryResponse = inventoryClient.getById(inventoryId);
		InventoryDTO inventory = inventoryResponse == null ? null : inventoryResponse.getData();
		double availableQuantity = (inventory == null || inventory.getQuantity() == null) ? 0d
				: inventory.getQuantity();
		if (availableQuantity < dto.getQuantity()) {
			throw new DispatchException("Insufficient stock to dispatch: requested " + dto.getQuantity()
					+ " but only " + availableQuantity + " available (inventoryId=" + inventoryId + ").");
		}

		// Business Issue #8/#9: Inventory Service also independently
		// validates sufficient stock and reduces it atomically; it never
		// allows stock to go negative and throws if there isn't enough.
		inventoryClient.stockOut(inventoryId, dto.getQuantity());
		log.info("Inventory reduced for dispatch: inventoryId={}, qty={}", inventoryId, dto.getQuantity());

		Dispatch dispatch = modelMapper.map(dto, Dispatch.class);
		dispatch.setDispatchId(null);
		dispatch.setFinishedGoodsInventoryId(inventoryId);
		dispatch = repository.save(dispatch);

		String message = "Dispatch Created Successfully - Inventory Updated";
		if (buyerOrderId != null) {
			buyerOrderClient.updateStatus(buyerOrderId, BUYER_ORDER_STATUS_DISPATCHED);
			message += " and Buyer Order " + buyerOrderId + " marked DISPATCHED";
			log.info("Buyer Order updated: orderId={}, status=DISPATCHED (via dispatchId={})", buyerOrderId,
					dispatch.getDispatchId());
		}

		return build(HttpStatus.CREATED, message, toDTO(dispatch));
	}

	public ResponseEntity<ResponseStructure<List<DispatchDTO>>> getAllDispatches() {
		List<DispatchDTO> dispatches = repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
		return build(HttpStatus.OK, "Dispatches Fetched Successfully", dispatches);
	}

	public ResponseEntity<ResponseStructure<DispatchDTO>> getDispatchById(Long id) {
		return build(HttpStatus.OK, "Dispatch Fetched Successfully", toDTO(findOrThrow(id)));
	}

	public ResponseEntity<ResponseStructure<List<DispatchDTO>>> getDispatchesByVendor(Long vendorId) {
		List<DispatchDTO> dispatches = repository.findByVendorId(vendorId).stream().map(this::toDTO)
				.collect(Collectors.toList());
		return build(HttpStatus.OK, "Dispatches Fetched Successfully", dispatches);
	}

	public ResponseEntity<ResponseStructure<List<DispatchDTO>>> getDispatchesByBuyer(Long buyerId) {
		List<DispatchDTO> dispatches = repository.findByBuyerId(buyerId).stream().map(this::toDTO)
				.collect(Collectors.toList());
		return build(HttpStatus.OK, "Dispatches Fetched Successfully", dispatches);
	}

	public ResponseEntity<ResponseStructure<List<DispatchDTO>>> getDispatchesByStatus(DeliveryStatus status) {
		List<DispatchDTO> dispatches = repository.findByDeliveryStatus(status).stream().map(this::toDTO)
				.collect(Collectors.toList());
		return build(HttpStatus.OK, "Dispatches Fetched Successfully", dispatches);
	}

	// Business Issue #11: quantity must never be silently set to zero/negative
	// on a partial update (this endpoint intentionally accepts partial bodies,
	// so the DTO's @Positive annotation doesn't run here).
	public ResponseEntity<ResponseStructure<DispatchDTO>> updateDispatch(Long id, DispatchDTO dto) {
		if (dto.getQuantity() != null && dto.getQuantity() <= 0) {
			throw new DispatchException("quantity must be greater than zero");
		}

		Dispatch dispatch = findOrThrow(id);
		modelMapper.map(dto, dispatch);
		dispatch.setDispatchId(id);
		dispatch = repository.save(dispatch);
		return build(HttpStatus.OK, "Dispatch Updated Successfully", toDTO(dispatch));
	}

	public ResponseEntity<ResponseStructure<DispatchDTO>> markInTransit(Long id) {
		Dispatch dispatch = findOrThrow(id);
		if (dispatch.getDeliveryStatus() != DeliveryStatus.PENDING) {
			throw new DispatchException("Only PENDING dispatches can move to IN_TRANSIT. Current status: "
					+ dispatch.getDeliveryStatus());
		}
		dispatch.setDeliveryStatus(DeliveryStatus.IN_TRANSIT);
		dispatch = repository.save(dispatch);
		return build(HttpStatus.OK, "Dispatch marked IN_TRANSIT", toDTO(dispatch));
	}

	public ResponseEntity<ResponseStructure<DispatchDTO>> markDelivered(Long id) {
		Dispatch dispatch = findOrThrow(id);
		if (dispatch.getDeliveryStatus() != DeliveryStatus.IN_TRANSIT) {
			throw new DispatchException("Only IN_TRANSIT dispatches can be marked DELIVERED. Current status: "
					+ dispatch.getDeliveryStatus());
		}
		dispatch.setDeliveryStatus(DeliveryStatus.DELIVERED);
		dispatch = repository.save(dispatch);
		return build(HttpStatus.OK, "Dispatch marked DELIVERED", toDTO(dispatch));
	}

	public ResponseEntity<ResponseStructure<DispatchDTO>> cancelDispatch(Long id) {
		Dispatch dispatch = findOrThrow(id);
		if (dispatch.getDeliveryStatus() == DeliveryStatus.DELIVERED) {
			throw new DispatchException("A DELIVERED dispatch cannot be cancelled.");
		}
		dispatch.setDeliveryStatus(DeliveryStatus.CANCELLED);
		dispatch = repository.save(dispatch);
		return build(HttpStatus.OK, "Dispatch Cancelled", toDTO(dispatch));
	}

	public ResponseEntity<ResponseStructure<String>> deleteDispatch(Long id) {
		findOrThrow(id);
		repository.deleteById(id);
		return build(HttpStatus.OK, "Dispatch Deleted Successfully", "Deleted id: " + id);
	}

	// =========================================================
	// Internal helpers
	// =========================================================

	private BuyerOrderDTO fetchBuyerOrder(Long buyerOrderId) {
		ResponseStructure<BuyerOrderDTO> response = buyerOrderClient.getOrderById(buyerOrderId);
		if (response == null || response.getData() == null) {
			throw new BuyerOrderServiceException("Buyer Order Not Found with id: " + buyerOrderId,
					HttpStatus.NOT_FOUND);
		}
		return response.getData();
	}

	/**
	 * Uses the explicit finishedGoodsInventoryId if the caller supplied one;
	 * otherwise finds an Inventory record for the same vendorId + productName.
	 * Throws if no such Inventory record exists, since Dispatch Service has no
	 * endpoint of its own to create a brand-new Inventory item.
	 */
	private Long resolveFinishedGoodsInventoryId(DispatchDTO dto) {
		if (dto.getFinishedGoodsInventoryId() != null) {
			return dto.getFinishedGoodsInventoryId();
		}

		ResponseStructure<List<InventoryDTO>> response = inventoryClient.getByMaterialName(dto.getProductName());
		List<InventoryDTO> matches = response == null ? null : response.getData();

		Optional<InventoryDTO> match = (matches == null ? List.<InventoryDTO>of() : matches).stream()
				.filter(inv -> dto.getVendorId() != null && dto.getVendorId().equals(inv.getVendorId()))
				.filter(inv -> dto.getProductName() != null && dto.getProductName().equalsIgnoreCase(inv.getMaterialName()))
				.findFirst();

		return match.map(InventoryDTO::getInventoryId).orElseThrow(() -> new DispatchException(
				"No finished-goods Inventory record found for vendorId=" + dto.getVendorId() + ", product="
						+ dto.getProductName() + ". Add an Inventory record for this product first, or supply"
						+ " finishedGoodsInventoryId on the dispatch."));
	}

	private Dispatch findOrThrow(Long id) {
		return repository.findById(id).orElseThrow(() -> new DispatchException("Dispatch Not Found with id: " + id));
	}

	private DispatchDTO toDTO(Dispatch dispatch) {
		return modelMapper.map(dispatch, DispatchDTO.class);
	}

	private <T> ResponseEntity<ResponseStructure<T>> build(HttpStatus status, String message, T data) {
		ResponseStructure<T> response = new ResponseStructure<>();
		response.setStatusCode(status.value());
		response.setMessage(message);
		response.setData(data);
		return new ResponseEntity<>(response, status);
	}
}
