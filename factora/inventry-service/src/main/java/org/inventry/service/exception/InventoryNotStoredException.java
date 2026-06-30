package org.inventry.service.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class InventoryNotStoredException extends RuntimeException{

	String msg;
}
