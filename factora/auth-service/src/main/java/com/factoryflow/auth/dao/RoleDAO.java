package com.factoryflow.auth.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.factoryflow.auth.entity.Role;
import com.factoryflow.auth.repository.RoleRepository;

@Repository
public class RoleDAO {
	@Autowired
	RoleRepository repository;
	public Role save(Role role) {
	return 	repository.save(role);
		
	}
	
	public Optional<Role> findById(Long id) {
	return 	repository.findById(id);
	}
	
	public List<Role> findAll() {
	return	repository.findAll();
	}

}
