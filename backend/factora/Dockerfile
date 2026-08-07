# syntax=docker/dockerfile:1

##############################
# Build Stage
##############################
FROM maven:3.9-eclipse-temurin-17 AS build

ARG SERVICE

WORKDIR /workspace

# Copy the complete multi-module project
COPY . .

# Build only the requested module and its dependencies
RUN mvn -B -pl ${SERVICE} -am clean package -DskipTests

##############################
# Runtime Stage
##############################
FROM eclipse-temurin:17-jre-alpine

# IMPORTANT: Redeclare build args
ARG SERVICE
ARG APP_PORT=8080

WORKDIR /app

# Copy generated jar
COPY --from=build /workspace/${SERVICE}/target/*.jar app.jar

ENV JAVA_OPTS="-Xms64m -Xmx256m"

EXPOSE ${APP_PORT}

ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]
