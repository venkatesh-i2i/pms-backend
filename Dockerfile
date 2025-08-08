# syntax=docker/dockerfile:1

# ---------- Build stage ----------
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy only files needed to resolve dependencies first (better layer caching)
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw mvnw
RUN mvn -q -DskipTests dependency:go-offline

# Copy source and build
COPY src src
RUN mvn -q -DskipTests package

# ---------- Runtime stage ----------
FROM eclipse-temurin:17-jre AS runtime
WORKDIR /app

# Optional: pass extra JVM options via JAVA_OPTS
ENV JAVA_OPTS=""

# Copy the built jar
COPY --from=build /app/target/*.jar app.jar

# Render sets PORT env var; default 8080 locally
EXPOSE 8080

CMD ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar app.jar"]


