# 🚀 POSX-PK Backend (NestJS + Prisma + SQLite)

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

A modern backend built with **NestJS**, **Prisma ORM**, **SQLite database**, and **JWT authentication**, using a global **JSend response format** for consistent API output.

---

# 📦 Project Setup

### Install dependencies

```bash
npm install
```

### Copy environment file

Duplicate the example environment file:

```bash
cp .env.example .env
```

Fill in required values:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_jwt_secret_here"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
```

### Generate the Prisma client

```bash
npx prisma generate
```

### Run Migration

```bash
npx prisma migrate dev
```

### Seed the database (creates default ADMIN user)

```bash
npm run seed
```

---

# ▶ Running the Project

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run start:prod
```

---

# 🔐 Authentication Endpoints

## **POST /auth/login**

Authenticate using email + password and receive a JWT token.

### 📤 Request Body

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### 📥 JSend Success Response

```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR..."
  }
}
```

### ❗ JSend Error Response (invalid credentials)

```json
{
  "status": "error",
  "message": "Invalid credentials",
  "statusCode": 401,
  "path": "/auth/login"
}
```

---

## **GET /auth/me**

Fetch the authenticated user's info using JWT.

### 📤 Headers

```
Authorization: Bearer <token>
```

### 📥 JSend Success Response

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "email": "admin@example.com",
    "role": "ADMIN",
    "createdAt": "2025-11-28T17:52:10.123Z"
  }
}
```

### ❗ JSend Error Response (missing/invalid token)

```json
{
  "status": "error",
  "message": "Invalid token",
  "statusCode": 401,
  "path": "/auth/me"
}
```

---

# 📘 API Response Format (JSend)

This backend uses **global interceptors and filters** to enforce the standardized JSend structure.

### ✔ **Success**

```json
{
  "status": "success",
  "data": { ... }
}
```

### ✔ **Fail (validation / client errors)**

```json
{
  "status": "error",
  "message": "Password is required",
  "statusCode": 400,
  "path": "/auth/login"
}
```

### ✔ **Error (internal / unhandled)**

```json
{
  "status": "error",
  "message": "Internal server error",
  "statusCode": 500,
  "path": "/any-endpoint"
}
```

---

# 🧪 Testing

```bash
npm run test
npm run test:e2e
npm run test:cov
```

---

# 📘 Useful Commands

### Open Prisma Studio (Database UI)

```bash
npx prisma studio
```

---

# 📄 License

MIT