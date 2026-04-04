# Fintech Backend Management System

A robust, modular Node.js/Express API designed for managing financial transactions with Role-Based Access Control (RBAC), JWT authentication, and data analytics.

## 🚀 Live Links
- **Live API URL:** [https://fintech-backend-assignment.onrender.com](https://fintech-backend-assignment.onrender.com)
- **API Documentation:** [Link to your Postman Documentation]
- **Postman Collection:** (Found in `/docs/collection.json` in this repo)

---

## 🛠️ Features
- **User & Role Management:** Secure Signup/Login with hashed passwords (bcrypt).
- **Financial Records CRUD:** Full management of Income and Expenses.
- **Advanced Filtering:** Filter transactions by `type`, `category`, and `date range` (startDate/endDate).
- **Dashboard Summary:** Aggregated totals for Income, Expenses, and Net Balance.
- **Role-Based Access Control (RBAC):** - **Admin:** Full control (Create, Read, Update, Delete, Analytics).
  - **Analyst:** Can Create/Update records and view Analytics, but cannot Delete.
  - **Viewer:** Read-only access to transaction history.
- **Security:** Protected routes using JWT (JSON Web Tokens).

---

## 🏗️ Architecture & Technical Decisions

### 1. Modular Pattern (MVC-ish)
**Decision:** I chose a modular folder structure separating Models, Routes, and Controllers.
**Trade-off:** This adds slightly more boilerplate initially, but ensures the project is scalable and testable. A single `index.js` file would have been faster to write but impossible to maintain.

### 2. Database Selection (MongoDB)
**Decision:** Used MongoDB (NoSQL) over a Relational Database (SQL).
**Trade-off:** While SQL is great for strict financial integrity, MongoDB allowed for faster iteration on the Category and Metadata fields. I prioritized flexible schema evolution as financial categories grow.

### 3. Authentication (JWT)
**Decision:** Implemented Stateless JWT instead of Server-side Sessions.
**Trade-off:** JWTs are easier to scale across multiple servers, but they lack an easy "force logout" mechanism. I prioritized a modern, stateless approach for this assignment.

### 4. Access Control (Custom Middleware)
**Decision:** Built a central `authorize` middleware rather than checking roles inside each controller.
**Trade-off:** This ensures RBAC is enforced consistently across the app. I mitigated the lack of complexity by attaching the user object to the `req`, allowing for ownership checks with minimal overhead.

---

## 📋 Testing Instructions

### A) Environment Setup
To test the Live URL in Postman, create an **Environment** and add the following variable:
- **Variable Name:** `baseUrl`
- **Value:** `https://fintech-backend-assignment.onrender.com`

### B) Authentication Flow
1. **Register/Login:** Use the Auth endpoints to receive a JWT.
2. **Authorize:** Copy the token and go to the **Authorization** tab in Postman. Select **Bearer Token** and paste it there.
3. **Access:** You can now access protected routes based on your assigned role.

### C) Recommended Testing Order
1. Register a new user with role `Admin`.
2. Login to get the token.
3. **POST** a few transactions (Income/Expense).
4. **GET** `/api/summary` to see aggregated totals.
5. **GET** `/api/transactions` using query params (e.g., `?category=Food&startDate=2026-01-01`).

---

## ⚠️ Notes
- **Cold Start:** The API is hosted on a free cloud tier (Render). If the server is idle, the first request may take **30-60 seconds** to wake up. 
- **Validation:** Explicit validation is in place to prevent negative transaction amounts and invalid enums.
- **Audit Integrity:** Analysts are restricted from deleting records to maintain a reliable financial audit trail.

---

## ⚙️ Local Installation
1. Clone the repo: `git clone <repo-url>`
2. Install dependencies: `npm install`
3. Create a `.env` file with:
   - `PORT=5000`
   - `MONGO_URI=<your-mongodb-url>`
   - `JWT_SECRET=<your-secret>`
4. Start the server: `npm run dev`