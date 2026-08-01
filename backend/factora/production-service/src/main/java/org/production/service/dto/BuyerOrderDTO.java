package org.production.service.dto;

import java.time.LocalDate;

import lombok.Data;

/**
 * Read-only projection of the Buyer Service's BuyerOrderDTO. Production
 * Service never writes buyer-order data directly through this DTO (status
 * transitions still go through Buyer Service's own /buyer-order/status
 * endpoint) - it's only used to find which buyer order a completed
 * production run should update.
 */
@Data
public class BuyerOrderDTO {

	private Long orderId;
	private Long vendorId;
	private Long buyerId;
	private String productName;
	private Double quantity;
	private String status;
	private LocalDate orderDate;
}
