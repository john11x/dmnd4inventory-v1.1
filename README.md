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
├── DESIGN.md                    # Design documentation
├── eslint.config.mjs            # ESLint configuration
├── jest.config.js               # Jest testing configuration
├── jest.setup.js                # Jest setup file
├── jsconfig.json                # JavaScript configuration
├── LICENSE                      # Project license
├── middleware.js                # Next.js middleware
├── next.config.mjs              # Next.js configuration
├── package.json                 # Node.js dependencies and scripts
├── postcss.config.mjs           # PostCSS configuration
├── predict_service.py           # Python prediction service
├── README-PREDICT.md            # Prediction service README
├── README.md                    # Main project README
├── requirements-predict.txt     # Python dependencies for prediction
├── run_predict.sh               # Script to run prediction service
├── __tests__/                   # Test suite
│   ├── demonstration/           # Demonstration tests
│   │   └── technical-test.js
│   ├── integration/             # Integration tests
│   │   └── user-home-workflow.test.js
│   ├── performance/             # Performance tests
│   │   └── performance.test.js
│   ├── unit/                    # Unit tests
│   │   ├── error-boundary.test.js
│   │   └── inventory-utils.test.js
│   └── utils/                   # Test utilities
│       └── advancedTesting.js
├── app/                         # Next.js frontend application
│   ├── globals.css              # Global CSS styles
│   ├── layout.js                # Root layout
│   ├── page.js                  # Home page
│   ├── admin/                   # Admin pages
│   │   ├── layout.js
│   │   ├── page.js
│   │   ├── dashboard/
│   │   │   └── page.js
│   │   ├── inventory/
│   │   │   └── page.js
│   │   ├── login/
│   │   │   └── page.js
│   │   ├── orders/
│   │   │   └── page.js
│   │   └── products/
│   │       ├── page.js
│   │       ├── [id]/
│   │       └── create/
│   ├── api/                     # API routes
│   │   ├── orders/
│   │   │   ├── route.js
│   │   │   └── __tests__/
│   │   ├── predict/
│   │   │   ├── route.js
│   │   │   └── [productId]/
│   │   ├── products/
│   │   │   └── [id]/
│   │   ├── stream/
│   │   │   └── route.js
│   │   └── test-predict/
│   │       └── route.js
│   ├── auth/                    # Authentication pages
│   │   └── page.js
│   ├── components/              # React components
│   │   ├── AdminSidebar.jsx
│   │   ├── ErrorBoundary.js
│   │   ├── Header.jsx
│   │   ├── InventoryPieChart.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── LogoutButton.jsx
│   │   ├── LowStockAlert.jsx
│   │   ├── ModelInfoPanel.jsx
│   │   ├── Navbar.js
│   │   ├── OrderForm.jsx
│   │   ├── ProductCard.js
│   │   ├── ProductCard.jsx
│   │   ├── ProductList.jsx
│   │   ├── ProductSearch.jsx
│   │   ├── ProtectedClient.jsx
│   │   ├── StatsCard.jsx
│   │   ├── StockOptimizerPanel.jsx
│   │   ├── VirtualizedProductList.jsx
│   │   ├── __tests__/
│   │   │   └── Navbar.test.js
│   │   │   └── ...
│   │   └── charts/
│   ├── hooks/                   # Custom React hooks
│   │   ├── useProductOptimization.js
│   │   └── useWebSocket.js
│   ├── lib/                     # Utility libraries
│   │   ├── api.js
│   │   └── __tests__/
│   ├── login/                   # Login page
│   │   └── page.js
│   ├── products/                # Products page
│   │   └── page.js
│   ├── providers/               # Context providers
│   │   ├── AuthProvider.jsx
│   │   └── RealtimeProvider.jsx
│   └── user/                    # User pages
│       ├── home/
│       ├── order/
│       └── product/
├── build/                       # Build artifacts
│   └── dev/                     # Development build
│       ├── build-manifest.json
│       ├── fallback-build-manifest.json
│       ├── package.json
│       ├── prerender-manifest.json
│       ├── routes-manifest.json
│       ├── trace
│       └── build/
│       └── cache/
│       └── logs/
│       └── server/
│       └── static/
│       └── types/
├── inventory_backend/           # Spring Boot backend
│   ├── HELP.md                  # Backend help documentation
│   ├── mvnw                     # Maven wrapper for Unix
│   ├── mvnw.cmd                 # Maven wrapper for Windows
│   ├── pom.xml                  # Maven project configuration
│   ├── src/                     # Source code
│   │   ├── main/                # Main source
│   │   └── test/                # Test source
│   └── target/                  # Build output
│       ├── inventory_backend-0.0.1-SNAPSHOT.jar.original
│       ├── classes/
│       ├── generated-sources/
│       ├── generated-test-sources/
│       ├── maven-archiver/
│       ├── maven-status/
│       └── test-classes/
├── ml/                          # Machine learning service
│   ├── BuildData.py             # Data building script
│   ├── demand_model.joblib      # Trained demand model
│   ├── feature_importance.py    # Feature importance analysis
│   ├── Inventory_ML.ipynb       # Jupyter notebook for ML
│   └── predict.py               # Prediction script
├── public/                      # Static assets
└── scripts/                     # Utility scripts
    └── repackage_model.py       # Model repackaging script
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
