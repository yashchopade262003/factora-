package org.production.service.dto;

import java.time.LocalDate;

import org.production.service.entity.ProductionStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class ProductionOrderDTO {

	private Long productionOrderId;

	@NotNull(message = "vendorId is required")
	private Long vendorId;

	@NotBlank(message = "productName is required")
	private String productName;

	@NotNull(message = "rawMaterialInventoryId is required")
	private Long rawMaterialInventoryId;

	@NotNull(message = "rawMaterialQuantity is required")
	@PositiveOrZero(message = "rawMaterialQuantity cannot be negative")
	private Double rawMaterialQuantity;

	private Double producedQuantity;

	// Optional linkage back to the Buyer Order this run fulfils, and to the
	// finished-goods Inventory record to stock into on completion. See
	// ProductionOrder entity for the fallback-matching behaviour when these
	// are left null.
	private Long buyerOrderId;

	private Long finishedGoodsInventoryId;

	@NotBlank(message = "unit is required")
	private String unit;

	private Long machineId;

	private String batchNumber;

	private LocalDate startDate;

	private LocalDate endDate;

	private ProductionStatus status;

	private String remarks;
}
