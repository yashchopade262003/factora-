package org.inventry.service.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.inventry.service.entity.Inventory;
import org.inventry.service.entity.InventoryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository; 


@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
	
	 Optional<Inventory> findByMaterialCode(String materialCode);

	 List<Inventory> findByWarehouseLocation(String location);

	 List<Inventory> findByStatus(InventoryStatus status);

	 List<Inventory> findByVendorId(Long vendorId);

	 List<Inventory> findByMaterialCategory(String materialCategory);

	 List<Inventory> findByQuantityLessThanEqual(Double quantity);

	 List<Inventory> findBySupplierId(Long supplierId);

	 List<Inventory> findByWarehouseId(Long warehouseId);
	 
	
	 boolean existsByMaterialCode(String materialCode);

	 boolean existsByBatchNumber(String batchNumber);

	 List<Inventory> findByMaterialNameContainingIgnoreCase(String materialName);

	 List<Inventory> findByBatchNumber(String batchNumber);

	 List<Inventory> findByExpiryDateBefore(LocalDate date);

	 List<Inventory> findByExpiryDateBetween(LocalDate start, LocalDate end);

	 List<Inventory> findByReceivedDate(LocalDate receivedDate);

	 List<Inventory> findByManufacturingDate(LocalDate manufacturingDate);
	 
}
