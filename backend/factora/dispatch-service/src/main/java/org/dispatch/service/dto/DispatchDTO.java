package org.dispatch.service.dto;

import java.time.LocalDate;

import org.dispatch.service.entity.DeliveryStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class DispatchDTO {

	private Long dispatchId;

	@NotNull(message = "vendorId is required")
	private Long vendorId;

	private Long buyerOrderId;

	@NotNull(message = "buyerId is required")
	private Long buyerId;

	private Long finishedGoodsInventoryId;

	@NotBlank(message = "productName is required")
	private String productName;

	@NotNull(message = "quantity is required")
	@Positive(message = "quantity must be greater than zero")
	private Double quantity;

	@NotBlank(message = "unit is required")
	private String unit;

	@NotBlank(message = "vehicleNumber is required")
	private String vehicleNumber;

	@NotBlank(message = "driverName is required")
	private String driverName;

	private String driverPhone;

	@NotBlank(message = "destinationAddress is required")
	private String destinationAddress;

	private String invoiceNumber;

	private LocalDate dispatchDate;

	private LocalDate expectedDeliveryDate;

	private DeliveryStatus deliveryStatus;

	private String remarks;
}
