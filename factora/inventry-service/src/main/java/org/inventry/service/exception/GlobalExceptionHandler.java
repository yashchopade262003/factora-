package org.inventry.service.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.inventry.service.ResponceEntity.ResponseStructure;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import jakarta.validation.ConstraintViolationException;

/**
 * Every controller in this service returns {@link ResponseStructure}, so
 * error responses follow the exact same envelope instead of falling back to
 * Spring Boot's default `/error` payload. This is the piece that was
 * missing before: custom exceptions such as {@link InventoryException} were
 * being thrown but nothing ever caught them, so callers just saw a bare 500.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

	// ---------------------------------------------------------------
	// Domain / business-rule violations -> 400 Bad Request
	// ---------------------------------------------------------------
	@ExceptionHandler(InventoryException.class)
	public ResponseEntity<ResponseStructure<String>> handleInventoryException(InventoryException ex) {
		return buildResponse(HttpStatus.BAD_REQUEST, ex.getMsg());
	}

	// ---------------------------------------------------------------
	// Persistence failures -> 500 Internal Server Error
	// ---------------------------------------------------------------
	@ExceptionHandler(InventoryNotStoredException.class)
	public ResponseEntity<ResponseStructure<String>> handleInventoryNotStored(InventoryNotStoredException ex) {
		return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMsg());
	}

	// ---------------------------------------------------------------
	// Vendor (downstream service) lookup failures -> status carried on the exception
	// ---------------------------------------------------------------
	@ExceptionHandler(VendorServiceException.class)
	public ResponseEntity<ResponseStructure<String>> handleVendorServiceException(VendorServiceException ex) {
		return buildResponse(ex.getStatus(), ex.getMessage());
	}

	// ---------------------------------------------------------------
	// Bean Validation on @RequestBody DTOs -> 400 with field-level detail
	// ---------------------------------------------------------------
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ResponseStructure<Map<String, String>>> handleValidation(MethodArgumentNotValidException ex) {

		Map<String, String> fieldErrors = new LinkedHashMap<>();
		for (FieldError error : ex.getBindingResult().getFieldErrors()) {
			fieldErrors.put(error.getField(), error.getDefaultMessage());
		}

		ResponseStructure<Map<String, String>> response = new ResponseStructure<>();
		response.setStatusCode(HttpStatus.BAD_REQUEST.value());
		response.setMessage("Validation Failed");
		response.setData(fieldErrors);

		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}

	// ---------------------------------------------------------------
	// Bean Validation on @RequestParam / @PathVariable (e.g. @Positive quantity) -> 400
	// ---------------------------------------------------------------
	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ResponseStructure<String>> handleConstraintViolation(ConstraintViolationException ex) {
		return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
	}

	// ---------------------------------------------------------------
	// Malformed JSON body -> 400
	// ---------------------------------------------------------------
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ResponseStructure<String>> handleUnreadableBody(HttpMessageNotReadableException ex) {
		return buildResponse(HttpStatus.BAD_REQUEST, "Malformed request body");
	}

	// ---------------------------------------------------------------
	// Wrong path-variable / request-param type (e.g. text where a number is expected) -> 400
	// ---------------------------------------------------------------
	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<ResponseStructure<String>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
		String message = String.format("Invalid value '%s' for parameter '%s'", ex.getValue(), ex.getName());
		return buildResponse(HttpStatus.BAD_REQUEST, message);
	}

	@ExceptionHandler(MissingServletRequestParameterException.class)
	public ResponseEntity<ResponseStructure<String>> handleMissingParam(MissingServletRequestParameterException ex) {
		return buildResponse(HttpStatus.BAD_REQUEST, "Missing required parameter: " + ex.getParameterName());
	}

	// ---------------------------------------------------------------
	// Catch-all safety net -> 500, never leak internal stack traces
	// ---------------------------------------------------------------
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ResponseStructure<String>> handleGeneric(Exception ex) {
		return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR,
				"Unexpected error occurred at " + LocalDateTime.now() + ": " + ex.getMessage());
	}

	private ResponseEntity<ResponseStructure<String>> buildResponse(HttpStatus status, String message) {
		ResponseStructure<String> response = new ResponseStructure<>();
		response.setStatusCode(status.value());
		response.setMessage(message);
		response.setData(null);
		return new ResponseEntity<>(response, status);
	}
}
