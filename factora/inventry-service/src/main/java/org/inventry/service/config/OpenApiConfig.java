package org.inventry.service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;

/**
 * springdoc-openapi-ui was already on the classpath but unconfigured, so it
 * only produced generic defaults. This gives the generated docs (available
 * at /swagger-ui.html and /v3/api-docs) a real title/description, which
 * matters once this service sits behind an API gateway alongside the other
 * FactoryFlow microservices.
 */
@Configuration
public class OpenApiConfig {

	@Bean
	public OpenAPI inventoryServiceOpenApi() {
		return new OpenAPI()
				.info(new Info()
						.title("Inventory Service API")
						.description("Multi-vendor, multi-warehouse inventory management for the FactoryFlow platform")
						.version("v1.0")
						.contact(new Contact().name("FactoryFlow")));
	}
}
