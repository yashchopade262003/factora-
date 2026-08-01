package org.dispatch.service.controller;

import java.util.List;

import org.dispatch.service.ResponceEntity.ResponseStructure;
import org.dispatch.service.dto.DispatchDTO;
import org.dispatch.service.entity.DeliveryStatus;
import org.dispatch.service.service.DispatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/dispatch")
@Validated
public class DispatchController {

	@Autowired
	private DispatchService dispatchService;

	@PostMapping("/add")
	public ResponseEntity<ResponseStructure<DispatchDTO>> createDispatch(@Valid @RequestBody DispatchDTO dto) {
		return dispatchService.createDispatch(dto);
	}

	@GetMapping("/all")
	public ResponseEntity<ResponseStructure<List<DispatchDTO>>> getAllDispatches() {
		return dispatchService.getAllDispatches();
	}

	@GetMapping("/{id}")
	public ResponseEntity<ResponseStructure<DispatchDTO>> getDispatchById(@PathVariable Long id) {
		return dispatchService.getDispatchById(id);
	}

	@GetMapping("/vendor/{vendorId}")
	public ResponseEntity<ResponseStructure<List<DispatchDTO>>> getDispatchesByVendor(@PathVariable Long vendorId) {
		return dispatchService.getDispatchesByVendor(vendorId);
	}

	@GetMapping("/buyer/{buyerId}")
	public ResponseEntity<ResponseStructure<List<DispatchDTO>>> getDispatchesByBuyer(@PathVariable Long buyerId) {
		return dispatchService.getDispatchesByBuyer(buyerId);
	}

	@GetMapping("/status/{status}")
	public ResponseEntity<ResponseStructure<List<DispatchDTO>>> getDispatchesByStatus(@PathVariable DeliveryStatus status) {
		return dispatchService.getDispatchesByStatus(status);
	}

	@PutMapping("/update/{id}")
	public ResponseEntity<ResponseStructure<DispatchDTO>> updateDispatch(@PathVariable Long id,
			@RequestBody DispatchDTO dto) {
		return dispatchService.updateDispatch(id, dto);
	}

	@PutMapping("/in-transit/{id}")
	public ResponseEntity<ResponseStructure<DispatchDTO>> markInTransit(@PathVariable Long id) {
		return dispatchService.markInTransit(id);
	}

	@PutMapping("/delivered/{id}")
	public ResponseEntity<ResponseStructure<DispatchDTO>> markDelivered(@PathVariable Long id) {
		return dispatchService.markDelivered(id);
	}

	@PutMapping("/cancel/{id}")
	public ResponseEntity<ResponseStructure<DispatchDTO>> cancelDispatch(@PathVariable Long id) {
		return dispatchService.cancelDispatch(id);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<ResponseStructure<String>> deleteDispatch(@PathVariable Long id) {
		return dispatchService.deleteDispatch(id);
	}
}
