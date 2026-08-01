package com.factoryflow.auth.dto;

import java.time.LocalDate;

import lombok.Data;

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
