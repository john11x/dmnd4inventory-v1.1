<p align="center">
  <img src="https://img.shields.io/github/repo-size/john11x/dmnd4inventory-v1.1" />
  <img src="https://img.shields.io/badge/Java-17-blue" />
  <img src="https://img.shields.io/badge/SpringBoot-3.4-brightgreen" />
  <img src="https://img.shields.io/badge/Next.js-14-black" />
  <img src="https://img.shields.io/badge/Python-3.10-yellow" />
  <img src="https://img.shields.io/badge/FastAPI-ML%20Service-green" />
</p>

# Inventory Management System with ML Predictions

A full-stack, microservices-based inventory management platform with secure role-based access control, real-time analytics, and machine learning-powered demand forecasting.

## Features

### Authentication & Authorization
- Multi-role access (Admin/User)
- JWT-based authentication
- Protected routes with middleware
- Secure session management

### Admin Dashboard
- Real-time inventory analytics
- Interactive charts (Recharts)
- Demand forecasting insights
- Low stock alerts
- Sales performance metrics

### Product Management
- CRUD operations
- Category & tag support
- Bulk import/export tools
- Barcode/QR code integration

### Inventory Control
- Stock level monitoring
- Automatic reorder points
- Batch/lot tracking
- Supplier management

### ML-Powered Predictions
- Demand forecasting
- Sales trend analysis
- Automated restock recommendations
- Seasonal pattern detection

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
├── app/                     # Next.js frontend
│   ├── admin/               # Admin views
│   │   ├── dashboard/       # Analytics dashboard
│   │   ├── inventory/       # Stock management
│   │   └── products/        # Product CRUD
│   ├── api/                 # API routes
│   ├── components/          # Reusable UI components
│   └── user/                # User interfaces
│
├── inventory_backend/       # Spring Boot backend
│   └── src/main/java/com/example/inventory/
│       ├── config/          # Configuration files
│       ├── controller/      # REST controllers
│       ├── model/           # Entities
│       ├── repository/      # JPA repository
│       └── service/         # Business logic
│
├── ml/                      # Machine learning service
│   ├── demand_model.joblib   # Trained ML model
│   ├── predict.py            # Prediction API
│   └── Inventory_ML.ipynb    # Model training notebook
│
└── tests/
    ├── integration/         # Integration tests
    └── unit/                # Unit tests
```
## Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- Python 3.10+
- PostgreSQL 14+
- Maven 3.8+

## Installation

### Clone the Repository
```
git clone https://github.com/john11x/dmnd4inventory-v1.1.git
cd dmnd4inventory-v1.1
Frontend Setup

cd app
npm install
cp .env.example .env.local
npm run dev
Backend Setup

cd inventory_backend
cp src/main/resources/application.example.properties src/main/resources/application.properties
# Update PostgreSQL credentials
./mvnw spring-boot:run
ML Service Setup

cd ml
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn predict:app --reload

Testing
Frontend
npm test
npm run test:coverage

Backend
cd inventory_backend
./mvnw test
API Documentation
API documentation is available at:
```

## Contact
John Obowu
johnaobowu@gmail.com

Project Link: https://github.com/john11x/dmnd4inventory-v1.1