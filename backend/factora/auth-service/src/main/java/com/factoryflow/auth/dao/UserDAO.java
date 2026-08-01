package com.factoryflow.auth.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.factoryflow.auth.entity.User;
import com.factoryflow.auth.repository.UserRepository;

@Repository
public class UserDAO {
	@Autowired
	private UserRepository repository;

	public User registerUser(User entity) {
		User save = repository.save(entity);
		return save;
	}

	public User userLogin(String email) {
		User byEmail = repository.findByEmail(email);
		System.out.println(byEmail);

		return repository.findByEmail(email);
	}

	public List<User> getAllUsers() {
		return repository.findAll();
	}

	public Optional<User> findById(Long id) {
		return repository.findById(id);
	}

	public void deleteUser(Long id) {
		repository.deleteById(id);
	}

	
	public User findByPhone(String Phone) {
		return repository.findByPhone(Phone);
	}
	
public 	User fincdByEmail(String email) {
	return 	repository.findByEmail(email);
	}
}
