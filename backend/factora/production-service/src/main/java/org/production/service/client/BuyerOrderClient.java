package org.production.service.client;

import java.util.List;

import org.production.service.ResponceEntity.ResponseStructure;
import org.production.service.config.FeignConfig;
import org.production.service.dto.BuyerOrderDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
		name = "BUYER-SERVICE",
		configuration = FeignConfig.class,
		fallbackFactory = BuyerOrderClientFallbackFactory.class
)
public interface BuyerOrderClient {

	@GetMapping("/buyer-order/vendor/{vendorId}")
	ResponseStructure<List<BuyerOrderDTO>> getOrdersByVendor(@PathVariable("vendorId") Long vendorId);

	@PutMapping("/buyer-order/status/{id}")
	Object updateStatus(@PathVariable("id") Long id, @RequestParam("status") String status);
}
