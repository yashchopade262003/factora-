package org.inventry.service.dto;

import java.time.LocalDate;

import org.inventry.service.entity.InventoryStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

/**
 * Used for both create and update requests. On update, InventoryService
 * relies on ModelMapper's skip-null-values setting so fields the caller
 * omits are left untouched on the existing entity rather than nulled out.
 */
@Data
public class InventoryDTO {

	private Long inventoryId;

	@NotNull(message = "vendorId is required")
	private Long vendorId;

	@NotNull(message = "warehouseId is required")
	private Long warehouseId;

	@NotBlank(message = "materialCode is required")
	private String materialCode;

	@NotBlank(message = "materialName is required")
	private String materialName;

	private String materialCategory;

	@NotNull(message = "quantity is required")
	@PositiveOrZero(message = "quantity cannot be negative")
	private Double quantity;

	@NotBlank(message = "unit is required (e.g. Kg, Ton, Liter, Piece)")
	private String unit;

	@NotNull(message = "unitPrice is required")
	@Positive(message = "unitPrice must be greater than zero")
	private Double unitPrice;

	private Double totalValue;

	private String warehouseLocation;

	private Long supplierId;

	private String batchNumber;

	private LocalDate manufacturingDate;

	private LocalDate expiryDate;

	private LocalDate receivedDate;

	private InventoryStatus status;

	@NotNull(message = "minimumStockLevel is required")
	@PositiveOrZero(message = "minimumStockLevel cannot be negative")
	private Double minimumStockLevel;

	private String remarks;

}
