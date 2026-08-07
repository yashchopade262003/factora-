package com.factoryflow.auth.facade;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.factoryflow.auth.dao.UserDAO;
import com.factoryflow.auth.dto.AuthRequest;
import com.factoryflow.auth.dto.AuthResponse;
import com.factoryflow.auth.dto.LoginResponse;
import com.factoryflow.auth.dto.OTPRequest;
import com.factoryflow.auth.dto.OTPRequrstVerify;
import com.factoryflow.auth.entity.User;
import com.factoryflow.auth.service.OTPService;

@Component
public class AuthFacadeImpl implements IAuthFacade {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private OTPService otpService;
    @Autowired
    UserDAO userDAO;
    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse login(AuthRequest request) {

        User user = userDAO.userLogin(request.getEmail());

        System.out.println("Entered Email      : " + request.getEmail());
        System.out.println("Entered Password   : " + request.getPassword());
        System.out.println("Password From DB   : " + user.getPassword());

        boolean matched = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword());

        System.out.println("Password Matched   : " + matched);

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        return new AuthResponse("LOGIN_SUCCESS");
    }
    @Override
    public String sendOTP(OTPRequest request) {

        return otpService.sendOTP(request.getEmail());

    }

    @Override
    public LoginResponse verifyOTP(OTPRequrstVerify request) {

        return otpService.verifyOTP(
                request.getEmail(),
                request.getOtp());

    }

}