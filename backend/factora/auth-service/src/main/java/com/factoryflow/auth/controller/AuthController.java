package com.factoryflow.auth.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.factoryflow.auth.dto.AuthRequest;
import com.factoryflow.auth.dto.AuthResponse;
import com.factoryflow.auth.dto.LoginResponse;
import com.factoryflow.auth.dto.OTPRequest;
import com.factoryflow.auth.dto.OTPRequrstVerify;
import com.factoryflow.auth.facade.IAuthFacade;

@RestController
@RequestMapping("/auth")
public class AuthController {

	@Autowired
	private IAuthFacade authFacade;

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {

		return ResponseEntity.ok(authFacade.login(request));

	}

	@PostMapping("/send-otp")
	public ResponseEntity<String> sendOTP(@RequestBody OTPRequest request) {

		return ResponseEntity.ok(authFacade.sendOTP(request));

	}

	@PostMapping("/verify-otp")
	public ResponseEntity<LoginResponse> verifyOTP(@RequestBody OTPRequrstVerify request) {

		return ResponseEntity.ok(authFacade.verifyOTP(request));

	}

}