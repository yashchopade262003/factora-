package org.buyer.service.client;

import java.util.Collections;
import java.util.List;

import org.buyer.service.ResponceEntity.ResponseStructure;
import org.buyer.service.dto.InventoryDTO;
import org.buyer.service.exception.BuyerException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

import feign.FeignException;

@Component
public class InventoryClientFallbackFactory implements FallbackFactory<InventoryClient> {

	private static final Logger log = LoggerFactory.getLogger(InventoryClientFallbackFactory.class);

	@Override
	public InventoryClient create(Throwable cause) {
		return materialName -> {
			log.warn("Inventory lookup failed for materialName={}: {}", materialName, cause.getMessage());

			// Inventory Service answers "Material Not Found" with 400 Bad Request
			// (not 404) for this endpoint. Given the materialName we send is
			// always the order's own productName, a 400 here reliably means
			// "no stock record for this product" - i.e. zero stock - rather
			// than a malformed request, so we treat it as such instead of
			// blocking the buyer order.
			if (cause instanceof FeignException.BadRequest || cause instanceof FeignException.NotFound
					|| cause instanceof HttpClientErrorException.BadRequest
					|| cause instanceof HttpClientErrorException.NotFound) {
				List<InventoryDTO> empty = Collections.emptyList();
				return new ResponseStructure<>(HttpStatus.OK.value(), "No Inventory Found", empty);
			}

			throw new BuyerException(
					"Inventory Service is currently unavailable, please try again shortly");
		};
	}
}
