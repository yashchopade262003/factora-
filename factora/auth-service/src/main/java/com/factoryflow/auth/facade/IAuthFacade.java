package com.factoryflow.auth.facade;

import com.factoryflow.auth.dto.AuthRequest;
import com.factoryflow.auth.dto.AuthResponse;
import com.factoryflow.auth.dto.LoginResponse;
import com.factoryflow.auth.dto.OTPRequest;
import com.factoryflow.auth.dto.OTPRequrstVerify;

public interface IAuthFacade {
	   AuthResponse login(AuthRequest request);

	    String sendOTP(OTPRequest request);

	    LoginResponse verifyOTP(OTPRequrstVerify request);
	    
	    
}
