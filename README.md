# E-Commerce Web Application

A full-stack e-commerce application built with **Spring Boot** and **React.js**, featuring product management, shopping cart, keyword search, and role-based access control using **Spring Security**.

---

## Features

- **Authentication** — Register and login with HTTP Basic Auth backed by Spring Security and BCrypt password hashing
- **Role-based access** — Admin can add, update, and delete products; Users can browse and shop
- **Product catalog** — Browse products with images, descriptions, pricing, and stock availability
- **Keyword search** — Search across product name, brand, description, and category
- **Category filter** — Filter products by Laptop, Mobile, Electronics, Headphone, Toys, Fashion
- **Shopping cart** — Add/remove products, persistent across page refreshes via localStorage
- **Product management** — Admin can add products with images, update details, and delete listings
- **Dark/Light theme** — Toggle between themes, preference saved locally

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 21, Spring Boot 3.5, Spring Security, Spring Data JPA |
| Frontend | React 18, Vite, Axios, Bootstrap 5 |
| Database | H2 (file-based, persists across restarts) |
| Auth | HTTP Basic Auth, BCrypt, Role-based authorization |
| Build | Maven |

---

## Running Locally

### Prerequisites
- Java 21
- Node.js 
- Maven

### Backend

```bash
cd ecommerce-backend
./mvnw spring-boot:run
```

Backend runs on `http://localhost:8080`

### Frontend

```bash
cd ecommerce-frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Default Credentials

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `admin123` |
| User | `user` | `user123` |

> **First time setup:** Log in as `admin` and add a few products with images to populate the catalog. The app uses a local file-based H2 database — data persists across restarts on your machine.

---

## Project Structure

```
ecommerce-app/
├── ecommerce-backend/
│   └── src/main/java/com/avisek/app/e_com_project/
│       ├── config/          # SecurityConfig, CorsConfig, DataSeeder
│       ├── controller/      # ProductController, AuthController
│       ├── model/           # Product, User
│       ├── repo/            # ProductRepo, UserRepo
│       └── service/         # ProductService, UserDetailsServiceImpl
└── ecommerce-frontend/
    └── src/
        ├── components/      # Home, Navbar, Product, Cart, AddProduct, Login...
        ├── Context/         # AppContext (cart state, product data)
        └── axios.jsx        # Axios instance with Basic Auth interceptor
```

---

## Security Design

- **HTTP Basic Auth** — credentials sent as `Base64(username:password)` on every request via Axios interceptor
- **Stateless sessions** — `SessionCreationPolicy.STATELESS`, no server-side session state
- **BCrypt** — passwords hashed before storage, never stored in plaintext
- **Role-based rules:**
  - `GET /api/products/**` — public
  - `POST/PUT/DELETE /api/product` — `ROLE_ADMIN` only
  - All other endpoints — authenticated users only
- **Auto logout** — 401 response from server clears credentials and redirects to login

---
