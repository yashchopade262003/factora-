package com.factoryflow.auth.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Handles failures from auth-service's own outbound calls to downstream
 * services (currently: inventory-service). This does not replace or
 * override any existing controller behavior - auth-service previously had
 * no global exception handling, so this only reacts to
 * DownstreamServiceException and leaves every other exception path
 * untouched.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(DownstreamServiceException.class)
	public ResponseEntity<ErrorResponse> handleDownstreamServiceException(DownstreamServiceException ex) {
		ErrorResponse error = new ErrorResponse(ex.getStatus().value(), ex.getMessage());
		return new ResponseEntity<>(error, ex.getStatus());
	}
}
