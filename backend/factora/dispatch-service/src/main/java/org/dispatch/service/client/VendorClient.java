package org.dispatch.service.client;

import org.dispatch.service.config.FeignConfig;
import org.dispatch.service.dto.VendorDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
		name = "AUTH-SERVICE",
		configuration = FeignConfig.class,
		fallbackFactory = VendorClientFallbackFactory.class
)
public interface VendorClient {

	@GetMapping("/vendor/{id}")
	VendorDTO getVendor(@PathVariable("id") Long id);
}
