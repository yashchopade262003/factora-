package com.factoryflow.auth.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Raised by the auth facade when a login attempt cannot proceed - either
 * the email doesn't match any user, or the password is wrong. Deliberately
 * uses the same message for both cases (never "no such user" vs "wrong
 * password" separately) to avoid leaking which emails are registered.
 */
@Getter
public class AuthException extends RuntimeException {

	private final HttpStatus status;

	public AuthException(String message) {
		super(message);
		this.status = HttpStatus.UNAUTHORIZED;
	}
}
