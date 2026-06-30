package org.inventry.service.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.inventry.service.ResponceEntity.ResponseStructure;
import org.inventry.service.client.VendorClient;
import org.inventry.service.dao.InventoryDAO;
import org.inventry.service.dto.InventoryDTO;
import org.inventry.service.dto.InventoryDashboardDTO;
import org.inventry.service.entity.Inventory;
import org.inventry.service.entity.InventoryStatus;
import org.inventry.service.exception.InventoryException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class InventoryService {

	@Autowired
	private VendorClient vendorClient;

	@Autowired
	private InventoryDAO inventoryDAO;

	@Autowired
	private ModelMapper mapper;

	public ResponseEntity<ResponseStructure<InventoryDTO>> saveInventory(InventoryDTO dto) {

		vendorClient.getVendor(dto.getVendorId());

		if (inventoryDAO.existsByMaterialCode(dto.getMaterialCode())) {
			throw new InventoryException("Material Code Already Exists");
		}

		Inventory inventory = mapper.map(dto, Inventory.class);

		updateInventoryStatus(inventory);

		Inventory savedInventory = inventoryDAO.saveInventory(inventory);

		InventoryDTO responseDTO = mapper.map(savedInventory, InventoryDTO.class);

		ResponseStructure<InventoryDTO> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.CREATED.value());
		response.setMessage("Inventory Added Successfully");
		response.setData(responseDTO);

		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> getAllInventories() {

		List<Inventory> inventories = inventoryDAO.getAllInventries();

		List<InventoryDTO> dtoList = inventories.stream().map(inventory -> mapper.map(inventory, InventoryDTO.class))
				.toList();

		ResponseStructure<List<InventoryDTO>> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage("All Inventories");
		response.setData(dtoList);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<InventoryDTO>> getInventoryById(Long id) {

		Optional<Inventory> optional = inventoryDAO.getInventoryById(id);

		if (optional.isEmpty()) {
			throw new InventoryException("Inventory Not Found");
		}

		InventoryDTO dto = mapper.map(optional.get(), InventoryDTO.class);

		ResponseStructure<InventoryDTO> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage("Inventory Found");
		response.setData(dto);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<InventoryDTO>> updateInventory(Long id, InventoryDTO dto) {

		Inventory inventory = inventoryDAO.getInventoryById(id)
				.orElseThrow(() -> new InventoryException("Inventory Not Found"));

		mapper.map(dto, inventory);

		updateInventoryStatus(inventory);

		Inventory updatedInventory = inventoryDAO.saveInventory(inventory);

		InventoryDTO responseDTO = mapper.map(updatedInventory, InventoryDTO.class);

		ResponseStructure<InventoryDTO> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage("Inventory Updated Successfully");
		response.setData(responseDTO);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> findByStatus(InventoryStatus status) {

		List<Inventory> inventories = inventoryDAO.findByStatus(status);

		if (inventories.isEmpty()) {
			throw new InventoryException("No Inventory Found With Status : " + status);
		}

		List<InventoryDTO> dtoList = inventories.stream().map(inventory -> mapper.map(inventory, InventoryDTO.class))
				.toList();

		ResponseStructure<List<InventoryDTO>> response = new ResponseStructure<>();

		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage("Inventory Found Successfully");
		response.setData(dtoList);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	private void updateInventoryStatus(Inventory inventory) {

		if (inventory.getQuantity() == null || inventory.getUnitPrice() == null) {
			throw new InventoryException("Quantity and Unit Price are required");
		}

		inventory.setTotalValue(inventory.getQuantity() * inventory.getUnitPrice());

		if (inventory.getQuantity() <= 0) {

			inventory.setStatus(InventoryStatus.OUT_OF_STOCK);

		} else if (inventory.getQuantity() <= inventory.getMinimumStockLevel()) {

			inventory.setStatus(InventoryStatus.LOW_STOCK);

		} else {

			inventory.setStatus(InventoryStatus.AVAILABLE);

		}
	}

	public ResponseEntity<ResponseStructure<String>> deleteInventory(Long id) {

		boolean deleted = inventoryDAO.deleteById(id);

		if (!deleted) {
			throw new InventoryException("Inventory Not Found");
		}

		ResponseStructure<String> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage("Inventory Deleted Successfully");
		response.setData("Deleted");

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> findByVendor(Long vendorId) {

	    vendorClient.getVendor(vendorId);

	    List<Inventory> inventories = inventoryDAO.findByVendorId(vendorId);

	    if (inventories.isEmpty()) {
	        throw new InventoryException("Vendor Inventory Not Found");
	    }

	    List<InventoryDTO> dtoList = inventories.stream()
	            .map(i -> mapper.map(i, InventoryDTO.class))
	            .toList();

	    ResponseStructure<List<InventoryDTO>> response = new ResponseStructure<>();
	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("Vendor Inventory Found");
	    response.setData(dtoList);

	    return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> findByCategory(String category) {

		List<Inventory> inventories = inventoryDAO.findByCategory(category);

		if (inventories.isEmpty()) {
			throw new InventoryException("Category Not Found");
		}

		List<InventoryDTO> dtoList = inventories.stream().map(i -> mapper.map(i, InventoryDTO.class)).toList();

		ResponseStructure<List<InventoryDTO>> response = new ResponseStructure<>();

		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage("Category Inventory Found");
		response.setData(dtoList);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> findBySupplier(Long supplierId) {

		List<Inventory> inventories = inventoryDAO.findBySupplier(supplierId);

		if (inventories.isEmpty()) {
			throw new InventoryException("Supplier Inventory Not Found");
		}

		List<InventoryDTO> dtoList = inventories.stream().map(i -> mapper.map(i, InventoryDTO.class)).toList();

		ResponseStructure<List<InventoryDTO>> response = new ResponseStructure<>();

		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage("Supplier Inventory Found");
		response.setData(dtoList);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> findByWarehouseId(Long warehouseId) {

		List<Inventory> inventories = inventoryDAO.findByWarehouseId(warehouseId);

		if (inventories.isEmpty()) {
			throw new InventoryException("Warehouse Inventory Not Found");
		}

		List<InventoryDTO> dtoList = inventories.stream().map(i -> mapper.map(i, InventoryDTO.class)).toList();

		ResponseStructure<List<InventoryDTO>> response = new ResponseStructure<>();

		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage("Warehouse Inventory Found");
		response.setData(dtoList);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<InventoryDTO>> stockIn(Long id, Double quantity) {

	    if (quantity <= 0) {
	        throw new InventoryException("Quantity must be greater than zero");
	    }

	    Inventory inventory = inventoryDAO.getInventoryById(id)
	            .orElseThrow(() -> new InventoryException("Inventory Not Found"));

	    inventory.setQuantity(inventory.getQuantity() + quantity);

	    updateInventoryStatus(inventory);

	    Inventory saved = inventoryDAO.saveInventory(inventory);

	    InventoryDTO dto = mapper.map(saved, InventoryDTO.class);

	    ResponseStructure<InventoryDTO> response = new ResponseStructure<>();
	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("Stock Added Successfully");
	    response.setData(dto);

	    return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<InventoryDTO>> stockOut(Long id, Double quantity) {

	    if (quantity <= 0) {
	        throw new InventoryException("Quantity must be greater than zero");
	    }

	    Inventory inventory = inventoryDAO.getInventoryById(id)
	            .orElseThrow(() -> new InventoryException("Inventory Not Found"));

	    if (inventory.getQuantity() < quantity) {
	        throw new InventoryException("Insufficient Stock");
	    }

	    inventory.setQuantity(inventory.getQuantity() - quantity);

	    updateInventoryStatus(inventory);

	    Inventory saved = inventoryDAO.saveInventory(inventory);

	    InventoryDTO dto = mapper.map(saved, InventoryDTO.class);

	    ResponseStructure<InventoryDTO> response = new ResponseStructure<>();
	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("Stock Issued Successfully");
	    response.setData(dto);

	    return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	
	
	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> getLowStockInventory() {

		List<Inventory> inventories = inventoryDAO.findByStatus(InventoryStatus.LOW_STOCK);

		List<InventoryDTO> dtoList = inventories.stream().map(inventory -> mapper.map(inventory, InventoryDTO.class))
				.toList();

		ResponseStructure<List<InventoryDTO>> response = new ResponseStructure<>();

		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage("Low Stock Inventory");
		response.setData(dtoList);

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> getAvailableInventory() {

		List<Inventory> inventories = inventoryDAO.findByStatus(InventoryStatus.AVAILABLE);

		List<InventoryDTO> dtoList = inventories.stream().map(inventory -> mapper.map(inventory, InventoryDTO.class))
				.toList();

		ResponseStructure<List<InventoryDTO>> response = new ResponseStructure<>();

		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage("Available Inventory");
		response.setData(dtoList);

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> getOutOfStockInventory() {

		List<Inventory> inventories = inventoryDAO.findByStatus(InventoryStatus.OUT_OF_STOCK);

		List<InventoryDTO> dtoList = inventories.stream().map(inventory -> mapper.map(inventory, InventoryDTO.class))
				.toList();

		ResponseStructure<List<InventoryDTO>> response = new ResponseStructure<>();

		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage("Out Of Stock Inventory");
		response.setData(dtoList);

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	public ResponseEntity<ResponseStructure<Double>> getInventoryValue() {

		List<Inventory> inventories = inventoryDAO.getAllInventries();

		double totalValue = inventories.stream().mapToDouble(Inventory::getTotalValue).sum();

		ResponseStructure<Double> response = new ResponseStructure<>();

		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage("Total Inventory Value");
		response.setData(totalValue);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<String>> deleteAllInventory() {

		inventoryDAO.deleteAllInventory();

		ResponseStructure<String> response = new ResponseStructure<>();

		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage("All Inventory Deleted Successfully");
		response.setData("Deleted");

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<InventoryDTO>> adjustStock(Long id, Double quantity) {

	    if (quantity < 0) {
	        throw new InventoryException("Quantity cannot be negative");
	    }

	    Inventory inventory = inventoryDAO.getInventoryById(id)
	            .orElseThrow(() -> new InventoryException("Inventory Not Found"));

	    inventory.setQuantity(quantity);

	    updateInventoryStatus(inventory);

	    Inventory saved = inventoryDAO.saveInventory(inventory);

	    InventoryDTO dto = mapper.map(saved, InventoryDTO.class);

	    ResponseStructure<InventoryDTO> response = new ResponseStructure<>();
	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("Stock Adjusted Successfully");
	    response.setData(dto);

	    return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<InventoryDashboardDTO>> getDashboard() {

		List<Inventory> inventories = inventoryDAO.getAllInventries();

		InventoryDashboardDTO dto = new InventoryDashboardDTO();

		dto.setTotalMaterials((long) inventories.size());

		dto.setAvailableMaterials(

				inventories.stream()

						.filter(i -> i.getStatus() == InventoryStatus.AVAILABLE)

						.count()

		);

		dto.setLowStockMaterials(

				inventories.stream()

						.filter(i -> i.getStatus() == InventoryStatus.LOW_STOCK)

						.count()

		);

		dto.setOutOfStockMaterials(

				inventories.stream()

						.filter(i -> i.getStatus() == InventoryStatus.OUT_OF_STOCK)

						.count()

		);

		dto.setInventoryValue(

				inventories.stream()

						.mapToDouble(Inventory::getTotalValue)

						.sum()

		);

		ResponseStructure<InventoryDashboardDTO> response =

				new ResponseStructure<>();

		response.setStatusCode(HttpStatus.OK.value());

		response.setMessage("Inventory Dashboard");

		response.setData(dto);

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> getAvailableByCategory(String category) {

		List<Inventory> inventories = inventoryDAO.findByCategory(category);

		List<InventoryDTO> dtoList = inventories.stream()

				.filter(i -> i.getStatus() == InventoryStatus.AVAILABLE)

				.map(i -> mapper.map(i, InventoryDTO.class))

				.toList();

		ResponseStructure<List<InventoryDTO>> response = new ResponseStructure<>();

		response.setStatusCode(HttpStatus.OK.value());

		response.setMessage("Available Inventory By Category");

		response.setData(dtoList);

		return new ResponseEntity<>(response, HttpStatus.OK);

	}

	public ResponseEntity<ResponseStructure<Long>> getInventoryCount() {

		long count = inventoryDAO.getStockOfInventry();

		ResponseStructure<Long> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage("Inventory Count");
		response.setData(count);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<List<InventoryDTO>>> findByWarehouse(String location) {

	    List<Inventory> inventories = inventoryDAO.findByWareHouseLocation(location);

	    if (inventories.isEmpty()) {
	        throw new InventoryException("No Inventory Found");
	    }

	    List<InventoryDTO> dtoList = inventories.stream()
	            .map(i -> mapper.map(i, InventoryDTO.class))
	            .toList();

	    ResponseStructure<List<InventoryDTO>> response = new ResponseStructure<>();
	    response.setStatusCode(HttpStatus.OK.value());
	    response.setMessage("Warehouse Inventory");
	    response.setData(dtoList);

	    return new ResponseEntity<>(response, HttpStatus.OK);
	}

	public ResponseEntity<ResponseStructure<InventoryDTO>> findByMaterialCode(String code) {
		Optional<Inventory> optional = inventoryDAO.findByIdMaterialCode(code);
		if (optional.isEmpty()) {
			throw new InventoryException("Material Code Not Found");
		}
		InventoryDTO dto = mapper.map(optional.get(), InventoryDTO.class);
		ResponseStructure<InventoryDTO> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.OK.value());
		response.setMessage("Inventory Found");
		response.setData(dto);

		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}