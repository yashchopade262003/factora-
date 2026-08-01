package org.dispatch.service.dto;

import lombok.Data;

/**
 * Read-only projection of the Buyer Service's BuyerOrderDTO. Dispatch
 * Service never writes buyer-order fields through this DTO - status
 * transitions still go through Buyer Service's own /buyer-order/status
 * endpoint.
 */
@Data
public class BuyerOrderDTO {

	private Long orderId;
	private Long vendorId;
	private Long buyerId;
	private String productName;
	private Double quantity;
	private String status;
}
