package org.inventry.service.exception;

import org.inventry.service.ResponceEntity.ResponseStructure;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle custom InventoryException
    @ExceptionHandler(InventoryException.class)
    public ResponseEntity<ResponseStructure<String>> handleInventoryException(InventoryException ex) {

        ResponseStructure<String> response = new ResponseStructure<>();
        response.setStatusCode(HttpStatus.BAD_REQUEST.value());
        response.setMessage(ex.getMessage());
        response.setData(null);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    // Handle VendorServiceException
    @ExceptionHandler(VendorServiceException.class)
    public ResponseEntity<ResponseStructure<String>> handleVendorException(VendorServiceException ex) {

        ResponseStructure<String> response = new ResponseStructure<>();
        response.setStatusCode(ex.getStatus().value());
        response.setMessage(ex.getMessage());
        response.setData(null);

        return new ResponseEntity<>(response, ex.getStatus());
    }

    // Handle all other exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseStructure<String>> handleException(Exception ex) {

        ResponseStructure<String> response = new ResponseStructure<>();
        response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.setMessage("Something went wrong");
        response.setData(null);

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}