package com.factoryflow.auth.dto;

import java.time.LocalDate;

import lombok.Data;

/**
 * Mirrors the shape of inventory-service's InventoryDTO. Kept as a plain,
 * decoupled copy (status as String rather than inventory-service's
 * InventoryStatus enum) so auth-service isn't compiled against
 * inventory-service's internal types.
 */
@Data
public class InventoryDTO {

	private Long inventoryId;

	private Long vendorId;

	private Long warehouseId;

	private String materialCode;

	private String materialName;

	private String materialCategory;

	private Double quantity;

	private String unit;

	private Double unitPrice;

	private Double totalValue;

	private String warehouseLocation;

	private Long supplierId;

	private String batchNumber;

	private LocalDate manufacturingDate;

	private LocalDate expiryDate;

	private LocalDate receivedDate;

	private String status;

	private Double minimumStockLevel;

	private String remarks;

}
