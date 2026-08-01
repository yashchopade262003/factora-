package org.inventry.service.client;

import org.inventry.service.exception.VendorServiceException;
import org.springframework.cloud.openfeign.FallbackFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import feign.FeignException;

@Component
public class VendorClientFallbackFactory implements FallbackFactory<VendorClient> {

    @Override
    public VendorClient create(Throwable cause) {

        return vendorId -> {

            // Vendor ID not found
            if (cause instanceof FeignException.NotFound) {
                throw new VendorServiceException(
                        "Vendor not found: " + vendorId,
                        HttpStatus.NOT_FOUND);
            }

            // Vendor Service is down
            throw new VendorServiceException(
                    "Vendor Service is unavailable",
                    HttpStatus.SERVICE_UNAVAILABLE);
        };
    }
}