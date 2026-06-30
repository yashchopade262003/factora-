package com.factoryflow.auth.service;

import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.factoryflow.auth.InterfaceService.IUserService;
import com.factoryflow.auth.dao.RoleDAO;
import com.factoryflow.auth.dao.UserDAO;
import com.factoryflow.auth.dao.VendorDAO;
import com.factoryflow.auth.dto.UserDTO;
import com.factoryflow.auth.entity.Role;
import com.factoryflow.auth.entity.User;
import com.factoryflow.auth.entity.Vendor;

@Service
public class UserService implements IUserService {

	@Autowired
	private ModelMapper mapper;

	@Autowired
	private UserDAO userDAO;
@Autowired
	VendorDAO vendorDAO;
	@Autowired
	private PasswordEncoder passwordEncoder;
@Autowired
	RoleDAO roleDAO;
	@Override
	public UserDTO registerUser(UserDTO userDTO) {

	    User user = new User();

	    user.setUsername(userDTO.getUsername());
	    user.setEmail(userDTO.getEmail());
	    user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
	    user.setPhone(userDTO.getPhone());
	    user.setStatus(userDTO.getStatus());

	    Vendor vendor = vendorDAO.findById(userDTO.getVendorId())
	            .orElseThrow(() -> new RuntimeException("Vendor Not Found"));

	    Role role = roleDAO.findById(userDTO.getRoleId())
	            .orElseThrow(() -> new RuntimeException("Role Not Found"));

	    user.setVendor(vendor);
	    user.setRole(role);

	    User savedUser = userDAO.registerUser(user);

	    return mapper.map(savedUser, UserDTO.class);
	}
	@Override
	public UserDTO getUserById(Long userId) {

	Optional<User> byId = userDAO.findById(userId);
	User user = byId.get();

		return mapper.map(user, UserDTO.class);
	}

	@Override
	public List<UserDTO> getAllUsers() {

		return userDAO.getAllUsers().stream().map(user -> mapper.map(user, UserDTO.class)).toList();
	}

	@Override
	public UserDTO updateUser(Long userId, UserDTO userDTO) {

		 Optional<User> byId = userDAO.findById(userId);
		 User existingUser = byId.get();

		existingUser.setUsername(userDTO.getUsername());

		existingUser.setEmail(userDTO.getEmail());

		existingUser.setPhone(userDTO.getPhone());

		existingUser.setStatus(userDTO.getStatus());

		User updatedUser = userDAO.registerUser(existingUser);

		return mapper.map(updatedUser, UserDTO.class);
	}

	@Override
	public void deleteUser(Long userId) {

		userDAO.deleteUser(userId);
	}
}