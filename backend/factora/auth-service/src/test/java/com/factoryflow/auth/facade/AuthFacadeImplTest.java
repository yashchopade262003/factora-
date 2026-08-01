package com.factoryflow.auth.facade;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;

import com.factoryflow.auth.dao.UserDAO;
import com.factoryflow.auth.dto.AuthRequest;
import com.factoryflow.auth.dto.LoginResponse;
import com.factoryflow.auth.entity.Role;
import com.factoryflow.auth.entity.User;
import com.factoryflow.auth.entity.Vendor;
import com.factoryflow.auth.exception.AuthException;
import com.factoryflow.auth.jwtUtils.JwtUtil;
import com.factoryflow.auth.service.OTPService;

/**
 * Regression coverage for the single-method AuthFacadeImpl.login():
 *  - unknown email / wrong password fail cleanly with AuthException
 *    (instead of a raw NullPointerException / unhandled AuthenticationException)
 *  - a blank otp sends the OTP and returns status=OTP_SENT with no token
 *  - a filled-in otp verifies it and returns status=LOGIN_SUCCESS with a token
 *  - an invalid otp still fails cleanly and never reaches JwtUtil
 */
class AuthFacadeImplTest {

    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private OTPService otpService;
    @Mock
    private UserDAO userDAO;
    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthFacadeImpl facade;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    private AuthRequest request(String otp) {
        AuthRequest req = new AuthRequest();
        req.setEmail("vendor@example.com");
        req.setPassword("secret123");
        req.setOtp(otp);
        return req;
    }

    private User existingUser() {
        User user = new User();
        user.setUserId(101L);
        user.setUsername("vendor101");
        user.setEmail("vendor@example.com");
        Role role = new Role();
        role.setRoleName("BUYER");
        user.setRole(role);
        Vendor vendor = new Vendor();
        vendor.setVendorId(101L);
        user.setVendor(vendor);
        return user;
    }

    @Test
    void unknownEmailFailsCleanly_insteadOfNullPointerException() {
        when(userDAO.userLogin("vendor@example.com")).thenReturn(null);

        AuthException ex = assertThrows(AuthException.class, () -> facade.login(request(null)));
        assertEquals("Invalid email or password", ex.getMessage());
        verifyNoInteractions(authenticationManager, otpService, jwtUtil);
    }

    @Test
    void wrongPasswordFailsCleanly_insteadOfARaw500() {
        when(userDAO.userLogin("vendor@example.com")).thenReturn(existingUser());
        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("bad creds"));

        AuthException ex = assertThrows(AuthException.class, () -> facade.login(request(null)));
        assertEquals("Invalid email or password", ex.getMessage());
        verifyNoInteractions(otpService, jwtUtil);
    }

    @Test
    void blankOtp_sendsOtpAndReturnsOtpSentWithNoToken() {
        when(userDAO.userLogin("vendor@example.com")).thenReturn(existingUser());
        when(authenticationManager.authenticate(any())).thenReturn(mock(Authentication.class));

        LoginResponse response = facade.login(request(null));

        verify(otpService).sendOTP("vendor@example.com");
        verify(otpService, never()).verifyOTP(any(), any());
        verifyNoInteractions(jwtUtil);
        assertEquals("OTP_SENT", response.getStatus());
        assertNull(response.getToken());
    }

    @Test
    void emptyStringOtp_isTreatedTheSameAsBlank() {
        when(userDAO.userLogin("vendor@example.com")).thenReturn(existingUser());
        when(authenticationManager.authenticate(any())).thenReturn(mock(Authentication.class));

        LoginResponse response = facade.login(request("   "));

        assertEquals("OTP_SENT", response.getStatus());
        verify(otpService, never()).verifyOTP(any(), any());
    }

    @Test
    void filledOtp_verifiesAndReturnsLoginSuccessWithTokenAndUserDetails() {
        when(userDAO.userLogin("vendor@example.com")).thenReturn(existingUser());
        when(authenticationManager.authenticate(any())).thenReturn(mock(Authentication.class));
        when(jwtUtil.generateToken("vendor@example.com")).thenReturn("signed.jwt.token");

        LoginResponse response = facade.login(request("482913"));

        verify(otpService).verifyOTP("vendor@example.com", "482913");
        assertEquals("LOGIN_SUCCESS", response.getStatus());
        assertEquals("signed.jwt.token", response.getToken());
        assertEquals(101L, response.getUserId());
        assertEquals("vendor101", response.getUsername());
        assertEquals("BUYER", response.getRole());
        assertEquals(101L, response.getVendorId());
    }

    @Test
    void invalidOtp_neverReachesJwtGeneration() {
        when(userDAO.userLogin("vendor@example.com")).thenReturn(existingUser());
        when(authenticationManager.authenticate(any())).thenReturn(mock(Authentication.class));
        doThrow(new AuthException("Invalid OTP")).when(otpService).verifyOTP(eq("vendor@example.com"), eq("000000"));

        assertThrows(AuthException.class, () -> facade.login(request("000000")));
        verifyNoInteractions(jwtUtil);
    }

    @Test
    void userWithNoVendor_stillLogsInSuccessfully() {
        User adminUser = new User();
        adminUser.setUserId(101L);
        adminUser.setUsername("admin101");
        adminUser.setEmail("vendor@example.com");
        Role role = new Role();
        role.setRoleName("ADMIN");
        adminUser.setRole(role);
        adminUser.setVendor(null); // admins aren't tied to a single factory

        when(userDAO.userLogin("vendor@example.com")).thenReturn(adminUser);
        when(authenticationManager.authenticate(any())).thenReturn(mock(Authentication.class));
        when(jwtUtil.generateToken("vendor@example.com")).thenReturn("signed.jwt.token");

        LoginResponse response = facade.login(request("482913"));

        assertEquals("LOGIN_SUCCESS", response.getStatus());
        assertNull(response.getVendorId());
    }
}
