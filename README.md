<div align="center">
  <h1>Inventory Management System with ML Predictions</h1>
  <p>
    <!-- CI Status Badge - Temporarily Disabled -->
    <!-- <a href="https://github.com/john11x/dmnd4inventory-v1.1/actions">
      <img src="https://github.com/john11x/dmnd4inventory-v1.1/actions/workflows/ci.yml/badge.svg" alt="CI Status" />
    </a> -->
  </p>
</div>

## Overview

A modern, full-stack inventory management system that leverages machine learning for demand forecasting. Built with a microservices architecture, it provides analytics and intelligent stock management capabilities.

### Key Features

- **Intelligent Inventory Management**
  - ML-powered demand forecasting
  - Real-time stock level monitoring

- **Advanced Analytics**
  - Interactive dashboards
  - Sales trend analysis

- **Security & Access Control**
  - Role-based access control (RBAC)
  - Secure API endpoints

- **Multi-User Collaboration**
  - User permission management

## Technical Stack

### Frontend
- **Framework**: Next.js 16 (App Router) with React 19
- **State Management**: React Context API + Hooks
- **Styling**: Tailwind CSS 4
- **Data Visualization**: Recharts, Chart.js
- **Testing**: Jest, React Testing Library
- **Build Tool**: Next.js built-in bundler

### Backend (Spring Boot)
- **Language**: Java 17
- **Framework**: Spring Boot 3.4.12
- **Security**: Spring Security 6.1 + JWT
- **Database**: PostgreSQL 14+
- **ORM**: Hibernate 6.4 + JPA 3.1
- **Testing**: JUnit 5, Mockito

### ML Service (FastAPI)
- **Framework**: FastAPI
- **ML Libraries**: scikit-learn, numpy
- **Async Support**: Python 3.10+
- **Model Persistence**: joblib
- **API Documentation**: Built-in FastAPI docs (Swagger UI + ReDoc)

### DevOps
- **CI/CD**: GitHub Actions (configured but currently disabled)
- **Version Control**: Git with GitHub
- **Package Management**: Maven (Java), npm (Node.js), pip (Python)

## Project Structure
```
inventory/
├── .github/                 # GitHub workflows and templates
│   └── workflows/           # CI/CD pipelines
│
├── app/                     # Next.js frontend application
│   ├── admin/               # Admin-specific views and components
│   ├── api/                 # API route handlers (Next.js API routes)
│   ├── components/          # Reusable React components
│   │   ├── common/          # Shared UI components
│   │   ├── dashboard/       # Dashboard-specific components
│   │   └── forms/           # Form components with validation
│   ├── context/             # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and helpers
│   ├── pages/               # Next.js pages
│   ├── public/              # Static assets
│   └── styles/              # Global styles and themes
│
├── inventory_backend/       # Spring Boot backend
│   └── src/main/java/com/example/inventory/
│       ├── config/          # Spring configuration classes
│       ├── controller/      # REST API controllers
│       ├── dto/             # Data Transfer Objects
│       ├── exception/       # Exception handling
│       ├── model/           # JPA entities
│       ├── repository/      # Spring Data repositories
│       ├── security/        # Security configuration
│       ├── service/         # Business logic layer
│       └── util/            # Utility classes
│
├── ml/                      # ML service
│   ├── data/                # Training datasets
│   ├── models/              # Trained model files
│   ├── notebooks/           # Jupyter notebooks for EDA and training
│   ├── src/                 # Source code
│   │   ├── api/             # FastAPI application
│   │   ├── core/            # Core ML logic
│   │   └── services/        # Business logic
│   └── tests/               # Test suite
│
├── docs/                    # Project documentation
│   ├── api/                 # API documentation
│   ├── architecture/        # System architecture diagrams
│   └── guides/              # User and developer guides
│
└── tests/                   # Global test configurations
    ├── e2e/                 # End-to-end tests
    ├── integration/         # Integration tests
    └── unit/                # Unit tests
```
## Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **Java** 17 or higher (OpenJDK or Oracle JDK)
- **Python** 3.10+
- **PostgreSQL** 14+
- **Maven** 3.8+
- **npm** 9+ or **yarn** 1.22+

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/john11x/dmnd4inventory-v1.1.git
cd dmnd4inventory-v1.1
```

#### 2. Environment Setup
```bash
# Create environment files from the existing configurations
cp .env.local .env.example
cp inventory_backend/src/main/resources/application.properties \
   inventory_backend/src/main/resources/application.example.properties
```

#### 3. Manual Setup

##### Frontend
```bash
cd app
npm install
npm run dev  # Starts on http://localhost:3000
```

##### Backend
```bash
cd inventory_backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev  # Starts on http://localhost:8080
```

##### ML Service
```bash
cd ml
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r ../requirements-predict.txt
uvicorn predict_service:app --reload  # Starts on http://localhost:8000
```

### Testing

#### Run All Tests
```bash
# Unit tests
npm test
./mvnw test

# ML service tests
cd ml && python -m pytest
```

#### Test Coverage
```bash
# Frontend coverage
npm run test:coverage
```

## Documentation

- [ML Service Docs](http://localhost:8000/docs)
- [Design Document](DESIGN.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
