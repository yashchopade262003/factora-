package org.inventry.service.controller;

import java.util.List;

import org.inventry.service.ResponceEntity.ResponseStructure;
import org.inventry.service.dto.InventoryDTO;
import org.inventry.service.dto.InventoryDashboardDTO;
import org.inventry.service.entity.InventoryStatus;
import org.inventry.service.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    // =======================
    // CRUD APIs
    // =======================

    @PostMapping("/add")
    public ResponseEntity<ResponseStructure<InventoryDTO>> saveInventory(
            @RequestBody InventoryDTO dto) {

        return inventoryService.saveInventory(dto);
    }

    @GetMapping("/all")
    public ResponseEntity<ResponseStructure<List<InventoryDTO>>> getAllInventories() {

        return inventoryService.getAllInventories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseStructure<InventoryDTO>> getInventoryById(
            @PathVariable Long id) {

        return inventoryService.getInventoryById(id);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ResponseStructure<InventoryDTO>> updateInventory(
            @PathVariable Long id,
            @RequestBody InventoryDTO dto) {

        return inventoryService.updateInventory(id, dto);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseStructure<String>> deleteInventory(
            @PathVariable Long id) {

        return inventoryService.deleteInventory(id);
    }

    @DeleteMapping("/delete-all")
    public ResponseEntity<ResponseStructure<String>> deleteAllInventory() {

        return inventoryService.deleteAllInventory();
    }

    // =======================
    // Search APIs
    // =======================

    @GetMapping("/material/{materialCode}")
    public ResponseEntity<ResponseStructure<InventoryDTO>> findByMaterialCode(
            @PathVariable String materialCode) {

        return inventoryService.findByMaterialCode(materialCode);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ResponseStructure<List<InventoryDTO>>> findByStatus(
            @PathVariable InventoryStatus status) {

        return inventoryService.findByStatus(status);
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<ResponseStructure<List<InventoryDTO>>> findByVendor(
            @PathVariable Long vendorId) {

        return inventoryService.findByVendor(vendorId);
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<ResponseStructure<List<InventoryDTO>>> findBySupplier(
            @PathVariable Long supplierId) {

        return inventoryService.findBySupplier(supplierId);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ResponseStructure<List<InventoryDTO>>> findByCategory(
            @PathVariable String category) {

        return inventoryService.findByCategory(category);
    }

    @GetMapping("/warehouse/{location}")
    public ResponseEntity<ResponseStructure<List<InventoryDTO>>> findByWarehouse(
            @PathVariable String location) {

        return inventoryService.findByWarehouse(location);
    }

    @GetMapping("/warehouse/id/{warehouseId}")
    public ResponseEntity<ResponseStructure<List<InventoryDTO>>> findByWarehouseId(
            @PathVariable Long warehouseId) {

        return inventoryService.findByWarehouseId(warehouseId);
    }

    // =======================
    // Stock APIs
    // =======================

    @PutMapping("/stock-in/{id}")
    public ResponseEntity<ResponseStructure<InventoryDTO>> stockIn(
            @PathVariable Long id,
            @RequestParam Double quantity) {

        return inventoryService.stockIn(id, quantity);
    }

    @PutMapping("/stock-out/{id}")
    public ResponseEntity<ResponseStructure<InventoryDTO>> stockOut(
            @PathVariable Long id,
            @RequestParam Double quantity) {

        return inventoryService.stockOut(id, quantity);
    }

    @PutMapping("/adjust-stock/{id}")
    public ResponseEntity<ResponseStructure<InventoryDTO>> adjustStock(
            @PathVariable Long id,
            @RequestParam Double quantity) {

        return inventoryService.adjustStock(id, quantity);
    }

    // =======================
    // Reports APIs
    // =======================

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
    public ResponseEntity<ResponseStructure<List<InventoryDTO>>> getAvailableByCategory(
            @PathVariable String category) {

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

}