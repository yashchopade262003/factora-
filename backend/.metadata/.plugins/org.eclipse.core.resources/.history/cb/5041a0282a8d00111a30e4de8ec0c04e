package com.factoryflow.auth.jwtUtils;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private static final String SECRET =
            "factoryflowjwtsecretkeyfactoryflowjwtsecretkey2026";

    private final SecretKey key =
            Keys.hmacShaKeyFor(SECRET.getBytes());

    public String generateToken(String email) {

        return Jwts.builder()

                .setSubject(email)

                .setIssuedAt(new Date())

                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + 1000 * 60 * 60))

                .signWith(key, SignatureAlgorithm.HS256)

                .compact();

    }

    public String extractUsername(String token) {

        return extractClaims(token).getSubject();

    }

    public Claims extractClaims(String token) {

        return Jwts.parserBuilder()

                .setSigningKey(key)

                .build()

                .parseClaimsJws(token)

                .getBody();

    }

    public boolean isTokenExpired(String token) {

        return extractClaims(token)

                .getExpiration()

                .before(new Date());

    }

    public boolean validateToken(
            String token,
            String email) {

        return extractUsername(token).equals(email)
                && !isTokenExpired(token);

    }

}