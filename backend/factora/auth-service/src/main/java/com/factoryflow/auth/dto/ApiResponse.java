package com.factoryflow.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {

	private int statusCode;
	private String message;
	private T data;

}
