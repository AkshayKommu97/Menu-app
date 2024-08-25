# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the Spring Boot JAR file into the container
COPY target/menu-0.0.1-SNAPSHOT.jar /app/menu-0.0.1-SNAPSHOT.jar

# Expose the port on which the application will run
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "/app/menu-0.0.1-SNAPSHOT.jar"]
