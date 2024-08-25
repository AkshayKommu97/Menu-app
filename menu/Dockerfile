# Use an appropriate base image
FROM openjdk:17-jdk-slim

# Create a directory for the application
WORKDIR /app

# Copy the JAR file from the target directory to /app in the image
COPY menu/target/menu-0.0.1-SNAPSHOT.jar /app/menu-0.0.1-SNAPSHOT.jar

# Expose the port the application listens on (e.g., 8080)
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "/app/menu-0.0.1-SNAPSHOT.jar"]
