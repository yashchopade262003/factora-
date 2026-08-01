package org.inventry.service.controller;

import java.time.LocalDate;
import java.util.List;

import org.inventry.service.ResponceEntity.ResponseStructure;
import org.inventry.service.dto.InventoryDTO;
import org.inventry.service.dto.InventoryDashboardDTO;
import org.inventry.service.entity.InventoryStatus;
import org.inventry.service.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;

@RestController
@RequestMapping("/inventory")
@Validated
public class InventoryController {

	@Autowired
	private InventoryService inventoryService;

	// ==========================================
	// CRUD APIs
	// ==========================================

	@PostMapping("/add")
	public ResponseEntity<ResponseStructure<InventoryDTO>> saveInventory(@Valid @RequestBody InventoryDTO dto) {

		return inventoryService.saveInventory(dto);
	}

	@GetMapping("/all")
	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> getAllInventories() {

		return inventoryService.getAllInventories();
	}

	@GetMapping("/{id}")
	public ResponseEntity<ResponseStructure<InventoryDTO>> getInventoryById(@PathVariable Long id) {

		return inventoryService.getInventoryById(id);
	}

	// Intentionally not @Valid: this is a partial update (ModelMapper is
	// configured to skip null source fields), so callers may send only the
	// fields they want to change without re-supplying every required field.
	@PutMapping("/update/{id}")
	public ResponseEntity<ResponseStructure<InventoryDTO>> updateInventory(@PathVariable Long id,
			@RequestBody InventoryDTO dto) {

		return inventoryService.updateInventory(id, dto);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<ResponseStructure<String>> deleteInventory(@PathVariable Long id) {

		return inventoryService.deleteInventory(id);
	}

	@DeleteMapping("/delete-all")
	public ResponseEntity<ResponseStructure<String>> deleteAllInventory() {

		return inventoryService.deleteAllInventory();
	}

	// ==========================================
	// Search APIs
	// ==========================================

	@GetMapping("/material/{materialCode}")
	public ResponseEntity<ResponseStructure<InventoryDTO>> findByMaterialCode(@PathVariable String materialCode) {

		return inventoryService.findByMaterialCode(materialCode);
	}

	@GetMapping("/material-name/{materialName}")
	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> findByMaterialName(@PathVariable String materialName) {

		return inventoryService.findByMaterialName(materialName);
	}

	@GetMapping("/batch/{batchNumber}")
	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> findByBatchNumber(@PathVariable String batchNumber) {

		return inventoryService.findByBatchNumber(batchNumber);
	}

	@GetMapping("/status/{status}")
	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> findByStatus(@PathVariable InventoryStatus status) {

		return inventoryService.findByStatus(status);
	}

	@GetMapping("/vendor/{vendorId}")
	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> findByVendor(@PathVariable Long vendorId) {
		System.out.println("executing this service from 8082");
		return inventoryService.findByVendor(vendorId);
	}

	@GetMapping("/supplier/{supplierId}")
	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> findBySupplier(@PathVariable Long supplierId) {

		return inventoryService.findBySupplier(supplierId);
	}

	@GetMapping("/category/{category}")
	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> findByCategory(@PathVariable String category) {

		return inventoryService.findByCategory(category);
	}

	@GetMapping("/warehouse/{location}")
	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> findByWarehouse(@PathVariable String location) {

		return inventoryService.findByWarehouse(location);
	}

	@GetMapping("/warehouse/id/{warehouseId}")
	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> findByWarehouseId(@PathVariable Long warehouseId) {

		return inventoryService.findByWarehouseId(warehouseId);
	}

	@GetMapping("/received/{date}")
	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> findByReceivedDate(@PathVariable LocalDate date) {

		return inventoryService.findByReceivedDate(date);
	}

	@GetMapping("/manufactured/{date}")
	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> findByManufacturingDate(@PathVariable LocalDate date) {

		return inventoryService.findByManufacturingDate(date);
	}

	@GetMapping("/expired")
	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> getExpiredMaterials() {

		return inventoryService.getExpiredMaterials();
	}

	@GetMapping("/expiring/{days}")
	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> getExpiringMaterials(@PathVariable int days) {

		return inventoryService.getExpiringMaterials(days);
	}

	// ==========================================
	// Stock APIs
	// ==========================================

	@PutMapping("/stock-in/{id}")
	public ResponseEntity<ResponseStructure<InventoryDTO>> stockIn(@PathVariable Long id,
			@RequestParam @Positive(message = "quantity must be greater than zero") Double quantity) {

		return inventoryService.stockIn(id, quantity);
	}

	@PutMapping("/stock-out/{id}")
	public ResponseEntity<ResponseStructure<InventoryDTO>> stockOut(@PathVariable Long id,
			@RequestParam @Positive(message = "quantity must be greater than zero") Double quantity) {

		return inventoryService.stockOut(id, quantity);
	}

	@PutMapping("/adjust-stock/{id}")
	public ResponseEntity<ResponseStructure<InventoryDTO>> adjustStock(@PathVariable Long id,
			@RequestParam @jakarta.validation.constraints.PositiveOrZero(message = "quantity cannot be negative") Double quantity) {

		return inventoryService.adjustStock(id, quantity);
	}

	// ==========================================
	// Reports
	// ==========================================

	@GetMapping("/available")
	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> getAvailableInventory() {

		return inventoryService.getAvailableInventory();
	}

	@GetMapping("/low-stock")
	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> getLowStockInventory() {

		return inventoryService.getLowStockInventory();
	}

	@GetMapping("/out-of-stock")
	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> getOutOfStockInventory() {

		return inventoryService.getOutOfStockInventory();
	}

	@GetMapping("/available/category/{category}")
	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> getAvailableByCategory(@PathVariable String category) {

		return inventoryService.getAvailableByCategory(category);
	}

	@GetMapping("/count")
	public ResponseEntity<ResponseStructure<Long>> getInventoryCount() {

		return inventoryService.getInventoryCount();
	}

	@GetMapping("/value")
	public ResponseEntity<ResponseStructure<Double>> getInventoryValue() {

		return inventoryService.getInventoryValue();
	}

	@GetMapping("/dashboard")
	public ResponseEntity<ResponseStructure<InventoryDashboardDTO>> getDashboard() {

		return inventoryService.getDashboard();
	}

	// ==========================================
	// Pagination
	// ==========================================

	@GetMapping("/page")
	public ResponseEntity<ResponseStructure<Page<InventoryDTO>>> getInventoryByPage(

			@RequestParam(defaultValue = "0") int page,

			@RequestParam(defaultValue = "10") int size) {

		return inventoryService.getInventoryByPage(page, size);
	}

}