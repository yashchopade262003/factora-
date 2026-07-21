package com.factoryflow.auth.client;

import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

import com.factoryflow.auth.dto.ApiResponse;
import com.factoryflow.auth.dto.InventoryDTO;
import com.factoryflow.auth.exception.DownstreamServiceException;

import feign.FeignException;

/**
 * Wraps every InventoryClient failure mode into a clear, typed
 * {@link DownstreamServiceException} instead of letting a raw
 * FeignException (or a connection-refused exception when inventory-service
 * is down) bubble up as an opaque 500.
 *
 * - No inventory yet for a vendor (400 "Vendor Inventory Not Found") -> treated
 *   as a normal empty result, not an error, since it's a common/expected state.
 * - Inventory record genuinely doesn't exist (404)                  -> 404 NOT_FOUND
 * - Inventory service is down / timing out / circuit open           -> 503 SERVICE_UNAVAILABLE
 */
@Component
public class InventoryClientFallbackFactory implements FallbackFactory<InventoryClient> {

	private static final Logger log = LoggerFactory.getLogger(InventoryClientFallbackFactory.class);

	@Override
	public InventoryClient create(Throwable cause) {
		return new InventoryClient() {

			@Override
			public ApiResponse<List<InventoryDTO>> getInventoryByVendor(Long vendorId) {

				log.warn("Inventory lookup failed for vendorId={}: {}", vendorId, cause.getMessage());

				if (cause instanceof FeignException.BadRequest || cause instanceof FeignException.NotFound) {
					// inventory-service returns 400 when a vendor simply has no
					// inventory recorded yet - that's a normal state, not a failure.
					return new ApiResponse<>(HttpStatus.OK.value(), "No Inventory Found For Vendor",
							Collections.emptyList());
				}

				throw new DownstreamServiceException("INVENTORY-SERVICE",
						"Inventory Service is currently unavailable, please try again shortly",
						HttpStatus.SERVICE_UNAVAILABLE);
			}

			@Override
			public ApiResponse<InventoryDTO> getInventoryById(Long id) {

				log.warn("Inventory lookup failed for inventoryId={}: {}", id, cause.getMessage());

				if (cause instanceof FeignException.NotFound || cause instanceof HttpClientErrorException.NotFound) {
					throw new DownstreamServiceException("INVENTORY-SERVICE",
							"Inventory Not Found with id: " + id, HttpStatus.NOT_FOUND);
				}

				throw new DownstreamServiceException("INVENTORY-SERVICE",
						"Inventory Service is currently unavailable, please try again shortly",
						HttpStatus.SERVICE_UNAVAILABLE);
			}
		};
	}
}
