package com.factoryflow.auth.client;

import java.util.List; 

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.factoryflow.auth.config.FeignConfig;
import com.factoryflow.auth.dto.ApiResponse;
import com.factoryflow.auth.dto.InventoryDTO;

@FeignClient(
        name = "INVENTORY-SERVICE",
        url = "${inventory.service.url:}",
        configuration = FeignConfig.class,
        fallbackFactory = InventoryClientFallbackFactory.class
)
public interface InventoryClient {

	@GetMapping("/inventory/vendor/{vendorId}")
	ApiResponse<List<InventoryDTO>> getInventoryByVendor(@PathVariable Long vendorId);

	@GetMapping("/inventory/{id}")
	ApiResponse<InventoryDTO> getInventoryById(@PathVariable Long id);

}
