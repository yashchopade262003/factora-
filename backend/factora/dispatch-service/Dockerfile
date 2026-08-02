# syntax=docker/dockerfile:1
# Build context for this Dockerfile must be: backend/factora  (the multi-module root)

# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /workspace

# Copy the parent POM and every module's POM first (needed for the reactor
# to resolve, and lets Docker cache the dependency-download layer)
COPY pom.xml .
COPY auth-service/pom.xml auth-service/pom.xml
COPY eureka-server/pom.xml eureka-server/pom.xml
COPY inventry-service/pom.xml inventry-service/pom.xml
COPY production-service/pom.xml production-service/pom.xml
COPY dispatch-service/pom.xml dispatch-service/pom.xml
COPY buyer-service/pom.xml buyer-service/pom.xml
COPY api-gateway/pom.xml api-gateway/pom.xml

RUN mvn -q -B -pl dispatch-service -am dependency:go-offline || true

# Now copy the actual source for the service being built
COPY dispatch-service/src dispatch-service/src

# Build only this module (and anything it depends on in the reactor)
RUN mvn -q -B -pl dispatch-service -am clean package -DskipTests

# ---- Runtime stage ----
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /workspace/dispatch-service/target/*.jar app.jar

EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]
