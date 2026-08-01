package com.factoryflow.auth.InterfaceService;

public interface IOTPService {

    String sendOTP(String phone);

 
    void verifyOTP(String email, String otp);
}
