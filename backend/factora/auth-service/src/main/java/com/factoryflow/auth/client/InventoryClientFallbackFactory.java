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
