package org.buyer.service.dto;

import lombok.Data;

/**
 * Read-only projection of the Inventory Service's InventoryDTO, used only to
 * check whether enough stock exists when a Buyer Order is placed. Buyer
 * Service never writes inventory data, so only the fields needed for the
 * stock-availability check are declared here.
 */
@Data
public class InventoryDTO {

	private Long inventoryId;
	private Long vendorId;
	private String materialName;
	private Double quantity;
	private String status;
}
