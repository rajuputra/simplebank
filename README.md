# 🏦 Dermawan Bank (Simple Bank)

> A modern, robust, and scalable digital banking backend web service built with Go.

![Go Version](https://img.shields.io/badge/Go-1.21+-00ADD8?style=flat&logo=go)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat&logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-Message_Queue-DC382D?style=flat&logo=redis)
![AWS](https://img.shields.io/badge/Deployed_on-AWS_EKS-232F3E?style=flat&logo=amazon-aws)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=flat&logo=docker)

🌐 **Live Demo & Production Site:** [dermawan-bank.my.id](https://dermawan-bank.my.id)

---

## 📖 Overview

Dermawan Bank (formerly Simple Bank) is a comprehensive digital banking platform that provides secure RESTful and gRPC APIs for banking operations. The project was built from the ground up with a focus on production-readiness, scalability, and security.

It allows users to:
- Create and securely manage bank accounts.
- Record and trace all balance changes across accounts.
- Perform secure, transactional money transfers between multiple accounts.

This project serves as a showcase of advanced backend development concepts, including database transaction isolation, asynchronous processing, container orchestration, and continuous integration/deployment (CI/CD).

---

## 🛠️ Tech Stack & Technologies

**Backend Core:**
- **Language:** Golang (Go)
- **Frameworks:** Gin (HTTP REST), gRPC (RPC API)
- **Architecture:** gRPC Gateway (serving both gRPC & HTTP requests concurrently)
- **Authentication:** PASETO (Platform-Agnostic Security Tokens) & JWT, Role-Based Access Control (RBAC)

**Database & Cache:**
- **Primary Database:** PostgreSQL (AWS RDS)
- **Query Builder:** Sqlc (Type-safe SQL code generation)
- **Task Queue & Cache:** Redis (Asynchronous background workers)
- **Migration:** Golang-migrate

**DevOps & Deployment:**
- **Infrastructure:** AWS EKS (Kubernetes), AWS ECR, AWS RDS, AWS Secrets Manager
- **CI/CD:** GitHub Actions (Automated Testing, Docker Build, & K8s Deployment)
- **Networking & Security:** NGINX Ingress Controller, Route53, Cert-Manager (Let's Encrypt TLS/SSL)
- **Containerization:** Docker & Docker Compose (Multi-stage builds)

---

## ✨ Core Features & System Architecture

### 1. Database & Transaction Integrity
- **Robust Database Design:** Designed via dbdiagram.io, implemented with strictly enforced foreign key and unique constraints.
- **Deadlock Prevention:** Carefully ordered SQL queries and deep implementation of DB Transaction Isolation Levels to handle read phenomena and prevent deadlocks during concurrent money transfers.
- **Type-safe Queries:** Utilized `sqlc` for blazing-fast, secure, and type-safe Golang CRUD operations.

### 2. API Design (HTTP & gRPC)
- **Dual Protocol Support:** Employs gRPC Gateway to write code once and serve both gRPC and RESTful HTTP requests.
- **Advanced API Features:** Supports partial DB updates with nullable arguments, custom parameter validation, and embedded Swagger documentation.
- **Logging & Monitoring:** Integrated structured logging middlewares for HTTP and interceptors for gRPC.

### 3. Security & Authentication
- **Strong Encryption:** Passwords securely hashed using Bcrypt.
- **Modern Tokens:** Implemented PASETO (and JWT) for secure token-based authentication.
- **Session Management:** Secure refresh token mechanism using HTTP-only cookies.
- **RBAC:** Role-Based Access Control to protect sensitive endpoints.

### 4. Asynchronous Processing
- **Background Workers:** Redis-backed async task queue integration for offloading heavy tasks.
- **Transactional Enqueueing:** Tasks are sent to Redis reliably within a PostgreSQL DB transaction.
- **Email Verification:** Automated async email verification flow using Gmail SMTP.

### 5. Production-Ready Deployment
- **Cloud-Native:** Fully deployed to a production Kubernetes cluster (Amazon EKS).
- **Secrets Management:** Secrets are safely isolated and injected using AWS Secrets Manager.
- **CI/CD Pipeline:** GitHub Actions automatically runs unit tests (with 100% mocked DB coverage), builds multi-stage Docker images, pushes to Amazon ECR, and triggers rolling updates in Kubernetes.
- **Graceful Shutdown:** Configured to gracefully shut down gRPC/HTTP servers and background workers to protect processing resources.

---

## 🧪 Testing & Quality Assurance
- **Unit Testing:** Comprehensive unit tests for database CRUD operations and HTTP/gRPC APIs using `gomock` (Custom matchers for stronger assertions).
- **Automated Workflows:** GitHub Actions configured to block deployments if tests fail.

---

*This project was developed as a comprehensive implementation of enterprise-grade backend engineering practices, demonstrating the ability to design, build, test, and deploy a highly available microservice to the cloud.*
