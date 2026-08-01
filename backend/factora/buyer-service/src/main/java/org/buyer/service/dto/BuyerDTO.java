package org.buyer.service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BuyerDTO {

	private Long buyerId;

	@NotNull(message = "vendorId is required")
	private Long vendorId;

	@NotBlank(message = "buyerName is required")
	private String buyerName;

	private String companyName;

	private String email;

	private String phone;

	private String address;

	private String gstNumber;

	private String status;
}
