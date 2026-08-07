package org.buyer.service.client;

import java.util.List;

import org.buyer.service.ResponceEntity.ResponseStructure;
import org.buyer.service.config.FeignConfig;
import org.buyer.service.dto.InventoryDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@FeignClient(
		name = "INVENTORY-SERVICE",
		configuration = FeignConfig.class,
		fallbackFactory = InventoryClientFallbackFactory.class
)
public interface InventoryClient {

	@GetMapping("/inventory/material-name/{materialName}")
	ResponseStructure<List<InventoryDTO>> getByMaterialName(@PathVariable("materialName") String materialName);
}
