# syntax=docker/dockerfile:1

FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /workspace

COPY . .

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=build /workspace/target/*.jar app.jar

ENV JAVA_OPTS="-Xms64m -Xmx128m"

EXPOSE 8761

ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]