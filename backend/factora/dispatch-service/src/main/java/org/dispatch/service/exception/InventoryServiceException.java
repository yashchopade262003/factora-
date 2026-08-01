package org.dispatch.service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class InventoryServiceException extends RuntimeException {

	private final HttpStatus status;

	public InventoryServiceException(String message, HttpStatus status) {
		super(message);
		this.status = status;
	}
}
