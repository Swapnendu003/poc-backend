# 🚀 POC Backend

A robust Express.js backend for the Keploy Dashboard, providing APIs for repository tracking, test metrics, and customizable dashboards.

## ✨ Features

- **📊 Repository Management**: Track multiple repositories and their testing activity
- **📈 Test Metrics**: Collect and analyze test results with detailed metrics
- **🎛️ Dynamic Dashboards**: Customizable dashboard layouts with multiple widget types
- **⚡ Real-time Updates**: WebSocket implementation for live data updates
- **📝 API Documentation**: Comprehensive Swagger documentation

## 🚦 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB

### 🔧 Installation

1. Clone the repository
```bash
git clone https://github.com/Swapnendu003/poc-backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```
PORT=5000
MONGODB_URI=give 'your mongo uri'
NODE_ENV=development
```

4. Seed the database with sample data make a directory utils/seedData.js
```bash
npm run seed
```

5. Start the development server
```bash
npm run dev
```

## 📚 API Documentation

Access the Swagger documentation at:
```
http://localhost:5000/api-docs
```

## 🔌 Core Endpoints

### 📁 Repositories
- `GET /api/repositories` - Get all repositories
- `POST /api/repositories` - Add a new repository
- `GET /api/repositories/:id` - Get a specific repository

### 📊 Metrics
- `GET /api/metrics/summary` - Get overall metrics
- `GET /api/metrics/repositories/:id/tests` - Get tests for a repository
- `GET /api/metrics/time-series` - Get time-series data for charts

### 🎛️ Dashboard
- `GET /api/dashboard/config` - Get dashboard configuration
- `PUT /api/dashboard/config` - Update dashboard configuration

## 🛠️ Technologies

- Express.js - Web framework
- MongoDB/Mongoose - Database and ORM
- WebSockets - Real-time updates
- Swagger - API documentation
