# ✅ **1. Create Category**

### **POST `/categories`**

**Body**

```json
{
  "name": "Beverages",
  "description": "All drink items"
}
```

**Success**

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Beverages",
    "description": "All drink items",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

# ✅ **2. Get Categories (pagination + search)**

### **GET `/categories?page=1&limit=10&search=bev`**

**Success**

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Beverages",
        "description": "All drink items"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

# ✅ **3. Get Single Category**

### **GET `/categories/1`**

**Success**

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Beverages",
    "description": "All drink items",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

# ✅ **4. Update Category**

### **PATCH `/categories/1`**

**Body**

```json
{
  "name": "Hot Beverages"
}
```

**Success**

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Hot Beverages",
    "description": "All drink items"
  }
}
```

---

# ✅ **5. Delete Category**

### **DELETE `/categories/1`**

**Success**

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Hot Beverages"
  }
}
```