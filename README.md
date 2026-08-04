FACTORA — Smart Factory Management System

FACTORA is a full-stack factory management application designed to bring day-to-day manufacturing operations into one platform. It helps users manage vendors, employees, buyers, inventory, production orders, customer orders, and dispatch activities through a responsive React interface and a Spring Boot microservice backend.

The project was developed as a final-year academic project and demonstrates practical use of microservices, service discovery, API routing, JWT-based security, database separation, reusable frontend components, and automated testing.

Main Features

User registration and login

JWT-based authentication and protected routes

Role and user management

Vendor management

Buyer and buyer-order management

Raw material and finished-goods inventory management

Stock-in, stock-out, and stock-adjustment operations

Low-stock, out-of-stock, expired, and expiring-stock tracking

Production-order creation and status management

Dispatch creation and delivery-status tracking

Module-specific dashboards

Search, filtering, pagination, and reusable data tables

Centralized API error handling

Automatic logout when a session expires

System Architecture

FACTORA follows a microservice architecture. The React frontend sends requests to the API Gateway. The gateway discovers and routes requests to the required backend service through Eureka.

flowchart LR
    U[User] --> F[React + Vite Frontend]
    F --> G[Spring Cloud API Gateway :8080]
    G --> A[Auth Service :8081]
    G --> I[Inventory Service :8082]
    G --> P[Production Service :8083]
    G --> D[Dispatch Service :8084]
    G --> B[Buyer Service :8085]

    A --> EA[(Auth PostgreSQL DB)]
    I --> EI[(Inventory PostgreSQL DB)]
    P --> EP[(Production PostgreSQL DB)]
    D --> ED[(Dispatch PostgreSQL DB)]
    B --> EB[(Buyer PostgreSQL DB)]

    A -. registers .-> E[Eureka Server :8761]
    I -. registers .-> E
    P -. registers .-> E
    D -. registers .-> E
    B -. registers .-> E
    G -. discovers services .-> E

Application Workflow

flowchart TD
    L[User Login] --> J[JWT Token Generated]
    J --> DB[Dashboard]
    DB --> V[Manage Vendors and Buyers]
    V --> IN[Manage Inventory]
    IN --> O[Create Buyer Order]
    O --> PR[Create Production Order]
    PR --> DS[Create Dispatch]
    DS --> DL[Update Delivery Status]

Technology Stack

Frontend

React 19

Vite 8

React Router

Axios

Font Awesome

Vitest

React Testing Library

ESLint

Backend

Java 17 for the main backend services

Java 21 for the Eureka Server container

Spring Boot 3.3

Spring Cloud

Spring Cloud Gateway

Netflix Eureka

Spring Security

JSON Web Token authentication

Spring Data JPA

OpenFeign

ModelMapper

Lombok

Maven

Database and Deployment

PostgreSQL

Docker

Multi-stage Docker builds

Microservices

Service

Default port

Purpose

API Gateway

8080

Single entry point and request routing

Auth Service

8081

Login, registration, users, roles, vendors, and JWT security

Inventory Service

8082

Inventory, stock operations, expiry tracking, and dashboard data

Production Service

8083

Production-order lifecycle management

Dispatch Service

8084

Dispatch records and delivery-status management

Buyer Service

8085

Buyers and buyer orders

Eureka Server

8761

Service registration and discovery

The backend folder is named inventry-service in the repository, while the registered application name is INVENTORY-SERVICE.

Repository Structure

factora-
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── config/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    └── factora/
        ├── api-gateway/
        ├── auth-service/
        ├── buyer-service/
        ├── dispatch-service/
        ├── eureka-server/
        ├── inventry-service/
        ├── production-service/
        └── pom.xml

Prerequisites

Install the following software before running the project:

Git

Node.js and npm

Java Development Kit 17

Java Development Kit 21 for the Eureka Server, or run Eureka with Docker

Maven 3.9 or later

PostgreSQL

Database Setup

Create the following PostgreSQL databases:

