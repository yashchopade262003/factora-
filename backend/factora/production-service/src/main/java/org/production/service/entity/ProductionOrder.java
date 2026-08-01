package org.production.service.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "production_order")
@Data
public class ProductionOrder {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "production_order_seq")
	@SequenceGenerator(name = "production_order_seq", sequenceName = "production_order_seq", initialValue = 101, allocationSize = 1)
	private Long productionOrderId;

	private Long vendorId;

	private String productName;

	private Long rawMaterialInventoryId;

	private Double rawMaterialQuantity;

	private Double producedQuantity;

	// Optional: the Buyer Order this production run fulfils. When not
	// supplied, completing production falls back to matching the oldest
	// IN_PRODUCTION buyer order for the same vendorId + productName.
	private Long buyerOrderId;

	// Optional: the finished-goods Inventory record to stock the produced
	// quantity into. When not supplied, completing production falls back to
	// matching an Inventory record by vendorId + materialName (productName).
	private Long finishedGoodsInventoryId;

	private String unit;

	private Long machineId;

	private String batchNumber;

	private LocalDate startDate;

	private LocalDate endDate;

	@Enumerated(EnumType.STRING)
	private ProductionStatus status;

	private String remarks;

	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;

	@Version
	private Long version;

	@PrePersist
	public void onCreate() {
		createdAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
		if (status == null) {
			status = ProductionStatus.PLANNED;
		}
	}

	@PreUpdate
	public void onUpdate() {
		updatedAt = LocalDateTime.now();
	}
}
