package com.factoryflow.auth.dto;

import lombok.Data;

@Data
public class RoleDTO {
	private Long roleId;
	private String roleName;
	private String description;
}
