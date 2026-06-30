package org.inventry.service.client;

import org.inventry.service.dto.VendorDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(

		name = "AUTH-SERVICE",

		url = "http://localhost:8081"

)

public interface VendorClient {

	@GetMapping("/vendor/{id}")

	VendorDTO getVendor(@PathVariable Long id );

}