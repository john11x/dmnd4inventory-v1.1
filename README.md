<div align="center">
  <h1>Inventory Management System with ML Predictions</h1>
  <p>
    <!-- CI Status Badge - Temporarily Disabled -->
    <!-- <a href="https://github.com/john11x/dmnd4inventory-v1.1/actions">
      <img src="https://github.com/john11x/dmnd4inventory-v1.1/actions/workflows/ci.yml/badge.svg" alt="CI Status" />
    </a> -->
    <a href="https://codecov.io/gh/john11x/dmnd4inventory-v1.1">
      <img src="https://codecov.io/gh/john11x/dmnd4inventory-v1.1/branch/main/graph/badge.svg" alt="Code Coverage" />
    </a>
    <a href="https://github.com/john11x/dmnd4inventory-v1.1/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" />
    </a>
  </p>
  <p>
    <img src="https://img.shields.io/badge/Java-17-blue" alt="Java 17" />
    <img src="https://img.shields.io/badge/Spring%20Boot-3.4-brightgreen" alt="Spring Boot 3.4" />
    <img src="https://img.shields.io/badge/Next.js-14-black" alt="Next.js 14" />
    <img src="https://img.shields.io/badge/React-18-61DAFB" alt="React 18" />
    <img src="https://img.shields.io/badge/Python-3.10-yellow" alt="Python 3.10" />
    <img src="https://img.shields.io/badge/FastAPI-0.95-009688" alt="FastAPI" />
  </p>
</div>

## Overview

A modern, full-stack inventory management system that leverages machine learning for demand forecasting and inventory optimization. Built with a microservices architecture, it provides real-time analytics, automated reordering, and intelligent stock management capabilities.

### Key Features

- **Intelligent Inventory Management**
  - ML-powered demand forecasting
  - Automated reorder point calculation
  - Real-time stock level monitoring
  - Batch/lot tracking with expiry alerts

- **Advanced Analytics**
  - Interactive dashboards with Recharts
  - Sales trend analysis
  - Inventory turnover metrics
  - Product performance insights

- **Security & Access Control**
  - JWT-based authentication
  - Role-based access control (RBAC)
  - Secure API endpoints
  - Audit logging

- **Multi-User Collaboration**
  - Real-time updates with WebSockets
  - Activity feed
  - User permission management
  - Team collaboration tools

## Technical Stack

### Frontend
- **Framework**: Next.js 14 (App Router) with React 18
- **State Management**: React Context API + Hooks
- **Styling**: Tailwind CSS + Headless UI
- **Data Visualization**: Recharts
- **Testing**: Jest, React Testing Library, Cypress E2E
- **Build Tool**: Vite

### Backend (Spring Boot)
- **Language**: Java 17
- **Framework**: Spring Boot 3.4
- **Security**: Spring Security 6.1 + JWT
- **Database**: PostgreSQL 14+
- **ORM**: Hibernate 6.4 + JPA 3.1
- **API Documentation**: SpringDoc OpenAPI 3.0
- **Testing**: JUnit 5, Mockito, Testcontainers

### ML Service (FastAPI)
- **Framework**: FastAPI 0.95+
- **ML Libraries**: scikit-learn, pandas, numpy
- **Async Support**: Python 3.10+
- **Model Serving**: ONNX Runtime
- **API Documentation**: Swagger UI + ReDoc

### DevOps
- **CI/CD**: GitHub Actions (temporarily disabled)
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Infrastructure as Code**: Terraform

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS + Headless UI
- **State**: React Context + Hooks
- **Charts**: Recharts
- **Testing**: Jest, React Testing Library

### Backend (Spring Boot)
- **Language**: Java 17
- **Framework**: Spring Boot 3.4
- **Security**: Spring Security + JWT
- **Database**: PostgreSQL
- **ORM**: Hibernate/JPA
- **API**: RESTful endpoints

### ML Service (FastAPI)
- **Framework**: FastAPI
- **ML Library**: scikit-learn
- **Model Persistence**: joblib
- **API**: Async REST endpoints

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

# Integration tests
npm run test:integration
./mvnw test -Pintegration

# E2E tests
npm run test:e2e

# ML service tests
cd ml && python -m pytest
```

#### Test Coverage
```bash
# Frontend coverage
npm run test:coverage

# Backend coverage
./mvnw jacoco:report
```

## Documentation

- [API Documentation](http://localhost:8080/swagger-ui.html) (after starting backend)
- [ML Service Docs](http://localhost:8000/docs)
- [Architecture Decision Records](/docs/architecture/decisions/)
- [Development Guide](/docs/guides/DEVELOPMENT.md)
- [Testing Guide](/docs/guides/TESTING.md)

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Team

- **John Obowu** - [@john11x](https://github.com/john11x)

## Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot) - For the amazing backend framework
- [Next.js](https://nextjs.org/) - For the React framework
- [FastAPI](https://fastapi.tiangolo.com/) - For the ML service API
- [Tailwind CSS](https://tailwindcss.com/) - For utility-first CSS

---

<div align="center">
  <p>Developed by John Obowu</p>
  <p>
    <a href="mailto:johnaobowu@gmail.com">Email</a> • 
    <a href="https://github.com/john11x">GitHub</a> • 
    <a href="https://www.linkedin.com/in/john-jr-obowu">LinkedIn</a>
  </p>
</div>