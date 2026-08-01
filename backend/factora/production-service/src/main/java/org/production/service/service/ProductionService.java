package org.production.service.service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.production.service.ResponceEntity.ResponseStructure;
import org.production.service.client.BuyerOrderClient;
import org.production.service.client.InventoryClient;
import org.production.service.client.VendorClient;
import org.production.service.dto.BuyerOrderDTO;
import org.production.service.dto.InventoryDTO;
import org.production.service.dto.ProductionOrderDTO;
import org.production.service.entity.ProductionOrder;
import org.production.service.entity.ProductionStatus;
import org.production.service.exception.BuyerOrderServiceException;
import org.production.service.exception.ProductionException;
import org.production.service.repository.ProductionOrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class ProductionService {

	private static final Logger log = LoggerFactory.getLogger(ProductionService.class);

	private static final String BUYER_ORDER_STATUS_IN_PRODUCTION = "IN_PRODUCTION";
	private static final String BUYER_ORDER_STATUS_READY_FOR_DISPATCH = "READY_FOR_DISPATCH";

	@Autowired
	private ProductionOrderRepository repository;

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private VendorClient vendorClient;

	@Autowired
	private InventoryClient inventoryClient;

	@Autowired
	private BuyerOrderClient buyerOrderClient;

	public ResponseEntity<ResponseStructure<ProductionOrderDTO>> createOrder(ProductionOrderDTO dto) {

		// Validates the vendor exists via Auth Service; throws VendorServiceException
		// (mapped to 404/503 by GlobalExceptionHandler) if it doesn't.
		vendorClient.getVendor(dto.getVendorId());

		validateRawMaterialQuantity(dto.getRawMaterialQuantity());

		ProductionOrder order = modelMapper.map(dto, ProductionOrder.class);
		order.setProductionOrderId(null);
		order = repository.save(order);

		return build(HttpStatus.CREATED, "Production Order Created Successfully", toDTO(order));
	}

	public ResponseEntity<ResponseStructure<List<ProductionOrderDTO>>> getAllOrders() {
		List<ProductionOrderDTO> orders = repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
		return build(HttpStatus.OK, "Production Orders Fetched Successfully", orders);
	}

	public ResponseEntity<ResponseStructure<ProductionOrderDTO>> getOrderById(Long id) {
		ProductionOrder order = findOrThrow(id);
		return build(HttpStatus.OK, "Production Order Fetched Successfully", toDTO(order));
	}

	public ResponseEntity<ResponseStructure<List<ProductionOrderDTO>>> getOrdersByVendor(Long vendorId) {
		List<ProductionOrderDTO> orders = repository.findByVendorId(vendorId).stream().map(this::toDTO)
				.collect(Collectors.toList());
		return build(HttpStatus.OK, "Production Orders Fetched Successfully", orders);
	}

	public ResponseEntity<ResponseStructure<List<ProductionOrderDTO>>> getOrdersByStatus(ProductionStatus status) {
		List<ProductionOrderDTO> orders = repository.findByStatus(status).stream().map(this::toDTO)
				.collect(Collectors.toList());
		return build(HttpStatus.OK, "Production Orders Fetched Successfully", orders);
	}

	public ResponseEntity<ResponseStructure<ProductionOrderDTO>> updateOrder(Long id, ProductionOrderDTO dto) {
		if (dto.getRawMaterialQuantity() != null) {
			validateRawMaterialQuantity(dto.getRawMaterialQuantity());
		}
		if (dto.getProducedQuantity() != null && dto.getProducedQuantity() <= 0) {
			throw new ProductionException("producedQuantity must be greater than zero");
		}

		ProductionOrder order = findOrThrow(id);
		modelMapper.map(dto, order);
		order.setProductionOrderId(id);
		order = repository.save(order);
		return build(HttpStatus.OK, "Production Order Updated Successfully", toDTO(order));
	}


	public ResponseEntity<ResponseStructure<ProductionOrderDTO>> startProduction(Long id) {
		ProductionOrder order = findOrThrow(id);

		if (order.getStatus() != ProductionStatus.PLANNED) {
			throw new ProductionException("Only PLANNED orders can be started. Current status: " + order.getStatus());
		}

		inventoryClient.stockOut(order.getRawMaterialInventoryId(), order.getRawMaterialQuantity());

		order.setStatus(ProductionStatus.IN_PROGRESS);
		order = repository.save(order);

		return build(HttpStatus.OK, "Production Started - Raw Material Reserved", toDTO(order));
	}


	public ResponseEntity<ResponseStructure<ProductionOrderDTO>> completeProduction(Long id, Double producedQuantity) {
		ProductionOrder order = findOrThrow(id);

		if (order.getStatus() != ProductionStatus.IN_PROGRESS) {
			throw new ProductionException("Only IN_PROGRESS orders can be completed. Current status: " + order.getStatus());
		}

		if (producedQuantity == null || producedQuantity <= 0) {
			throw new ProductionException("producedQuantity must be greater than zero");
		}

		Long inventoryId = resolveFinishedGoodsInventoryId(order);
		inventoryClient.stockIn(inventoryId, producedQuantity);
		log.info("Finished goods stocked in: productionOrderId={}, inventoryId={}, qty={}", id, inventoryId,
				producedQuantity);

		order.setProducedQuantity(producedQuantity);
		order.setFinishedGoodsInventoryId(inventoryId);
		order.setStatus(ProductionStatus.COMPLETED);
		order = repository.save(order);

		String message = "Production Completed - finished goods added to Inventory";
		Long linkedBuyerOrderId = resolveBuyerOrderId(order);
		if (linkedBuyerOrderId != null) {
			buyerOrderClient.updateStatus(linkedBuyerOrderId, BUYER_ORDER_STATUS_READY_FOR_DISPATCH);
			message += " and Buyer Order " + linkedBuyerOrderId + " marked READY_FOR_DISPATCH";
			log.info("Buyer Order updated: orderId={}, status=READY_FOR_DISPATCH (via productionOrderId={})",
					linkedBuyerOrderId, id);
		} else {
			message += ". No matching IN_PRODUCTION buyer order was found to update automatically";
			log.warn("No matching IN_PRODUCTION buyer order found for productionOrderId={}, vendorId={}, product={}",
					id, order.getVendorId(), order.getProductName());
		}

		return build(HttpStatus.OK, message, toDTO(order));
	}

	public ResponseEntity<ResponseStructure<ProductionOrderDTO>> cancelProduction(Long id) {
		ProductionOrder order = findOrThrow(id);

		if (order.getStatus() == ProductionStatus.COMPLETED) {
			throw new ProductionException("A COMPLETED order cannot be cancelled.");
		}

		order.setStatus(ProductionStatus.CANCELLED);
		order = repository.save(order);
		return build(HttpStatus.OK, "Production Order Cancelled", toDTO(order));
	}

	public ResponseEntity<ResponseStructure<String>> deleteOrder(Long id) {
		findOrThrow(id);
		repository.deleteById(id);
		return build(HttpStatus.OK, "Production Order Deleted Successfully", "Deleted id: " + id);
	}

	// =========================================================
	// Internal helpers
	// =========================================================

	private void validateRawMaterialQuantity(Double quantity) {
		if (quantity == null || quantity < 0) {
			throw new ProductionException("rawMaterialQuantity cannot be negative");
		}
	}


	private Long resolveFinishedGoodsInventoryId(ProductionOrder order) {
		if (order.getFinishedGoodsInventoryId() != null) {
			return order.getFinishedGoodsInventoryId();
		}

		ResponseStructure<List<InventoryDTO>> response = inventoryClient.getByMaterialName(order.getProductName());
		List<InventoryDTO> matches = response == null ? null : response.getData();

		Optional<InventoryDTO> match = (matches == null ? List.<InventoryDTO>of() : matches).stream()
				.filter(inv -> order.getVendorId() != null && order.getVendorId().equals(inv.getVendorId()))
				.filter(inv -> order.getProductName() != null && order.getProductName().equalsIgnoreCase(inv.getMaterialName()))
				.findFirst();

		return match.map(InventoryDTO::getInventoryId).orElseThrow(() -> new ProductionException(
				"No finished-goods Inventory record found for vendorId=" + order.getVendorId() + ", product="
						+ order.getProductName() + ". Add an Inventory record for this product first, or supply"
						+ " finishedGoodsInventoryId on the production order."));
	}


	private Long resolveBuyerOrderId(ProductionOrder order) {
		if (order.getBuyerOrderId() != null) {
			return order.getBuyerOrderId();
		}

		try {
			ResponseStructure<List<BuyerOrderDTO>> response = buyerOrderClient.getOrdersByVendor(order.getVendorId());
			List<BuyerOrderDTO> orders = response == null ? null : response.getData();
			if (orders == null) {
				return null;
			}

			return orders.stream()
					.filter(o -> BUYER_ORDER_STATUS_IN_PRODUCTION.equalsIgnoreCase(o.getStatus()))
					.filter(o -> order.getProductName() != null && order.getProductName().equalsIgnoreCase(o.getProductName()))
					.sorted(Comparator.comparing(BuyerOrderDTO::getOrderDate,
							Comparator.nullsLast(Comparator.naturalOrder()))
							.thenComparing(BuyerOrderDTO::getOrderId, Comparator.nullsLast(Comparator.naturalOrder())))
					.map(BuyerOrderDTO::getOrderId)
					.findFirst()
					.orElse(null);
		} catch (BuyerOrderServiceException ex) {
			
			log.warn("Could not look up matching Buyer Order for productionOrderId={}: {}",
					order.getProductionOrderId(), ex.getMessage());
			return null;
		}
	}

	private ProductionOrder findOrThrow(Long id) {
		return repository.findById(id)
				.orElseThrow(() -> new ProductionException("Production Order Not Found with id: " + id));
	}

	private ProductionOrderDTO toDTO(ProductionOrder order) {
		return modelMapper.map(order, ProductionOrderDTO.class);
	}

	private <T> ResponseEntity<ResponseStructure<T>> build(HttpStatus status, String message, T data) {
		ResponseStructure<T> response = new ResponseStructure<>();
		response.setStatusCode(status.value());
		response.setMessage(message);
		response.setData(data);
		return new ResponseEntity<>(response, status);
	}
}
