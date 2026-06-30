package com.factoryflow.auth.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.factoryflow.auth.InterfaceService.IOTPService;
import com.factoryflow.auth.dao.UserDAO;
import com.factoryflow.auth.dto.LoginResponse;
import com.factoryflow.auth.entity.User;
import com.factoryflow.auth.jwtUtils.JwtUtil;
import com.factoryflow.auth.utils.OTPGenrator;

@Service
public class OTPService implements IOTPService {

	private final Map<String, String> otpStore = new HashMap<>();

	@Autowired
	private JavaMailSender mailSender;

	@Autowired
	private UserDAO userDAO;

	@Autowired
	private JwtUtil jwtUtil;

	@Override
	public String sendOTP(String email) {

		User user = userDAO.fincdByEmail(email);

		if (user == null) {
			throw new RuntimeException("User Not Found");
		}

		String otp = OTPGenrator.generateOTP();

		otpStore.put(email, otp);

		SimpleMailMessage message = new SimpleMailMessage();

		message.setTo(email);

		message.setSubject("FactoryFlow Login OTP");

		message.setText("Your OTP is : " + otp);

		mailSender.send(message);

		return "OTP Sent Successfully";
	}

	@Override
	public LoginResponse verifyOTP(String email, String otp) {

		String storedOtp = otpStore.get(email);

		if (storedOtp == null) {
			throw new RuntimeException("OTP Expired");
		}

		if (!storedOtp.equals(otp)) {
			throw new RuntimeException("Invalid OTP");
		}

		otpStore.remove(email);

		User user = userDAO.fincdByEmail(email);

		if (user == null) {
			throw new RuntimeException("User Not Found");
		}

		String token = jwtUtil.generateToken(user.getEmail());

		return new LoginResponse(

				token,

				user.getUserId(),

				user.getUsername(),

				user.getEmail(),

				user.getRole().getRoleName(),

				user.getVendor().getVendorId()

		);

	}

}