package com.factoryflow.auth.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(DownstreamServiceException.class)
	public ResponseEntity<ErrorResponse> handleDownstreamServiceException(DownstreamServiceException ex) {
		ErrorResponse error = new ErrorResponse(ex.getStatus().value(), ex.getMessage());
		return new ResponseEntity<>(error, ex.getStatus());
	}

	@ExceptionHandler(AuthException.class)
	public ResponseEntity<ErrorResponse> handleAuthException(AuthException ex) {
		ErrorResponse error = new ErrorResponse(ex.getStatus().value(), ex.getMessage());
		return new ResponseEntity<>(error, ex.getStatus());
	}
}
