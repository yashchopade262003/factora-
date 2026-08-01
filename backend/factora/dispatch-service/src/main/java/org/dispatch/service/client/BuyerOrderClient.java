package org.dispatch.service.client;

import org.dispatch.service.ResponceEntity.ResponseStructure;
import org.dispatch.service.config.FeignConfig;
import org.dispatch.service.dto.BuyerOrderDTO;
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

	@GetMapping("/buyer-order/{id}")
	ResponseStructure<BuyerOrderDTO> getOrderById(@PathVariable("id") Long id);

	@PutMapping("/buyer-order/status/{id}")
	Object updateStatus(@PathVariable("id") Long id, @RequestParam("status") String status);
}
