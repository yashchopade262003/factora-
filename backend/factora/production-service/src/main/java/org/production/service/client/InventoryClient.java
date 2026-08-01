package org.production.service.client;

import java.util.List;

import org.production.service.ResponceEntity.ResponseStructure;
import org.production.service.config.FeignConfig;
import org.production.service.dto.InventoryDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Talks to the Inventory microservice to consume raw material when a
 * production run starts, look up finished-goods stock, and add finished
 * goods back into Inventory when a run completes. "INVENTORY-SERVICE" is
 * the Eureka application id inventory-service registers under.
 */
@FeignClient(
		name = "INVENTORY-SERVICE",
		configuration = FeignConfig.class,
		fallbackFactory = InventoryClientFallbackFactory.class
)
public interface InventoryClient {

	@PutMapping("/inventory/stock-out/{id}")
	Object stockOut(@PathVariable("id") Long id, @RequestParam("quantity") Double quantity);

	// Business Issue #5: completing production adds the finished quantity
	// back into Inventory via the existing stock-in endpoint.
	@PutMapping("/inventory/stock-in/{id}")
	Object stockIn(@PathVariable("id") Long id, @RequestParam("quantity") Double quantity);

	@GetMapping("/inventory/material-name/{materialName}")
	ResponseStructure<List<InventoryDTO>> getByMaterialName(@PathVariable("materialName") String materialName);
}
