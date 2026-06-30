package com.factoryflow.auth.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.factoryflow.auth.InterfaceService.IUserService;
import com.factoryflow.auth.dto.UserDTO;


@RestController
@RequestMapping("/user")
public class UserServiceController {

    @Autowired
    private IUserService iUserService;

    @PostMapping("/register")
    public UserDTO registerUser(
            @RequestBody UserDTO dto) {

        return iUserService.registerUser(dto);
    }

    @GetMapping("/current-user")
    public String getLogedInUser(
            Principal principal) {

        if (principal == null) {
            return "No User Logged In";
        }

        return principal.getName();
    }
}