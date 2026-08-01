package org.production.service.client;

import org.production.service.exception.BuyerOrderServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

import feign.FeignException;

@Component
public class BuyerOrderClientFallbackFactory implements FallbackFactory<BuyerOrderClient> {

	private static final Logger log = LoggerFactory.getLogger(BuyerOrderClientFallbackFactory.class);

	@Override
	public BuyerOrderClient create(Throwable cause) {
		return new BuyerOrderClient() {

			@Override
			public org.production.service.ResponceEntity.ResponseStructure<java.util.List<org.production.service.dto.BuyerOrderDTO>> getOrdersByVendor(
					Long vendorId) {
				log.warn("Buyer Order lookup failed for vendorId={}: {}", vendorId, cause.getMessage());
				throw translate(cause, "Unable to fetch buyer orders for vendorId=" + vendorId);
			}

			@Override
			public Object updateStatus(Long id, String status) {
				log.warn("Buyer Order status update failed for orderId={}, status={}: {}", id, status,
						cause.getMessage());
				throw translate(cause, "Unable to update Buyer Order id=" + id + " to status " + status
						+ ". The production run completed and inventory was updated, but the buyer order status"
						+ " could not be synced - please update it manually.");
			}
		};
	}

	private BuyerOrderServiceException translate(Throwable cause, String message) {
		if (cause instanceof FeignException.NotFound || cause instanceof HttpClientErrorException.NotFound) {
			return new BuyerOrderServiceException(message, HttpStatus.NOT_FOUND);
		}
		return new BuyerOrderServiceException(message, HttpStatus.SERVICE_UNAVAILABLE);
	}
}
