FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY pom.xml mvnw* ./
COPY .mvn .mvn
COPY src ./src
RUN ./mvnw -B -DskipTests package || mvn -B -DskipTests package
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/target/backend-0.1.0.jar"]
