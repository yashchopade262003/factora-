package com.factoryflow.auth.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.factoryflow.auth.InterfaceService.IVendorService;
import com.factoryflow.auth.dto.VendorDTO;

@RestController
@RequestMapping("/vendor")
public class VendorController {

	@Autowired
	private IVendorService vendorService;

	@PostMapping("/add")
	public ResponseEntity<VendorDTO> addVendor(@RequestBody VendorDTO dto) {

		return ResponseEntity.ok(vendorService.addVendor(dto));
	}

	@GetMapping("/{id}")
	public ResponseEntity<VendorDTO> getVendor(@PathVariable Long id) {

		return ResponseEntity.ok(vendorService.getVendorById(id));
	}

	@GetMapping("/getAll")
	public ResponseEntity<List<VendorDTO>> getAllVendors() {

		return ResponseEntity.ok(vendorService.getAllVendors());
	}

}