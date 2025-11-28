# ✅ **1. Login**

### **POST `/auth/login`**

### **Body**

```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### **Success**

```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
}
```

### **Invalid credentials**

```json
{
  "status": "error",
  "message": "Invalid credentials",
  "statusCode": 401,
  "path": "/auth/login"
}
```

---

# ✅ **2. Get Logged-in User**

### **GET `/auth/me`**

### **Headers**

```
Authorization: Bearer <JWT_TOKEN>
```

### **Success**

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "email": "admin@example.com",
    "role": "ADMIN",
    "createdAt": "2025-11-28T10:21:30.000Z"
  }
}
```

### **Invalid/Missing Token**

```json
{
  "status": "error",
  "message": "Invalid token",
  "statusCode": 401,
  "path": "/auth/me"
}
```
