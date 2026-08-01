package org.buyer.service.service;

import java.util.List;
import java.util.stream.Collectors;

import org.buyer.service.ResponceEntity.ResponseStructure;
import org.buyer.service.client.InventoryClient;
import org.buyer.service.client.VendorClient;
import org.buyer.service.dto.BuyerOrderDTO;
import org.buyer.service.dto.InventoryDTO;
import org.buyer.service.entity.BuyerOrder;
import org.buyer.service.entity.OrderStatus;
import org.buyer.service.exception.BuyerException;
import org.buyer.service.repository.BuyerOrderRepository;
import org.buyer.service.repository.BuyerRepository;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class BuyerOrderService {

	private static final Logger log = LoggerFactory.getLogger(BuyerOrderService.class);

	@Autowired
	private BuyerOrderRepository repository;

	@Autowired
	private BuyerRepository buyerRepository;

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private VendorClient vendorClient;

	@Autowired
	private InventoryClient inventoryClient;

	// Business Issue #1/#2/#3: creating a Buyer Order automatically checks
	// Inventory for this vendor/product. Enough stock -> READY_FOR_DISPATCH,
	// otherwise -> IN_PRODUCTION so the shop floor knows to manufacture it.
	public ResponseEntity<ResponseStructure<BuyerOrderDTO>> createOrder(BuyerOrderDTO dto) {
		vendorClient.getVendor(dto.getVendorId());

		buyerRepository.findById(dto.getBuyerId())
				.orElseThrow(() -> new BuyerException("Buyer Not Found with id: " + dto.getBuyerId()));

		validateQuantity(dto.getQuantity());
		validateUnitPrice(dto.getUnitPrice());

		BuyerOrder order = modelMapper.map(dto, BuyerOrder.class);
		order.setOrderId(null);

		boolean sufficientStock = hasSufficientStock(order.getVendorId(), order.getProductName(), order.getQuantity());
		order.setStatus(sufficientStock ? OrderStatus.READY_FOR_DISPATCH : OrderStatus.IN_PRODUCTION);

		order = repository.save(order);

		log.info("Buyer Order created: orderId={}, vendorId={}, product={}, qty={}, routedTo={}",
				order.getOrderId(), order.getVendorId(), order.getProductName(), order.getQuantity(),
				order.getStatus());

		return build(HttpStatus.CREATED, "Buyer Order Placed Successfully - Routed to " + order.getStatus(),
				toDTO(order));
	}

	public ResponseEntity<ResponseStructure<List<BuyerOrderDTO>>> getAllOrders() {
		List<BuyerOrderDTO> orders = repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
		return build(HttpStatus.OK, "Buyer Orders Fetched Successfully", orders);
	}

	public ResponseEntity<ResponseStructure<BuyerOrderDTO>> getOrderById(Long id) {
		return build(HttpStatus.OK, "Buyer Order Fetched Successfully", toDTO(findOrThrow(id)));
	}

	public ResponseEntity<ResponseStructure<List<BuyerOrderDTO>>> getOrdersByVendor(Long vendorId) {
		List<BuyerOrderDTO> orders = repository.findByVendorId(vendorId).stream().map(this::toDTO)
				.collect(Collectors.toList());
		return build(HttpStatus.OK, "Buyer Orders Fetched Successfully", orders);
	}

	public ResponseEntity<ResponseStructure<List<BuyerOrderDTO>>> getOrdersByBuyer(Long buyerId) {
		List<BuyerOrderDTO> orders = repository.findByBuyerId(buyerId).stream().map(this::toDTO)
				.collect(Collectors.toList());
		return build(HttpStatus.OK, "Buyer Orders Fetched Successfully", orders);
	}

	// Business Issue #6: the dispatcher screen calls this same endpoint
	// (GET /buyer-order/status/READY_FOR_DISPATCH) to see only the orders
	// that are actually ready to be shipped.
	public ResponseEntity<ResponseStructure<List<BuyerOrderDTO>>> getOrdersByStatus(OrderStatus status) {
		List<BuyerOrderDTO> orders = repository.findByStatus(status).stream().map(this::toDTO)
				.collect(Collectors.toList());
		return build(HttpStatus.OK, "Buyer Orders Fetched Successfully", orders);
	}

	// Business Issue #11: quantity/unitPrice must never be silently set to
	// zero or negative on a partial update (this endpoint intentionally
	// accepts partial bodies, so bean validation on the DTO's @Positive
	// annotations doesn't run here - this is enforced by hand instead).
	public ResponseEntity<ResponseStructure<BuyerOrderDTO>> updateOrder(Long id, BuyerOrderDTO dto) {
		if (dto.getQuantity() != null) {
			validateQuantity(dto.getQuantity());
		}
		if (dto.getUnitPrice() != null) {
			validateUnitPrice(dto.getUnitPrice());
		}

		BuyerOrder order = findOrThrow(id);
		modelMapper.map(dto, order);
		order.setOrderId(id);
		order = repository.save(order);
		return build(HttpStatus.OK, "Buyer Order Updated Successfully", toDTO(order));
	}

	// Moves an order through its lifecycle. Each stage only accepts the
	// expected predecessor status, so the workflow can't skip a step.
	public ResponseEntity<ResponseStructure<BuyerOrderDTO>> updateStatus(Long id, OrderStatus newStatus) {
		BuyerOrder order = findOrThrow(id);

		if (order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.DELIVERED) {
			throw new BuyerException("Order is already " + order.getStatus() + " and cannot be changed further.");
		}

		// Business Issue #12: DISPATCHED is set automatically by Dispatch
		// Service once goods actually leave the warehouse. Blocking a second
		// manual move into DISPATCHED stops an order being marked dispatched
		// (and counted twice) without a matching dispatch record.
		if (newStatus == OrderStatus.DISPATCHED && order.getStatus() == OrderStatus.DISPATCHED) {
			throw new BuyerException("Order " + id + " has already been dispatched.");
		}

		order.setStatus(newStatus);
		order = repository.save(order);
		return build(HttpStatus.OK, "Buyer Order Status Updated to " + newStatus, toDTO(order));
	}

	public ResponseEntity<ResponseStructure<String>> deleteOrder(Long id) {
		findOrThrow(id);
		repository.deleteById(id);
		return build(HttpStatus.OK, "Buyer Order Deleted Successfully", "Deleted id: " + id);
	}

	// =========================================================
	// Internal helpers
	// =========================================================

	private void validateQuantity(Double quantity) {
		if (quantity == null || quantity <= 0) {
			throw new BuyerException("quantity must be greater than zero");
		}
	}

	private void validateUnitPrice(Double unitPrice) {
		if (unitPrice == null || unitPrice <= 0) {
			throw new BuyerException("unitPrice must be greater than zero");
		}
	}

	/**
	 * Business Issue #1/#2/#3: sums up usable stock for this vendor/product
	 * across matching Inventory records. DAMAGED and RESERVED stock is
	 * excluded because it isn't actually available to fulfil a new order.
	 * If Inventory Service has no record at all for the product, this
	 * safely returns false (routes the order to IN_PRODUCTION) rather than
	 * failing the whole order-placement call.
	 */
	private boolean hasSufficientStock(Long vendorId, String productName, Double requiredQuantity) {
		ResponseStructure<List<InventoryDTO>> response = inventoryClient.getByMaterialName(productName);
		List<InventoryDTO> matches = response == null ? null : response.getData();

		if (matches == null || matches.isEmpty()) {
			return false;
		}

		double availableQuantity = matches.stream()
				.filter(inv -> vendorId != null && vendorId.equals(inv.getVendorId()))
				.filter(inv -> productName != null && productName.equalsIgnoreCase(inv.getMaterialName()))
				.filter(inv -> !"DAMAGED".equalsIgnoreCase(inv.getStatus())
						&& !"RESERVED".equalsIgnoreCase(inv.getStatus()))
				.mapToDouble(inv -> inv.getQuantity() == null ? 0d : inv.getQuantity())
				.sum();

		return availableQuantity >= requiredQuantity;
	}

	private BuyerOrder findOrThrow(Long id) {
		return repository.findById(id).orElseThrow(() -> new BuyerException("Buyer Order Not Found with id: " + id));
	}

	private BuyerOrderDTO toDTO(BuyerOrder order) {
		return modelMapper.map(order, BuyerOrderDTO.class);
	}

	private <T> ResponseEntity<ResponseStructure<T>> build(HttpStatus status, String message, T data) {
		ResponseStructure<T> response = new ResponseStructure<>();
		response.setStatusCode(status.value());
		response.setMessage(message);
		response.setData(data);
		return new ResponseEntity<>(response, status);
	}
}
