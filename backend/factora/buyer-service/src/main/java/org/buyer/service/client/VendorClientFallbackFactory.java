package org.buyer.service.client;

import org.buyer.service.exception.VendorServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

import feign.FeignException;

@Component
public class VendorClientFallbackFactory implements FallbackFactory<VendorClient> {

	private static final Logger log = LoggerFactory.getLogger(VendorClientFallbackFactory.class);

	@Override
	public VendorClient create(Throwable cause) {
		return vendorId -> {
			log.warn("Vendor lookup failed for vendorId={}: {}", vendorId, cause.getMessage());

			if (cause instanceof FeignException.NotFound || cause instanceof HttpClientErrorException.NotFound) {
				throw new VendorServiceException("Vendor Not Found with id: " + vendorId, HttpStatus.NOT_FOUND);
			}

			throw new VendorServiceException(
					"Vendor Service is currently unavailable, please try again shortly",
					HttpStatus.SERVICE_UNAVAILABLE);
		};
	}
}
