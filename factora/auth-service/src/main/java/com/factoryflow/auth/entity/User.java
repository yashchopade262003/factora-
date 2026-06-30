package com.factoryflow.auth.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name = "users")
@Data
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long userId;

	private String username;

	private String email;

	private String password;

	private String phone;

	private String status;

	private LocalDateTime createdAt;



	@ManyToOne
	@JoinColumn(name = "vendor_id")
	@ToString.Exclude
	private Vendor vendor;

	@ManyToOne
	@JoinColumn(name = "role_id")
	@ToString.Exclude
	private Role role;

	@PrePersist
	public void createAt() {
		this.createdAt = LocalDateTime.now();
	}

}