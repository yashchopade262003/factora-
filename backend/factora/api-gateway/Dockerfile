# syntax=docker/dockerfile:1

FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /workspace

COPY . .

ARG SERVICE

RUN mvn -B -pl ${SERVICE} -am clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /workspace/${SERVICE}/target/*.jar app.jar

ENV JAVA_OPTS="-Xms64m -Xmx128m"

EXPOSE 8080

ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]