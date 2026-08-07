package com.factoryflow.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Mirrors the response envelope every inventory-service endpoint returns
 * (org.inventry.service.ResponceEntity.ResponseStructure), so Feign can
 * deserialize it directly instead of auth-service having to parse a raw map.
 */
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {

	private int statusCode;
	private String message;
	private T data;

}
