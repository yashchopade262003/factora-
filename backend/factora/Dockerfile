# syntax=docker/dockerfile:1
#
# Root Dockerfile for the Factora backend (multi-module Maven / Spring Boot 3.3, Java 17).
# Build context MUST be: backend/factora
#
# This single file can build ANY of the 6 shared-parent services by passing
# a build arg for which module to package:
#   docker build --build-arg SERVICE=auth-service --build-arg APP_PORT=8081 -t auth-service .
#
# On Railway: set Root Directory = backend/factora, Dockerfile Path = Dockerfile,
# then under each service's Settings > Build > Build Args, set:
#   SERVICE=auth-service        APP_PORT=8081
#   SERVICE=inventry-service    APP_PORT=8082
#   SERVICE=production-service  APP_PORT=8083
#   SERVICE=dispatch-service    APP_PORT=8084
#   SERVICE=buyer-service       APP_PORT=8085
#   SERVICE=api-gateway         APP_PORT=8080
#
# NOTE: eureka-server is NOT built from this file. It's on Java 21 with its
# own standalone parent POM, so it keeps its own Dockerfile at
# eureka-server/Dockerfile (Root Directory = backend/factora/eureka-server).
#
# If you'd rather keep one Dockerfile per service (simpler Railway UI, no
# build args to configure), use the Dockerfile already inside each service
# folder (auth-service/Dockerfile, api-gateway/Dockerfile, etc.) instead of
# this one — both build the same way, just via a different path.

ARG SERVICE=api-gateway
ARG APP_PORT=8080

# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-17 AS build
ARG SERVICE
WORKDIR /workspace

# Copy the whole multi-module project (parent POM + all services) so the
# Maven reactor resolves correctly no matter which module we target.
COPY . .

RUN mvn -q -B -pl ${SERVICE} -am clean package -DskipTests

# ---- Runtime stage ----
FROM eclipse-temurin:17-jre-alpine
ARG SERVICE
ARG APP_PORT
WORKDIR /app

COPY --from=build /workspace/${SERVICE}/target/*.jar app.jar

ENV APP_PORT=${APP_PORT}
EXPOSE ${APP_PORT}
ENTRYPOINT ["java", "-jar", "app.jar"]
