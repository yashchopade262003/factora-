package com.factoryflow.auth.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.factoryflow.auth.entity.Vendor;
import com.factoryflow.auth.repository.VendorRepository;

@Repository
public class VendorDAO {
	@Autowired
	VendorRepository repository;

 public 	Vendor save(Vendor vendor) {
	return 	repository.save(vendor);
	}
	
 
 public Optional<Vendor> findById(Long id) {
	return repository.findById(id);
 }
 
 
 public List<Vendor> findAll() {
	return repository.findAll();
 }
}
