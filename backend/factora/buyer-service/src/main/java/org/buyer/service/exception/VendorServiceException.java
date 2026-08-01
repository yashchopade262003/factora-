package org.buyer.service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class VendorServiceException extends RuntimeException {

	private final HttpStatus status;

	public VendorServiceException(String message, HttpStatus status) {
		super(message);
		this.status = status;
	}
}