CREATE DATABASE factora_auth;
CREATE DATABASE factora_inventory;
CREATE DATABASE factora_production;
CREATE DATABASE factora_dispatch;
CREATE DATABASE factora_buyer;

By default, the backend services use:

Username: postgres
Password: root

For security, use environment variables instead of committing real credentials.

Environment Variables

Common backend variables

Variable

Description

Default

DB_URL

PostgreSQL connection URL

Service-specific local database

DB_USERNAME

PostgreSQL username

postgres

DB_PASSWORD

PostgreSQL password

root

DDL_AUTO

Hibernate schema strategy

update

SHOW_SQL

Display SQL statements

false

EUREKA_URL

Eureka server endpoint

http://localhost:8761/eureka

Auth Service variables

Variable

Description

JWT_SECRET

Secret key used to sign JWT tokens

MAIL_HOST

SMTP server host

MAIL_PORT

SMTP server port

MAIL_USERNAME

SMTP account username

MAIL_PASSWORD

SMTP account password or app password

INVENTORY_SERVICE_URL

Optional inventory-service URL

PORT

Auth-service port; defaults to 8081

Generate and provide a strong JWT secret before starting the Auth Service.

Example for Linux or macOS:

export JWT_SECRET="replace-with-a-long-random-secret"

Example for Windows PowerShell:

$env:JWT_SECRET="replace-with-a-long-random-secret"

Frontend variables

Create frontend/.env:

VITE_API_BASE_URL=http://localhost:8080

Running the Project Locally

1. Clone the repository

git clone https://github.com/yashchopade262003/factora-.git
cd factora-

2. Start PostgreSQL

Ensure PostgreSQL is running and that all five databases have been created.

3. Build the backend

From the backend multi-module directory:

cd backend/factora
mvn clean install

4. Start the services

Open separate terminals and start the services in the following order.

Eureka Server

cd backend/factora/eureka-server
mvn spring-boot:run

Eureka dashboard:

http://localhost:8761

Auth Service

cd backend/factora/auth-service
mvn spring-boot:run

Inventory Service

cd backend/factora/inventry-service
mvn spring-boot:run

Production Service

cd backend/factora/production-service
mvn spring-boot:run

Dispatch Service

cd backend/factora/dispatch-service
mvn spring-boot:run

Buyer Service

cd backend/factora/buyer-service
mvn spring-boot:run

API Gateway

cd backend/factora/api-gateway
mvn spring-boot:run

After startup, verify that the services appear on the Eureka dashboard.

5. Start the frontend

cd frontend
npm install
npm run dev

Open the application at:

http://localhost:5173

API Gateway Routes

All frontend requests are sent to the API Gateway at http://localhost:8080.

Route prefix

Backend service

