package org.buyer.service.client;

import java.util.List;

import org.buyer.service.ResponceEntity.ResponseStructure;
import org.buyer.service.config.FeignConfig;
import org.buyer.service.dto.InventoryDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Talks to the Inventory microservice to check current stock for a product
 * when a Buyer Order is placed. Reuses the existing
 * GET /inventory/material-name/{materialName} endpoint that already backs
 * the Inventory dashboard search - no new Inventory Service endpoint is
 * introduced.
 */
@FeignClient(
		name = "INVENTORY-SERVICE",
		configuration = FeignConfig.class,
		fallbackFactory = InventoryClientFallbackFactory.class
)
public interface InventoryClient {

	@GetMapping("/inventory/material-name/{materialName}")
	ResponseStructure<List<InventoryDTO>> getByMaterialName(@PathVariable("materialName") String materialName);
}
