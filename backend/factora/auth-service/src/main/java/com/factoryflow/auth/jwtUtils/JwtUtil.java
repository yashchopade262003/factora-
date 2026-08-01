package com.factoryflow.auth.jwtUtils;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	@Value("${jwt.secret:factoryflowjwtsecretkeyfactoryflowjwtsecretkey2026}")
	private String secret;

	private SecretKey key;

	private SecretKey getKey() {

		if (key == null) {

			key = Keys.hmacShaKeyFor(secret.getBytes());

		}

		return key;

	}

	public String generateToken(String email) {

		return Jwts.builder()

				.setSubject(email)

				.setIssuedAt(new Date())

				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))

				.signWith(getKey(), SignatureAlgorithm.HS256)

				.compact();

	}

	public String extractUsername(String token) {

		return extractClaims(token).getSubject();

	}

	public Claims extractClaims(String token) {

		return Jwts.parserBuilder()

				.setSigningKey(getKey())

				.build()

				.parseClaimsJws(token)

				.getBody();

	}

	public boolean isTokenExpired(String token) {

		return extractClaims(token)

				.getExpiration()

				.before(new Date());

	}

	public boolean validateToken(String token, String email) {

		return extractUsername(token).equals(email) && !isTokenExpired(token);

	}

}
