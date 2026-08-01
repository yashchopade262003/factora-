package org.production.service.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.production.service.ResponceEntity.ResponseStructure;
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

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(ProductionException.class)
	public ResponseEntity<ResponseStructure<String>> handleProductionException(ProductionException ex) {
		return buildResponse(HttpStatus.BAD_REQUEST, ex.getMsg());
	}

	@ExceptionHandler(VendorServiceException.class)
	public ResponseEntity<ResponseStructure<String>> handleVendorServiceException(VendorServiceException ex) {
		return buildResponse(ex.getStatus(), ex.getMessage());
	}

	@ExceptionHandler(BuyerOrderServiceException.class)
	public ResponseEntity<ResponseStructure<String>> handleBuyerOrderServiceException(BuyerOrderServiceException ex) {
		return buildResponse(ex.getStatus(), ex.getMessage());
	}

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

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ResponseStructure<String>> handleConstraintViolation(ConstraintViolationException ex) {
		return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
	}

	// Most common cause in practice: an optional numeric/date field was sent
	// as an empty string "" instead of being omitted/null. Jackson can't
	// coerce "" into a Long/LocalDate and throws here; give a specific,
	// actionable message instead of a bare "Malformed request body".
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ResponseStructure<String>> handleUnreadableBody(HttpMessageNotReadableException ex) {
		Throwable cause = ex.getMostSpecificCause();
		String detail = cause != null ? cause.getMessage() : ex.getMessage();
		String message = "Malformed request body.";
		if (detail != null && (detail.contains("Long") || detail.contains("LocalDate") || detail.contains("Double"))) {
			message = "Malformed request body: one or more numeric/date fields were sent as an empty value "
					+ "instead of being left blank/omitted. Please leave optional numeric or date fields "
					+ "empty rather than typing spaces, and try again.";
		}
		return buildResponse(HttpStatus.BAD_REQUEST, message);
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<ResponseStructure<String>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
		String message = String.format("Invalid value '%s' for parameter '%s'", ex.getValue(), ex.getName());
		return buildResponse(HttpStatus.BAD_REQUEST, message);
	}

	@ExceptionHandler(MissingServletRequestParameterException.class)
	public ResponseEntity<ResponseStructure<String>> handleMissingParam(MissingServletRequestParameterException ex) {
		return buildResponse(HttpStatus.BAD_REQUEST, "Missing required parameter: " + ex.getParameterName());
	}

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
