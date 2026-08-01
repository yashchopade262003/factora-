package org.production.service.controller;

import java.util.List;

import org.production.service.ResponceEntity.ResponseStructure;
import org.production.service.dto.ProductionOrderDTO;
import org.production.service.entity.ProductionStatus;
import org.production.service.service.ProductionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;

@RestController
@RequestMapping("/production")
@Validated
public class ProductionController {

	@Autowired
	private ProductionService productionService;

	@PostMapping("/add")
	public ResponseEntity<ResponseStructure<ProductionOrderDTO>> createOrder(@Valid @RequestBody ProductionOrderDTO dto) {
		return productionService.createOrder(dto);
	}

	@GetMapping("/all")
	public ResponseEntity<ResponseStructure<List<ProductionOrderDTO>>> getAllOrders() {
		return productionService.getAllOrders();
	}

	@GetMapping("/{id}")
	public ResponseEntity<ResponseStructure<ProductionOrderDTO>> getOrderById(@PathVariable Long id) {
		return productionService.getOrderById(id);
	}

	@GetMapping("/vendor/{vendorId}")
	public ResponseEntity<ResponseStructure<List<ProductionOrderDTO>>> getOrdersByVendor(@PathVariable Long vendorId) {
		return productionService.getOrdersByVendor(vendorId);
	}

	@GetMapping("/status/{status}")
	public ResponseEntity<ResponseStructure<List<ProductionOrderDTO>>> getOrdersByStatus(@PathVariable ProductionStatus status) {
		return productionService.getOrdersByStatus(status);
	}

	@PutMapping("/update/{id}")
	public ResponseEntity<ResponseStructure<ProductionOrderDTO>> updateOrder(@PathVariable Long id,
			@RequestBody ProductionOrderDTO dto) {
		return productionService.updateOrder(id, dto);
	}

	@PutMapping("/start/{id}")
	public ResponseEntity<ResponseStructure<ProductionOrderDTO>> startProduction(@PathVariable Long id) {
		return productionService.startProduction(id);
	}

	@PutMapping("/complete/{id}")
	public ResponseEntity<ResponseStructure<ProductionOrderDTO>> completeProduction(@PathVariable Long id,
			@RequestParam @Positive Double producedQuantity) {
		return productionService.completeProduction(id, producedQuantity);
	}

	@PutMapping("/cancel/{id}")
	public ResponseEntity<ResponseStructure<ProductionOrderDTO>> cancelProduction(@PathVariable Long id) {
		return productionService.cancelProduction(id);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<ResponseStructure<String>> deleteOrder(@PathVariable Long id) {
		return productionService.deleteOrder(id);
	}
}
