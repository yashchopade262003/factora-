package com.factoryflow.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.context.request.RequestContextListener;

@SpringBootApplication
@EnableFeignClients
@EnableJpaRepositories(basePackages  = "com.factoryflow.auth.repository")
@EntityScan(basePackages = "com.factoryflow.auth.entity")
public class AuthServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(AuthServiceApplication.class, args);
		
		
		
	}
	
	
	@Bean
	public RequestContextListener requestContextListener() {
	    return new RequestContextListener();
	}
	
}
