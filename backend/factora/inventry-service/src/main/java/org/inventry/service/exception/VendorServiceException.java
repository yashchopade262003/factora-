package org.inventry.service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Raised whenever the call to the downstream Vendor service cannot be
 * satisfied - either because the vendor genuinely does not exist, or
 * because the Vendor service itself is unreachable / erroring (in which
 * case the circuit breaker fallback raises this with SERVICE_UNAVAILABLE).
 */
@Getter
public class VendorServiceException extends RuntimeException {

	private final HttpStatus status;

	public VendorServiceException(String message, HttpStatus status) {
		super(message);
		this.status = status;
	}
}
