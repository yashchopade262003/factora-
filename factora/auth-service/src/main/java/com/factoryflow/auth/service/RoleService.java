package com.factoryflow.auth.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.factoryflow.auth.InterfaceService.IRoleService;
import com.factoryflow.auth.dao.RoleDAO;
import com.factoryflow.auth.dto.RoleDTO;
import com.factoryflow.auth.entity.Role;
import com.factoryflow.auth.repository.RoleRepository;

@Service
public class RoleService implements IRoleService {

	@Autowired
	private ModelMapper mapper;

	@Autowired
	private RoleDAO roleRepository;

	@Override
	public RoleDTO addRole(RoleDTO roleDTO) {

		Role role = mapper.map(roleDTO, Role.class);

		Role savedRole = roleRepository.save(role);

		return mapper.map(savedRole, RoleDTO.class);
	}

	@Override
	public RoleDTO getRoleById(Long roleId) {

		Role role = roleRepository.findById(roleId).orElseThrow(() -> new RuntimeException("Role Not Found"));

		return mapper.map(role, RoleDTO.class);
	}

	@Override
	public List<RoleDTO> getAllRoles() {

		return roleRepository.findAll().stream().map(role -> mapper.map(role, RoleDTO.class)).toList();
	}

}