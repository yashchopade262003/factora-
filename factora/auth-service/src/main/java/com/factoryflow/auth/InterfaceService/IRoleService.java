package com.factoryflow.auth.InterfaceService;

import java.util.List;

import com.factoryflow.auth.dto.RoleDTO;

public interface IRoleService {
	RoleDTO addRole(RoleDTO roleDTO);

	RoleDTO getRoleById(Long roleId);

	List<RoleDTO> getAllRoles();
}
