package org.production.service.dto;

import lombok.Data;

@Data
public class InventoryDTO {

	private Long inventoryId;
	private Long vendorId;
	private String materialName;
	private Double quantity;
	private String status;
}
