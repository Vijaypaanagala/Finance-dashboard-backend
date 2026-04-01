# Finance Dashboard Backend

A clean and modular Node.js/Express backend for a finance dashboard application.  
It provides APIs for user management, financial records, and dashboard analytics with role-based access control.

## Project Overview

This backend is built with an MVC architecture and MongoDB. It supports:
- User creation and role/status management
- Financial record CRUD operations
- Dashboard analytics (summary, category totals, recent transactions, monthly trends)
- Input validation, centralized error handling, and role-based route protection

## Features

- MVC project structure (`models`, `controllers`, `routes`, `middleware`, `config`)
- MongoDB integration with Mongoose
- Environment-based configuration with `dotenv`
- Role-Based Access Control (RBAC)
- Shared validation utilities for cleaner controllers
- Centralized global error handling
- Records filtering, pagination, and text search (`category`, `note`)
- Aggregation-based dashboard endpoints

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- CORS
- dotenv

## Folder Structure

```text
finance-dashboard-backend/
├── config/
│   └── db.js
├── controllers/
│   ├── dashboardController.js
│   ├── healthController.js
│   ├── recordController.js
│   └── userController.js
├── middleware/
│   ├── checkRole.js
│   └── errorHandler.js
├── models/
│   ├── FinancialRecord.js
│   └── User.js
├── routes/
│   ├── dashboardRoutes.js
│   ├── healthRoutes.js
│   ├── recordRoutes.js
│   └── userRoutes.js
├── utils/
│   ├── ApiError.js
│   ├── asyncHandler.js
│   └── validators.js
├── .env.example
├── package.json
├── README.md
└── server.js
```

## API Endpoints

Base URL: `http://localhost:5000`

### Health

- `GET /api/health`

### Users

- `POST /api/users` - Create user
- `GET /api/users` - Get all users
- `PATCH /api/users/:id` - Update role/status

### Financial Records

- `POST /api/records` - Create record
- `GET /api/records` - Get records (supports filters/pagination/search)
- `PUT /api/records/:id` - Update record
- `DELETE /api/records/:id` - Delete record

`GET /api/records` query params:
- `type`: `income` or `expense`
- `category`: partial match (case-insensitive)
- `note`: partial match (case-insensitive)
- `startDate`: date filter start
- `endDate`: date filter end
- `page`: pagination page (default `1`)
- `limit`: page size (default `10`, max `100`)

### Dashboard

- `GET /api/dashboard/summary`
- `GET /api/dashboard/category`
- `GET /api/dashboard/recent`
- `GET /api/dashboard/monthly`

## Role-Based Access Control

Role is read from `req.user.role` or `req.headers.role` (mock mode).

### Users
- `POST /api/users` -> `admin`
- `PATCH /api/users/:id` -> `admin`
- `GET /api/users` -> `admin`, `analyst`

### Financial Records
- `POST /api/records` -> `admin`, `analyst`
- `GET /api/records` -> `admin`, `analyst`, `viewer`
- `PUT /api/records/:id` -> `admin`
- `DELETE /api/records/:id` -> `admin`

### Dashboard
- All dashboard endpoints -> `admin`, `analyst`, `viewer`

Error behavior:
- `401` -> Unauthorized (no role provided)
- `403` -> Access denied (role not allowed)

## Setup Instructions

1. Clone the repository
```bash
git clone <your-repo-url>
cd finance-dashboard-backend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Update `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/finance_dashboard
```

4. Run the project
```bash
npm run dev
```

If you prefer plain Node:
```bash
node server.js
```

## Example Requests

Use a role header for testing RBAC:

### 1) Create User (admin only)
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "role: admin" \
  -d "{\"name\":\"Alice\",\"email\":\"alice@example.com\",\"password\":\"secret123\",\"role\":\"analyst\"}"
```

### 2) Create Financial Record (admin/analyst)
```bash
curl -X POST http://localhost:5000/api/records \
  -H "Content-Type: application/json" \
  -H "role: analyst" \
  -d "{\"userId\":\"<USER_ID>\",\"amount\":1200,\"type\":\"income\",\"category\":\"Salary\",\"note\":\"Monthly payout\"}"
```

### 3) Get Records with Filters + Pagination
```bash
curl "http://localhost:5000/api/records?type=expense&category=food&page=1&limit=5" \
  -H "role: viewer"
```

### 4) Dashboard Summary
```bash
curl http://localhost:5000/api/dashboard/summary \
  -H "role: viewer"
```

## Error Response Format

All API errors return JSON:
```json
{
  "message": "Error description"
}
```

Common status codes:
- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `500` Server Error

## Assumptions Made

- Authentication is not fully implemented yet; role is mocked via header/user object.
- Passwords are currently stored as plain text (hashing should be added before production).
- `DELETE /api/records/:id` performs hard delete (no soft delete currently).
- Dashboard aggregations are global (not scoped per user unless additional filtering is added).
- `npm run dev` assumes `nodemon` is available in your environment.

