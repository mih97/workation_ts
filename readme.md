# Workstation Management API

A backend API for managing users, employees, workstations, companies, and departments.  
Built with **Node.js**, **Express**, **TypeORM**, and **PostgreSQL**
---

##  Features

- **Authentication & Authorization**
    - JWT-based login/register
    - Role-based authorization (`user`, `manager`, `admin`)
    - Public routes whitelist (login, register, activate, reset password)

- **User Lifecycle**
    - Invite users via admin
    - Activate account via invite token
    - Enable/disable users (admin only)
    - Change password (self-service)
    - Request/reset password

- **Entities**
    - Users
    - Employees
    - Workstations
    - Departments
    - Companies
---

##  Tech Stack

- **Node.js** 
- **Express.js**
- **TypeORM** 
- **PostgreSQL**
- **JWT** (auth)
- **Bcrypt**
- **class-validator / class-transformer** 
- **Vitest + Supertest** 
- **ESLint + Prettier** 

---

## Setup

### 1. Clone repository and Install dependencies

```
git clone <repo-url>
npm install
```

### 2. Environment Variables

#### Create .env in project root:

```
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=appdb
JWT_SECRET=supersecret
```

### 3. Setup Database(Docker)
```
docker run --name workation-db \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=postgres \
-e POSTGRES_DB=appdb \
-p 5432:5432 \
-d postgres:15
```

### 4. Migrations
```
npm run typeorm migration:generate -- -n Init
npm run typeorm migration:run
```

### 5. Testing

```
npm test 
npm test tests/user-lifecycle.test.ts 
```