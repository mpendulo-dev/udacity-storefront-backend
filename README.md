# Storefront Backend API

A scalable and type-safe backend application for a storefront system, built with Node.js, Express, PostgreSQL, and TypeScript. This API handles user management, product catalog, and order processing.

---

## Tech Stack

- Node.js
- TypeScript
- Express (web framework)
- Jasmine (testing)
- PostgreSQL (Relational Database)
- DB-migrate (Database migrations)
- Bcrypt (Password hashing)
- JWT (Authentication)
- Nodemon (development server)

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>

cd udacity-storefront-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a .env file in the root:

```bash
POSTGRES_HOST=127.0.0.1
POSTGRES_DB_NAME_DEV=storefront_dev
POSTGRES_DB_NAME_TEST=storefront_test
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_PORT=5432

BCRYPT_PASSWORD=your_pepper
SALT_ROUNDS=10
TOKEN_SECRET=your_jwt_secret

PORT=3000
```

## Database Setup

Using a database management tool of your choice, setup the storefront DB's:

### 1. Create database

```bash
CREATE DATABASE storefront_dev;
CREATE DATABASE storefront_test;
```

### 2. Install and run migrations

```bash
npm install -g db-migrate
```

Create Database tables:

```bash
db-migrate up
```

## Running the App

Development:

```bash
npm run start
```

Run unit tests:

```bash
npm run test
```

## Authentication

Uses JWT for protected routes.

Include token in request headers:

```bash
Authorization: Bearer <token>
```
