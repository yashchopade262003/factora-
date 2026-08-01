package com.factoryflow.auth.facade;

import com.factoryflow.auth.dto.AuthRequest;
import com.factoryflow.auth.dto.LoginResponse;

public interface IAuthFacade {

	
	LoginResponse login(AuthRequest request);

}
