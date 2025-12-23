# Network Operations Dashboard (Mini OSS Tool)

A full-stack Network Operations Dashboard that simulates a lightweight OSS (Operations Support System).
The application allows users to monitor network services, manage service states, and interact with backend microservices through a modern web interface.

This project was built to demonstrate real-world software engineering practices used in network operations, cloud platforms, and DevOps-driven environments.

---

## Project Overview

Network Operations teams rely on OSS tools to monitor services, detect issues, and manage infrastructure state.
This project recreates a simplified version of such a system by combining:

- A Python-based backend microservice
- A React + TypeScript frontend dashboard
- API-driven communication between components

The goal is to showcase full-stack development, system integration, and production-oriented design.

---

## Features

- View a list of network services and their operational status
- Add new services dynamically through the UI
- Toggle service status (Active / Inactive)
- Backend REST API built with FastAPI
- Frontend dashboard built with Next.js and TypeScript
- Clean separation between frontend and backend
- API documentation via FastAPI Swagger UI
- Scalable structure suitable for cloud deployment and CI/CD

---

## System Architecture

The system follows a microservice-inspired architecture:

- **Frontend** communicates with backend services via REST APIs
- **Backend** handles business logic and data validation
- **API layer** acts as the contract between systems

This mirrors how real OSS/BSS and cloud platforms are designed in production.

---

## Tech Stack

### Frontend
- Next.js (React framework)
- TypeScript
- TailwindCSS
- REST API integration using fetch

### Backend
- Python
- FastAPI
- Uvicorn ASGI server
- Pydantic for data modeling and validation

### Development Practices
- RESTful API design
- Modular project structure
- Environment-based configuration
- Git and GitHub for version control

---

## 📁 Project Structure

