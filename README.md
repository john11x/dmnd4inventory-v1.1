<p align="center">
  <img src="https://img.shields.io/github/repo-size/john11x/dmnd4inventory-v1.1" />
  <img src="https://img.shields.io/github/contributors/john11x/dmnd4inventory-v1.1" />
  <img src="https://img.shields.io/github/last-commit/john11x/dmnd4inventory-v1.1" />
  <img src="https://img.shields.io/github/license/john11x/dmnd4inventory-v1.1" />
  <img src="https://img.shields.io/badge/Java-17-blue" />
  <img src="https://img.shields.io/badge/SpringBoot-3.4-brightgreen" />
  <img src="https://img.shields.io/badge/Next.js-14-black" />
  <img src="https://img.shields.io/badge/Python-3.10-yellow" />
  <img src="https://img.shields.io/badge/FastAPI-ML%20Service-green" />
</p>

# Inventory Management System with ML Predictions

A full-stack, microservices-based inventory management platform with secure role-based access control, real-time analytics, and machine learning-powered demand forecasting.

## Architecture Diagram

```mermaid
flowchart LR
    subgraph Frontend["Next.js Frontend"]
        UI["React UI / Tailwind CSS"]
        API_F["Next.js API Routes"]
    end

    subgraph Backend["Spring Boot Backend"]
        CTRL["REST Controllers"]
        SRV["Service Layer"]
        REPO["JPA Repository"]
        DB[("PostgreSQL")]
    end

    subgraph ML["Machine Learning Service (FastAPI)"]
        MODEL["Demand Model (joblib)"]
        PREDICT["Prediction Endpoint"]
    end

    UI --> API_F
    API_F --> CTRL
    CTRL --> SRV
    SRV --> REPO
    REPO --> DB
    SRV --> PREDICT
    PREDICT --> MODEL

Project Structure
inventory/
├── app/                        # Next.js frontend
│   ├── admin/                  # Admin views
│   │   ├── dashboard/          # Analytics dashboard
│   │   ├── inventory/          # Stock management
│   │   └── products/           # Product CRUD
│   ├── api/                    # API routes
│   ├── components/             # Reusable UI components
│   └── user/                   # User interfaces
│
├── inventory_backend/          # Spring Boot backend
│   └── src/main/java/com/example/inventory/
│       ├── config/             # Configuration files
│       ├── controller/         # REST controllers
│       ├── model/              # Entities
│       ├── repository/         # JPA repository
│       └── service/            # Business logic
│
├── ml/                         # Machine learning service
│   ├── demand_model.joblib     # Trained ML model
│   ├── predict.py              # Prediction API
│   └── Inventory_ML.ipynb      # Model training notebook
│
└── tests/
    ├── integration/            # Integration tests
    └── unit/                   # Unit tests