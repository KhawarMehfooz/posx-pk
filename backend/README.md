# 🚀 POSX-PK Backend (NestJS + Prisma + SQLite)

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

A modern backend built with **NestJS**, **Prisma**, **SQLite**, and **JWT authentication**.

---

# 📦 Project Setup

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Copy environment file

Duplicate the example env file:

```bash
cp .env.example .env
```

Fill in:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_jwt_secret_here"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
```

### 3️⃣ Generate Prisma client

```bash
npx prisma generate
```

### 4️⃣ Run the seed command (creates default ADMIN user)

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

# 🔐 Authentication

* `/auth/login` → Login using email & password
* `/auth/me` → Fetch logged-in user (JWT required)

---

# 🧪 Tests

```bash
npm run test
npm run test:e2e
npm run test:cov
```

---

# 📘 Useful Commands

### Open Prisma Studio (DB UI)

```bash
npx prisma studio
```

---

# 📄 License

MIT