# EduTrack
Classroom &amp; student management portal.

## Overview

A Spring Boot backend project designed for institute management. It provides RESTful CRUD operations to manage course data including MongoDB-generated IDs, course names, and course fees. Postman is used for API testing.

## Features

* Create, read, update, and delete course entries
* MongoDB-backed data persistence
* REST API following standard HTTP methods
* Clean separation between Controller, Service, Repository, and Entity layers
* Health check endpoint for quick system diagnostics

## Architecture

The system follows a classic Spring Boot layered architecture:

* **Controller Layer** — Handles HTTP requests and maps them to service operations
* **Service Layer** — Business logic, validation, and orchestration
* **Repository Layer** — MongoDB data access using Spring Data
* **Entity Layer** — Defines the `BatchEntry` model for stored documents

Data flow:
Client/Postman → Controller → Service → Repository → MongoDB → Response

## Installation

1. Ensure Java and Maven are installed.
2. Install and run MongoDB locally or provide a remote connection.
3. Configure `application.properties` with your MongoDB URI.
4. In project root:

   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

## Usage

Test endpoints with Postman:

* **POST** `/addbatchentry`
* **GET** `/getbatchentries`
* **PUT** `/updatebatchentry/{id}`
* **DELETE** `/deletebatchentry/{id}`
* **GET** `/health` for service status

## Configuration

Set your MongoDB connection details in `application.properties`:

```
spring.data.mongodb.uri=mongodb://localhost:27017/yourdb
```

## Tech Stack

* Java
* Spring Boot
* MongoDB
* Maven
* Postman (for testing)

## API

Document endpoints, expected request bodies, and responses.

## Testing

Postman used for functional testing. Includes CRUD verification and simple health checks.

## Roadmap

* Add authentication
* Add frontend interface
* Add pagination and filtering
* Improve validation

## Author

Aditya Chavan
