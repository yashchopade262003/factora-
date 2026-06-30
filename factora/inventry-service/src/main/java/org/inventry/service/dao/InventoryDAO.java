package org.inventry.service.dao;

import java.util.List;
import java.util.Optional;

import org.inventry.service.entity.Inventory;
import org.inventry.service.entity.InventoryStatus;
import org.inventry.service.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class InventoryDAO {
	@Autowired
	InventoryRepository inventoryRepository;

	
	public boolean existsByMaterialCode(String code) {
		
		Optional<Inventory> byMaterialCode = inventoryRepository.findByMaterialCode(code);
		if(byMaterialCode.isPresent()) {
			return true;
		}
		return false;
	}
	public Inventory saveInventory(Inventory inventory) {
		return inventoryRepository.save(inventory);
	}

	public Optional<Inventory> findByIdMaterialCode(String materialCode) {
		return inventoryRepository.findByMaterialCode(materialCode);

	}
	
	public List<Inventory> getAllInventries() {
		return  inventoryRepository.findAll();
	}
	
	public boolean deleteById(Long id) {
		
		Optional<Inventory> byId = inventoryRepository.findById(id);
		if(byId.isPresent()) {
			
			inventoryRepository.deleteById(id);
			return true;
		}
		return false;
		
	}
	
	public long getStockOfInventry() {
		return inventoryRepository.count();
	}
	
	public List<Inventory> findByWareHouseLocation(String location) {
		return inventoryRepository.findByWarehouseLocation(location);
	}
	
	
	public Optional<Inventory> getInventoryById(Long id) {
		return  inventoryRepository.findById(id);
	}
	
	public void deleteAllInventory() {
		inventoryRepository.deleteAll();
	}
	
	
	public List<Inventory> findByStatus(InventoryStatus status){
	    return inventoryRepository.findByStatus(status);
	}

	public List<Inventory> findByVendorId(Long vendorId){
	    return inventoryRepository.findByVendorId(vendorId);
	}

	public List<Inventory> findByCategory(String category){
	    return inventoryRepository.findByMaterialCategory(category);
	}

	public List<Inventory> findLowStock(Double minimumStock){
	    return inventoryRepository.findByQuantityLessThanEqual(minimumStock);
	}

	public List<Inventory> findBySupplier(Long supplierId){
	    return inventoryRepository.findBySupplierId(supplierId);
	}

	public List<Inventory> findByWarehouseId(Long warehouseId){
	    return inventoryRepository.findByWarehouseId(warehouseId);
	}
	
	
	
}
