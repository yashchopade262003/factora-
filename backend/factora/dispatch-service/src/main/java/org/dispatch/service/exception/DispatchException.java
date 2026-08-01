package org.dispatch.service.exception;

import lombok.Getter;

@Getter
public class DispatchException extends RuntimeException {

	private final String msg;

	public DispatchException(String msg) {
		super(msg);
		this.msg = msg;
	}
}
