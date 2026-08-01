package com.factoryflow.auth.InterfaceService;

import java.util.List;

import com.factoryflow.auth.dto.UserDTO;

public interface IUserService {
	UserDTO registerUser(UserDTO userDTO);

	UserDTO getUserById(Long userId);

	List<UserDTO> getAllUsers();

	UserDTO updateUser(Long userId, UserDTO userDTO);

	void deleteUser(Long userId);
}
