package org.production.service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class BuyerOrderServiceException extends RuntimeException {

	private final HttpStatus status;

	public BuyerOrderServiceException(String message, HttpStatus status) {
		super(message);
		this.status = status;
	}
}
