package com.factoryflow.auth.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Raised whenever a call from auth-service to a downstream microservice
 * (e.g. inventory-service) cannot be satisfied - either the requested
 * record genuinely doesn't exist, or the downstream service itself is
 * unreachable / erroring (in which case the fallback raises this with
 * SERVICE_UNAVAILABLE).
 */
@Getter
public class DownstreamServiceException extends RuntimeException {

	private final String serviceName;
	private final HttpStatus status;

	public DownstreamServiceException(String serviceName, String message, HttpStatus status) {
		super(message);
		this.serviceName = serviceName;
		this.status = status;
	}
}
