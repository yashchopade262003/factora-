package com.factoryflow.auth.dto;


import lombok.Data;

@Data
public class AuthRequest {

    private String email;

    private String password;

    // Left blank/null for the first call (credentials only, triggers the
    // OTP email); populated for the second call to complete login.
    private String otp;

}