/auth/**

Auth Service

/user/**

Auth Service

/vendor/**

Auth Service

/role/**

Auth Service

/inventory/**

Inventory Service

/production/**

Production Service

/dispatch/**

Dispatch Service

/buyer/**

Buyer Service

/buyer-order/**

Buyer Service

Selected API Endpoints

Authentication and administration

POST   /auth/login
POST   /user/register
GET    /user/current-user
GET    /user/list
GET    /user/{id}
PUT    /user/update/{id}
DELETE /user/delete/{id}
POST   /role/add
GET    /role/list
POST   /vendor/add
GET    /vendor/getAll
GET    /vendor/{id}
GET    /vendor/{id}/inventory

Inventory

POST   /inventory/add
GET    /inventory/all
GET    /inventory/{id}
PUT    /inventory/update/{id}
DELETE /inventory/delete/{id}
PUT    /inventory/stock-in/{id}
PUT    /inventory/stock-out/{id}
PUT    /inventory/adjust-stock/{id}
GET    /inventory/available
GET    /inventory/low-stock
GET    /inventory/out-of-stock
GET    /inventory/expired
GET    /inventory/expiring/{days}
GET    /inventory/dashboard

Buyers and orders

POST   /buyer/add
GET    /buyer/all
GET    /buyer/{id}
GET    /buyer/vendor/{vendorId}
PUT    /buyer/update/{id}
DELETE /buyer/delete/{id}

POST   /buyer-order/add
GET    /buyer-order/all
GET    /buyer-order/{id}
GET    /buyer-order/vendor/{vendorId}
GET    /buyer-order/buyer/{buyerId}
GET    /buyer-order/status/{status}
PUT    /buyer-order/update/{id}
PUT    /buyer-order/status/{id}
DELETE /buyer-order/delete/{id}

Production and dispatch

The Production and Dispatch services provide create, read, update, delete, vendor-based filtering, and status-based workflow endpoints. Dispatch also includes actions for marking a shipment as in transit, delivered, or cancelled.

POST   /production/add
GET    /production/all
GET    /production/{id}
GET    /production/vendor/{vendorId}
GET    /production/status/{status}

POST   /dispatch/add
GET    /dispatch/all
GET    /dispatch/{id}
GET    /dispatch/vendor/{vendorId}
GET    /dispatch/buyer/{buyerId}
GET    /dispatch/status/{status}
PUT    /dispatch/in-transit/{id}
PUT    /dispatch/delivered/{id}
PUT    /dispatch/cancel/{id}
DELETE /dispatch/delete/{id}

Authentication Flow

A user submits login credentials to /auth/login.

The Auth Service validates the credentials.

A JWT token is returned after successful authentication.

The frontend stores the token in local storage.

Axios attaches the token to protected requests:

Authorization: Bearer <token>

When the API returns 401 Unauthorized, the frontend clears the session and redirects the user to the login page.

Testing

Frontend tests

cd frontend
npm test

Run tests in watch mode:

npm run test:watch

Lint the frontend:

npm run lint

Build the production frontend:

npm run build

Backend tests

From backend/factora:

mvn test

Run tests for one service:

mvn -pl buyer-service test

Docker Build

Each backend service contains a Dockerfile. For most service Dockerfiles, the build context must be the multi-module backend root:

cd backend/factora
docker build -f auth-service/Dockerfile -t factora-auth .
docker build -f inventry-service/Dockerfile -t factora-inventory .
docker build -f production-service/Dockerfile -t factora-production .
docker build -f dispatch-service/Dockerfile -t factora-dispatch .
docker build -f buyer-service/Dockerfile -t factora-buyer .
docker build -f api-gateway/Dockerfile -t factora-gateway .

Build Eureka from its own directory:

cd backend/factora/eureka-server
docker build -t factora-eureka .

A root backend Dockerfile is also available and accepts SERVICE and APP_PORT build arguments.

Example:

cd backend/factora
docker build \
  --build-arg SERVICE=auth-service \
  --build-arg APP_PORT=8081 \
  -t factora-auth .

Screenshots

Add project screenshots to a folder such as docs/screenshots/ and replace the placeholders below.

Login Page

![Login Page](docs/screenshots/login.png)

Main Dashboard

![Main Dashboard](docs/screenshots/dashboard.png)

Inventory Dashboard

![Inventory Dashboard](docs/screenshots/inventory-dashboard.png)

Production Management

![Production Management](docs/screenshots/production.png)

Dispatch Management

![Dispatch Management](docs/screenshots/dispatch.png)

Future Improvements

Docker Compose for starting the complete system with one command

Kubernetes deployment

Centralized configuration server

Distributed tracing and centralized logging

Message queues for asynchronous service communication

Refresh-token support

Role-level authorization for individual screens and APIs

Swagger/OpenAPI documentation

Automated CI/CD pipeline

Barcode or QR-code integration

Real-time notifications

Analytics and production forecasting

Security Notes

Do not commit database passwords, email passwords, or JWT secrets.

Use environment variables in development and secret-management tools in production.

Use a long, random JWT secret.

Restrict production CORS origins to the deployed frontend domain.

Replace default database credentials before deployment.

License

No license file is currently included in the repository. Add a license before allowing external reuse or distribution.

Developed as a final-year project to demonstrate full-stack development, microservice architecture, secure API design, and modern factory workflow management.
