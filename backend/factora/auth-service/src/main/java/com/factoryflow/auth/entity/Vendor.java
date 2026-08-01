package com.factoryflow.auth.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.commons.lang3.builder.ToStringExclude;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name = "vendors")
@Data
public class Vendor {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "vendor_seq")
	@SequenceGenerator(name = "vendor_seq", sequenceName = "vendor_seq", initialValue = 101, allocationSize = 1)
	private Long vendorId;

	private String vendorCode;

	private String vendorName;

	private String factoryName;

	private String ownerName;

	private String email;

	private String phone;

	private String address;

	private String gstNumber;

	private String status;

	private LocalDateTime createdAt;

	@OneToMany(mappedBy = "vendor")
	@ToString.Exclude
	private List<User> users;

	@PrePersist
	public void createAt() {
		this.createdAt = LocalDateTime.now();
	}

}
