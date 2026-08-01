package org.dispatch.service.client;

import java.util.Collections;
import java.util.List;

import org.dispatch.service.ResponceEntity.ResponseStructure;
import org.dispatch.service.dto.InventoryDTO;
import org.dispatch.service.exception.InventoryServiceException;
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
		return new InventoryClient() {

			@Override
			public ResponseStructure<InventoryDTO> getById(Long id) {
				log.warn("Inventory lookup by id failed for inventoryId={}: {}", id, cause.getMessage());
				if (isNotFound(cause)) {
					throw new InventoryServiceException("Inventory record not found with id: " + id,
							HttpStatus.NOT_FOUND);
				}
				throw new InventoryServiceException(
						"Inventory Service is currently unavailable, please try again shortly",
						HttpStatus.SERVICE_UNAVAILABLE);
			}

			@Override
			public ResponseStructure<List<InventoryDTO>> getByMaterialName(String materialName) {
				log.warn("Inventory lookup by materialName failed for materialName={}: {}", materialName,
						cause.getMessage());

				// This endpoint answers "not found" with 400, not 404; here that
				// reliably means "no finished-goods record for this product".
				if (isBadRequest(cause) || isNotFound(cause)) {
					return new ResponseStructure<>(HttpStatus.OK.value(), "No Inventory Found",
							Collections.emptyList());
				}

				throw new InventoryServiceException(
						"Inventory Service is currently unavailable, please try again shortly",
						HttpStatus.SERVICE_UNAVAILABLE);
			}

			@Override
			public Object stockOut(Long id, Double quantity) {
				log.warn("Inventory stock-out failed for inventoryId={}, quantity={}: {}", id, quantity,
						cause.getMessage());

				// Business Issue #7/#9: Inventory Service rejects stock-out with
				// 400 Bad Request when stock is insufficient or the quantity is
				// invalid - surface that clearly so dispatch is blocked.
				if (isBadRequest(cause)) {
					throw new InventoryServiceException(
							"Dispatch cannot proceed: insufficient stock (or invalid quantity) for inventory id="
									+ id, HttpStatus.BAD_REQUEST);
				}
				if (isNotFound(cause)) {
					throw new InventoryServiceException("Inventory record not found with id: " + id,
							HttpStatus.NOT_FOUND);
				}

				throw new InventoryServiceException(
						"Inventory Service is currently unavailable, dispatch cannot proceed. Please try again shortly.",
						HttpStatus.SERVICE_UNAVAILABLE);
			}

			private boolean isNotFound(Throwable cause) {
				return cause instanceof FeignException.NotFound || cause instanceof HttpClientErrorException.NotFound;
			}

			private boolean isBadRequest(Throwable cause) {
				return cause instanceof FeignException.BadRequest
						|| cause instanceof HttpClientErrorException.BadRequest;
			}
		};
	}
}
