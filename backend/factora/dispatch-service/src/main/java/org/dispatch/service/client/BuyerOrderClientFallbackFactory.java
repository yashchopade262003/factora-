package org.dispatch.service.client;

import org.dispatch.service.ResponceEntity.ResponseStructure;
import org.dispatch.service.dto.BuyerOrderDTO;
import org.dispatch.service.exception.BuyerOrderServiceException;
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
			public ResponseStructure<BuyerOrderDTO> getOrderById(Long id) {
				log.warn("Buyer Order lookup failed for orderId={}: {}", id, cause.getMessage());
				if (cause instanceof FeignException.NotFound || cause instanceof HttpClientErrorException.NotFound) {
					throw new BuyerOrderServiceException("Buyer Order Not Found with id: " + id,
							HttpStatus.NOT_FOUND);
				}
				throw new BuyerOrderServiceException(
						"Buyer Service is currently unavailable, dispatch cannot proceed. Please try again shortly.",
						HttpStatus.SERVICE_UNAVAILABLE);
			}

			@Override
			public Object updateStatus(Long id, String status) {
				log.warn("Buyer Order status update failed for orderId={}, status={}: {}", id, status,
						cause.getMessage());
				throw new BuyerOrderServiceException(
						"Dispatch was recorded and inventory was updated, but Buyer Order id=" + id
								+ " could not be marked " + status + " - please update it manually.",
						HttpStatus.SERVICE_UNAVAILABLE);
			}
		};
	}
}
