package com.factoryflow.auth.dto;

import lombok.Data;

@Data
public class VendorDTO {
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
}
