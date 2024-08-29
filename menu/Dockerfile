# Stage 1: Build the application with Maven
FROM maven:3.8.8-eclipse-temurin-17 AS build

# Set the working directory
WORKDIR /app

# Copy the pom.xml file and download dependencies
COPY menu/pom.xml /app/
RUN mvn dependency:go-offline

# Copy the rest of the application source code
COPY menu/src /app/src

# Package the application into a JAR file
RUN mvn clean package -DskipTests

# Stage 2: Run the application with a slim JDK
FROM eclipse-temurin:17-jdk-jammy

# Set the working directory
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/menu-0.0.1-SNAPSHOT.jar /app/menu-0.0.1-SNAPSHOT.jar

# Expose the port the application runs on
EXPOSE 8080

# Set the entry point to run the application
ENTRYPOINT ["java", "-jar", "/app/menu-0.0.1-SNAPSHOT.jar"]