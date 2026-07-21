package org.inventry.service.client;

import org.inventry.service.exception.VendorServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

import feign.FeignException;

/**
 * Wraps every VendorClient failure mode into a clear, typed
 * {@link VendorServiceException} instead of letting a raw FeignException
 * (or a connection-refused exception when the Vendor service is down)
 * bubble up as an opaque 500.
 *
 * - Vendor genuinely doesn't exist (404 from Vendor service)  -> 404 NOT_FOUND
 * - Vendor service is down / timing out / circuit open        -> 503 SERVICE_UNAVAILABLE
 */
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
