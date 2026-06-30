package com.factoryflow.auth.InterfaceService;

import com.factoryflow.auth.dto.LoginResponse;

public interface IOTPService {

    String sendOTP(String phone);

    LoginResponse verifyOTP(String email, String otp);
}
