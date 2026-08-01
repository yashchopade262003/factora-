package org.buyer.service.controller;

import java.util.List;

import org.buyer.service.ResponceEntity.ResponseStructure;
import org.buyer.service.dto.BuyerOrderDTO;
import org.buyer.service.entity.OrderStatus;
import org.buyer.service.service.BuyerOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/buyer-order")
@Validated
public class BuyerOrderController {

	@Autowired
	private BuyerOrderService buyerOrderService;

	@PostMapping("/add")
	public ResponseEntity<ResponseStructure<BuyerOrderDTO>> createOrder(@Valid @RequestBody BuyerOrderDTO dto) {
		return buyerOrderService.createOrder(dto);
	}

	@GetMapping("/all")
	public ResponseEntity<ResponseStructure<List<BuyerOrderDTO>>> getAllOrders() {
		return buyerOrderService.getAllOrders();
	}

	@GetMapping("/{id}")
	public ResponseEntity<ResponseStructure<BuyerOrderDTO>> getOrderById(@PathVariable Long id) {
		return buyerOrderService.getOrderById(id);
	}

	@GetMapping("/vendor/{vendorId}")
	public ResponseEntity<ResponseStructure<List<BuyerOrderDTO>>> getOrdersByVendor(@PathVariable Long vendorId) {
		return buyerOrderService.getOrdersByVendor(vendorId);
	}

	@GetMapping("/buyer/{buyerId}")
	public ResponseEntity<ResponseStructure<List<BuyerOrderDTO>>> getOrdersByBuyer(@PathVariable Long buyerId) {
		return buyerOrderService.getOrdersByBuyer(buyerId);
	}

	@GetMapping("/status/{status}")
	public ResponseEntity<ResponseStructure<List<BuyerOrderDTO>>> getOrdersByStatus(@PathVariable OrderStatus status) {
		return buyerOrderService.getOrdersByStatus(status);
	}

	@PutMapping("/update/{id}")
	public ResponseEntity<ResponseStructure<BuyerOrderDTO>> updateOrder(@PathVariable Long id,
			@RequestBody BuyerOrderDTO dto) {
		return buyerOrderService.updateOrder(id, dto);
	}

	@PutMapping("/status/{id}")
	public ResponseEntity<ResponseStructure<BuyerOrderDTO>> updateStatus(@PathVariable Long id,
			@RequestParam OrderStatus status) {
		return buyerOrderService.updateStatus(id, status);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<ResponseStructure<String>> deleteOrder(@PathVariable Long id) {
		return buyerOrderService.deleteOrder(id);
	}
}
