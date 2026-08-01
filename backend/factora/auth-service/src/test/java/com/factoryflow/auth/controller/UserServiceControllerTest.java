package com.factoryflow.auth.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.factoryflow.auth.InterfaceService.IUserService;
import com.factoryflow.auth.dto.UserDTO;

/**
 * Regression coverage for the missing /user/{id}, /user/update/{id}, and
 * /user/delete/{id} endpoints: they existed in IUserService/UserService but
 * were never wired up in UserServiceController, so the frontend's
 * getUserById/updateUser/deleteUser calls 404'd. This test fails again if
 * that wiring is ever removed.
 */
class UserServiceControllerTest {

    @Mock
    private IUserService iUserService;

    @InjectMocks
    private UserServiceController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getUserByIdDelegatesToTheServiceLayer() {
        UserDTO expected = new UserDTO();
        expected.setUserId(101L);
        expected.setUsername("vendor101");
        when(iUserService.getUserById(101L)).thenReturn(expected);

        UserDTO result = controller.getUserById(101L);

        assertEquals("vendor101", result.getUsername());
        verify(iUserService).getUserById(101L);
    }

    @Test
    void updateUserDelegatesToTheServiceLayer() {
        UserDTO update = new UserDTO();
        update.setUsername("renamed");
        UserDTO saved = new UserDTO();
        saved.setUserId(101L);
        saved.setUsername("renamed");
        when(iUserService.updateUser(eq(101L), any(UserDTO.class))).thenReturn(saved);

        UserDTO result = controller.updateUser(101L, update);

        assertEquals("renamed", result.getUsername());
        verify(iUserService).updateUser(101L, update);
    }

    @Test
    void deleteUserDelegatesToTheServiceLayerAndConfirms() {
        String result = controller.deleteUser(101L);

        verify(iUserService).deleteUser(101L);
        assertEquals("User deleted successfully with id: 101", result);
    }
}
