package org.buyer.service.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "buyer_order")
@Data
public class BuyerOrder {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "buyer_order_seq")
	@SequenceGenerator(name = "buyer_order_seq", sequenceName = "buyer_order_seq", initialValue = 101, allocationSize = 1)
	private Long orderId;

	private Long vendorId;

	private Long buyerId;

	private String productName;

	private Double quantity;

	private String unit;

	private Double unitPrice;

	private Double totalAmount;

	private LocalDate orderDate;

	private LocalDate expectedDeliveryDate;

	@Enumerated(EnumType.STRING)
	private OrderStatus status;

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
			status = OrderStatus.PENDING;
		}
		if (orderDate == null) {
			orderDate = LocalDate.now();
		}
		if (totalAmount == null && quantity != null && unitPrice != null) {
			totalAmount = quantity * unitPrice;
		}
	}

	@PreUpdate
	public void onUpdate() {
		updatedAt = LocalDateTime.now();
		if (quantity != null && unitPrice != null) {
			totalAmount = quantity * unitPrice;
		}
	}
}
