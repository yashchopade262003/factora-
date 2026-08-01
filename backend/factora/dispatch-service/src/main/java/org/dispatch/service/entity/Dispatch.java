package org.dispatch.service.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "dispatch")
@Data
public class Dispatch {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "dispatch_seq")
	@SequenceGenerator(name = "dispatch_seq", sequenceName = "dispatch_seq", initialValue = 101, allocationSize = 1)
	private Long dispatchId;

	private Long vendorId;

	// Reference to the Buyer Order this dispatch fulfils
	private Long buyerOrderId;

	private Long buyerId;

	private Long finishedGoodsInventoryId;

	private String productName;

	private Double quantity;

	private String unit;

	private String vehicleNumber;

	private String driverName;

	private String driverPhone;

	private String destinationAddress;

	private String invoiceNumber;

	private LocalDate dispatchDate;

	private LocalDate expectedDeliveryDate;

	@Enumerated(EnumType.STRING)
	private DeliveryStatus deliveryStatus;

	private String remarks;

	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;

	@Version
	private Long version;

	@PrePersist
	public void onCreate() {
		createdAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
		if (deliveryStatus == null) {
			deliveryStatus = DeliveryStatus.PENDING;
		}
	}

	@PreUpdate
	public void onUpdate() {
		updatedAt = LocalDateTime.now();
	}
}
