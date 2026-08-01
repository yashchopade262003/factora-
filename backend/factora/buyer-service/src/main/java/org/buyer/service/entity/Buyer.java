package org.buyer.service.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "buyer")
@Data
public class Buyer {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "buyer_seq")
	@SequenceGenerator(name = "buyer_seq", sequenceName = "buyer_seq", initialValue = 101, allocationSize = 1)
	private Long buyerId;

	private Long vendorId;

	private String buyerName;

	private String companyName;

	private String email;

	private String phone;

	private String address;

	private String gstNumber;

	private String status; // ACTIVE / INACTIVE

	private LocalDateTime createdAt;

	private LocalDateTime updatedAt;

	@PrePersist
	public void onCreate() {
		createdAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
		if (status == null) {
			status = "ACTIVE";
		}
	}

	@PreUpdate
	public void onUpdate() {
		updatedAt = LocalDateTime.now();
	}
}
