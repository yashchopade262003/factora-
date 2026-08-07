package com.factoryflow.auth.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.factoryflow.auth.JWTConfig.JWTAuthenticationEntryPoint;
import com.factoryflow.auth.jwtUtils.JwtAuthenticationFilter;

@Configuration
public class SecurityConfigure {

	@Autowired
	private JwtAuthenticationFilter jwtFilter;

	@Autowired
	private JWTAuthenticationEntryPoint authenticationEntryPoint;

	@Autowired
	private AuthenticationProvider authenticationProvider;

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

		http.csrf(csrf -> csrf.disable())

				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

				.authorizeHttpRequests(auth -> auth
						.requestMatchers(
						        "/auth/**",
						        "/user/**",
						        "/vendor/**",
						        "/role/**",
						        "/v3/api-docs/**",
						        "/swagger-ui/**",
						        "/swagger-ui.html"
						)
						.permitAll()
					    .anyRequest().authenticated()
					)

				.authenticationProvider(authenticationProvider)

				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

				.exceptionHandling(ex -> ex.authenticationEntryPoint(authenticationEntryPoint));

		return http.build();
	}
}