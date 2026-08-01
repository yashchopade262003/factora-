package org.inventry.service.dao;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.inventry.service.entity.Inventory;
import org.inventry.service.entity.InventoryStatus;
import org.inventry.service.exception.InventoryNotStoredException;
import org.inventry.service.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public class InventoryDAO {

	@Autowired
	private InventoryRepository inventoryRepository;

	/**
	 * Wraps the raw JPA save so persistence-layer failures (constraint violations,
	 * connection issues, optimistic-lock conflicts, etc.) surface as a single
	 * well-known exception the service layer and GlobalExceptionHandler know how to
	 * translate into an HTTP response, instead of leaking a raw
	 * DataAccessException/Hibernate exception.
	 */
	public Inventory saveInventory(Inventory inventory) {
		try {
			return inventoryRepository.save(inventory);
		} catch (DataAccessException ex) {
			throw new InventoryNotStoredException(
					"Failed to persist inventory record: " + ex.getMostSpecificCause().getMessage());
		}
	}

	public boolean existsByMaterialCode(String code) {
		return inventoryRepository.findByMaterialCode(code).isPresent();
	}

	public boolean existsByBatchNumber(String batchNumber) {
		return inventoryRepository.existsByBatchNumber(batchNumber);
	}

	// =========================
	// Find By ID
	// =========================

	public Optional<Inventory> getInventoryById(Long id) {
		return inventoryRepository.findById(id);
	}

// fpr material
	public Optional<Inventory> findByIdMaterialCode(String materialCode) {
		return inventoryRepository.findByMaterialCode(materialCode);
	}

	public List<Inventory> findByMaterialName(String materialName) {
		return inventoryRepository.findByMaterialNameContainingIgnoreCase(materialName);
	}

	// gettonog all inventries

	public List<Inventory> getAllInventries() {
		return inventoryRepository.findAll();
	}

	public Page<Inventory> getAll(Pageable pageable) {
		return inventoryRepository.findAll(pageable);
	}

	// delete methods

	public boolean deleteById(Long id) {

		Optional<Inventory> inventory = inventoryRepository.findById(id);

		if (inventory.isPresent()) {

			inventoryRepository.deleteById(id);

			return true;
		}

		return false;
	}

	public void deleteAllInventory() {
		inventoryRepository.deleteAll();
	}

	// for dahjbord voew
	public long getStockOfInventry() {
		return inventoryRepository.count();
	}

	// for warehouse

	public List<Inventory> findByWareHouseLocation(String location) {
		return inventoryRepository.findByWarehouseLocation(location);
	}

	public List<Inventory> findByWarehouseId(Long warehouseId) {
		return inventoryRepository.findByWarehouseId(warehouseId);
	}

// for status 
	public List<Inventory> findByStatus(InventoryStatus status) {
		return inventoryRepository.findByStatus(status);
	}

	// =========================
	// Vendor
	// =========================

	public List<Inventory> findByVendorId(Long vendorId) {
		return inventoryRepository.findByVendorId(vendorId);
	}

	// =========================
	// Category
	// =========================

	public List<Inventory> findByCategory(String category) {
		return inventoryRepository.findByMaterialCategory(category);
	}

	// =========================
	// Low Stock
	// =========================

	public List<Inventory> findLowStock(Double minimumStock) {
		return inventoryRepository.findByQuantityLessThanEqual(minimumStock);
	}

	// =========================
	// Supplier
	// =========================

	public List<Inventory> findBySupplier(Long supplierId) {
		return inventoryRepository.findBySupplierId(supplierId);
	}

	// =========================
	// Batch
	// =========================

	public List<Inventory> findByBatchNumber(String batchNumber) {
		return inventoryRepository.findByBatchNumber(batchNumber);
	}

	// =========================
	// Expiry
	// =========================

	public List<Inventory> findExpiredMaterials(LocalDate today) {
		return inventoryRepository.findByExpiryDateBefore(today);
	}

	public List<Inventory> findExpiringMaterials(LocalDate start, LocalDate end) {
		return inventoryRepository.findByExpiryDateBetween(start, end);
	}

	// =========================
	// Date Search
	// =========================

	public List<Inventory> findByReceivedDate(LocalDate date) {
		return inventoryRepository.findByReceivedDate(date);
	}

	public List<Inventory> findByManufacturingDate(LocalDate date) {
		return inventoryRepository.findByManufacturingDate(date);
	}

}