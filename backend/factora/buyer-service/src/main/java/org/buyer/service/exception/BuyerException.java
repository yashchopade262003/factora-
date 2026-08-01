package org.buyer.service.exception;

import lombok.Getter;

@Getter
public class BuyerException extends RuntimeException {

	private final String msg;

	public BuyerException(String msg) {
		super(msg);
		this.msg = msg;
	}
}
