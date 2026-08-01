package org.dispatch.service.client;

import java.util.List;

import org.dispatch.service.ResponceEntity.ResponseStructure;
import org.dispatch.service.config.FeignConfig;
import org.dispatch.service.dto.InventoryDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
		name = "INVENTORY-SERVICE",
		configuration = FeignConfig.class,
		fallbackFactory = InventoryClientFallbackFactory.class
)
public interface InventoryClient {

	@GetMapping("/inventory/{id}")
	ResponseStructure<InventoryDTO> getById(@PathVariable("id") Long id);

	@GetMapping("/inventory/material-name/{materialName}")
	ResponseStructure<List<InventoryDTO>> getByMaterialName(@PathVariable("materialName") String materialName);

	// Business Issue #7/#8/#9: validates (Inventory Service rejects the call
	// if stock is insufficient) and reduces stock in a single atomic call.
	@PutMapping("/inventory/stock-out/{id}")
	Object stockOut(@PathVariable("id") Long id, @RequestParam("quantity") Double quantity);
}
