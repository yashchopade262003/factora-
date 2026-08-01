package org.buyer.service.dto;

import java.time.LocalDate;

import org.buyer.service.entity.OrderStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class BuyerOrderDTO {

	private Long orderId;

	@NotNull(message = "vendorId is required")
	private Long vendorId;

	@NotNull(message = "buyerId is required")
	private Long buyerId;

	@NotBlank(message = "productName is required")
	private String productName;

	@NotNull(message = "quantity is required")
	@Positive(message = "quantity must be greater than zero")
	private Double quantity;

	@NotBlank(message = "unit is required")
	private String unit;

	@NotNull(message = "unitPrice is required")
	@Positive(message = "unitPrice must be greater than zero")
	private Double unitPrice;

	private Double totalAmount;

	private LocalDate orderDate;

	private LocalDate expectedDeliveryDate;

	private OrderStatus status;

	private String remarks;
}
