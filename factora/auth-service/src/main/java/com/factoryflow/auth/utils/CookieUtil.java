package com.factoryflow.auth.utils;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookieUtil {

    public ResponseCookie createCookie(String jwt){

        return ResponseCookie.from("JWT", jwt)

                .httpOnly(true)

                .secure(false)

                .path("/")

                .maxAge(60*60)

                .sameSite("Lax")

                .build();

    }

}