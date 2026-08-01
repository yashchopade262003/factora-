package org.buyer.service.controller;

import java.util.List;

import org.buyer.service.ResponceEntity.ResponseStructure;
import org.buyer.service.dto.BuyerDTO;
import org.buyer.service.service.BuyerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/buyer")
@Validated
public class BuyerController {

	@Autowired
	private BuyerService buyerService;

	@PostMapping("/add")
	public ResponseEntity<ResponseStructure<BuyerDTO>> createBuyer(@Valid @RequestBody BuyerDTO dto) {
		return buyerService.createBuyer(dto);
	}

	@GetMapping("/all")
	public ResponseEntity<ResponseStructure<List<BuyerDTO>>> getAllBuyers() {
		return buyerService.getAllBuyers();
	}

	@GetMapping("/{id}")
	public ResponseEntity<ResponseStructure<BuyerDTO>> getBuyerById(@PathVariable Long id) {
		return buyerService.getBuyerById(id);
	}

	@GetMapping("/vendor/{vendorId}")
	public ResponseEntity<ResponseStructure<List<BuyerDTO>>> getBuyersByVendor(@PathVariable Long vendorId) {
		return buyerService.getBuyersByVendor(vendorId);
	}

	@PutMapping("/update/{id}")
	public ResponseEntity<ResponseStructure<BuyerDTO>> updateBuyer(@PathVariable Long id, @RequestBody BuyerDTO dto) {
		return buyerService.updateBuyer(id, dto);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<ResponseStructure<String>> deleteBuyer(@PathVariable Long id) {
		return buyerService.deleteBuyer(id);
	}
}
