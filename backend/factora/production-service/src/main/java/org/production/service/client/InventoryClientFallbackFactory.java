package org.production.service.client;

import java.util.Collections;
import java.util.List;

import org.production.service.ResponceEntity.ResponseStructure;
import org.production.service.dto.InventoryDTO;
import org.production.service.exception.ProductionException;
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
			public Object stockOut(Long id, Double quantity) {
				log.warn("Inventory stock-out failed for inventoryId={}: {}", id, cause.getMessage());
				throw new ProductionException(
						"Unable to reserve raw material from Inventory Service (id=" + id
								+ "). It may be out of stock or the service is unavailable.");
			}

			@Override
			public Object stockIn(Long id, Double quantity) {
				log.warn("Inventory stock-in failed for inventoryId={}: {}", id, cause.getMessage());
				throw new ProductionException(
						"Production completed but the finished goods could not be added back into Inventory"
								+ " (inventoryId=" + id + "). Inventory Service may be unavailable - please stock-in"
								+ " manually.");
			}

			@Override
			public ResponseStructure<List<InventoryDTO>> getByMaterialName(String materialName) {
				log.warn("Inventory lookup failed for materialName={}: {}", materialName, cause.getMessage());

				// Same reasoning as Buyer Service's InventoryClient fallback:
				// this endpoint answers "not found" with 400, not 404, and a
				// "not found" here just means no finished-goods record exists
				// yet for this vendor/product.
				if (cause instanceof FeignException.BadRequest || cause instanceof FeignException.NotFound
						|| cause instanceof HttpClientErrorException.BadRequest
						|| cause instanceof HttpClientErrorException.NotFound) {
					return new ResponseStructure<>(HttpStatus.OK.value(), "No Inventory Found",
							Collections.emptyList());
				}

				throw new ProductionException(
						"Inventory Service is currently unavailable, please try again shortly");
			}
		};
	}
}
