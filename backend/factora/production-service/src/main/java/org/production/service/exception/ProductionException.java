package org.production.service.exception;

import lombok.Getter;

@Getter
public class ProductionException extends RuntimeException {

	private final String msg;

	public ProductionException(String msg) {
		super(msg);
		this.msg = msg;
	}
}
