package org.inventry.service.ResponceEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseStructure<T> {
	
	int statusCode;
	String message;
	
	T data;

}
