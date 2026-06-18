# Karan Homeo Pharmacy

## Overview
`Karan Homeo Pharmacy` is a **full‑stack e‑commerce platform** for a homeopathic pharmacy. The repository is split into three independent Vite/React front‑ends (admin, frontend) and a **Node.js/Express** API that powers both UIs.

The project follows a **micro‑frontend** architecture: each UI has its own build pipeline, `package.json`, and deployment configuration, while sharing a common backend API.

## Table of Contents
1. [Project Structure](#project-structure)
2. [Backend API](#backend-api)
   - [Tech Stack](#backend-tech-stack)
   - [Authentication](#authentication-endpoints)
   - [Products](#product-endpoints)
   - [Orders](#order-endpoints)
   - [Admin](#admin-endpoints)
   - [File Upload](#file-upload-endpoint)
   - [Error Handling & CORS](#error-handling)
3. [Admin UI](#admin-ui)
   - [Tech Stack](#admin-tech-stack)
   - [Pages & Features](#admin-pages)
4. [Frontend (Customer)](#frontend-customer)
   - [Tech Stack](#frontend-tech-stack)
   - [Pages & Features](#frontend-pages)
5. [Getting Started](#getting-started)
6. [Deployment](#deployment)
7. [Testing](#testing)
8. [Contributing](#contributing)
9. [License](#license)

## Project Structure
```
karan_homeo_pharmacy/
├─ admin/          # Admin UI – manage inventory, orders, users
├─ backend/        # Express API – authentication, CRUD, uploads
├─ frontend/       # Customer UI – product catalog, cart, checkout
└─ README.md
```

## Backend API
All API routes are prefixed with `/api` and are served by the Express app in `backend/index.js`.

### Backend Tech Stack
| Layer | Technology | Purpose |
|-------|------------|---------|
| Server | Node.js + Express | HTTP server & routing |
| Database | MongoDB (Mongoose) | Persistent storage |
| Auth | JWT (jsonwebtoken) | Secure authentication |
| File Upload | Multer + Cloudinary | Image handling |
| Validation | express-validator | Request validation |
| Logging | Winston / Morgan | Request & error logging |

### Authentication Endpoints
| Method | Path | Description | Request Body | Response |
|--------|------|-------------|--------------|----------|
| POST | `/api/auth/register` | Register a new user | `fullName`, `name`, `email`, `password`, `userType`, `studentType` | `201 Created` with user data & JWT |
| POST | `/api/auth/login` | Login existing user | `email`, `password` | `200 OK` with user data & JWT |
| GET | `/api/auth/profile` | Get current user profile (protected) | – | `200 OK` with user data |
| PUT | `/api/auth/profile` | Update user profile (protected) | `name`, `email`, `password`, `userType`, `studentType` | `200 OK` with updated data & new JWT |

### Product Endpoints
| Method | Path | Description | Request Body | Response |
|--------|------|-------------|--------------|----------|
| GET | `/api/products` | List all products (public) | – | `200 OK` array of products |
| GET | `/api/products/:id` | Get product details | – | `200 OK` product object |
| POST | `/api/products` | Create product (admin) | `name`, `description`, `price`, `stock`, `category`, `image` | `201 Created` product |
| PUT | `/api/products/:id` | Update product (admin) | `name?`, `description?`, `price?`, `stock?`, `category?`, `image?` | `200 OK` updated product |
| DELETE | `/api/products/:id` | Delete product (admin) | – | `200 OK` with message |
| GET | `/api/products/admin/all` | List all products for admin (admin only) | – | `200 OK` array |

### Order Endpoints
| Method | Path | Description | Request Body | Response |
|--------|------|-------------|--------------|----------|
| POST | `/api/orders` | Create new order (protected) | `items[]`, `total`, `shippingAddress` | `201 Created` order |
| GET | `/api/orders/myorders` | Get current user orders (protected) | – | `200 OK` array |
| GET | `/api/orders/:id` | Get order details (protected) | – | `200 OK` order |
| PUT | `/api/orders/:id/pay` | Mark order as paid (protected) | – | `200 OK` updated order |
| GET | `/api/orders/admin/all` | List all orders (admin) | – | `200 OK` array |
| GET | `/api/orders/admin/stats` | Order statistics (admin) | – | `200 OK` stats object |
| PUT | `/api/orders/admin/:id/status` | Update order status (admin) | `status` | `200 OK` updated order |
| DELETE | `/api/orders/admin/:id` | Delete order (admin) | – | `200 OK` with message |

### Admin Endpoints
| Method | Path | Description | Request Body | Response |
|--------|------|-------------|--------------|----------|
| GET | `/api/admin/dashboard` | Dashboard statistics (admin) | – | `200 OK` stats |
| GET | `/api/admin/users` | List all users (admin) | – | `200 OK` array |
| GET | `/api/admin/users/:id` | Get user details (admin) | – | `200 OK` user |
| PUT | `/api/admin/users/:id` | Update user (admin) | `name?`, `email?`, `role?`, `userType?`, `studentType?` | `200 OK` updated user |
| DELETE | `/api/admin/users/:id` | Delete user (admin) | – | `200 OK` with message |

### File Upload Endpoint
| Method | Path | Description | Request Body | Response |
|--------|------|-------------|--------------|----------|
| POST | `/api/upload` | Upload image to Cloudinary | `file` (multipart/form-data) | `200 OK` with `url` |

### Error Handling & CORS
All errors are passed to the centralized `error.js` middleware which returns a JSON payload:
```json
{ "success": false, "error": "Error message" }
```
CORS is configured to allow requests from the frontend origins (`http://localhost:5174` during dev).

## Admin UI
The admin dashboard is a **React + Vite + Tailwind** application that consumes the backend API. It provides staff with tools to manage inventory, orders, and users.

### Admin Tech Stack
| Tool | Purpose |
|------|---------|
| React | UI components |
| Vite | Build tool |
| Tailwind CSS | Utility‑first styling |
| React Router | Client‑side routing |
| Axios | HTTP client |
| Context API | Global state (auth, notifications) |

### Admin Pages & Features
| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/dashboard` | Overview of sales, orders, inventory |
| Orders | `/orders` | List all orders, filter, update status |
| Products | `/products` | CRUD product list, image upload |
| Users | `/users` | Manage staff and customer accounts |
| Login | `/login` | Admin login page |

All admin routes are protected by JWT; the `AuthContext` stores the token and redirects unauthenticated users to `/login`.

## Frontend (Customer)
The customer storefront is also a **React + Vite + Tailwind** application. It provides a smooth shopping experience for end‑users.

### Frontend Tech Stack
| Tool | Purpose |
|------|---------|
| React | UI components |
| Vite | Build tool |
| Tailwind CSS | Styling |
| React Router | Routing |
| Axios | API calls |
| Context API | Cart, auth, global state |
| PerformanceMonitor | Custom component for performance metrics |

### Frontend Pages & Features
| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Featured products, categories |
| Products | `/products` | Paginated list, filters, sorting |
| Product Details | `/products/:id` | Full description, images, reviews |
| Cart | `/cart` | Add/remove items, quantity updates |
| Checkout | `/checkout` | Shipping, payment (placeholder) |
| Login | `/login` | User login |
| Register | `/register` | User registration |
| Profile | `/profile` | View & edit user profile |
| Order History | `/order-history` | View past orders |
| Order Confirmation | `/order-confirmation/:id` | Confirmation after checkout |
| Not Found | `*` | 404 page |

The `AuthContext` manages authentication state and exposes `login`, `logout`, and `register` helpers. The `storeContext` holds cart items and provides `addToCart`, `removeFromCart`, and `clearCart` actions.

## Getting Started
### Prerequisites
* **Node.js** v20+ (LTS)
* **npm** (comes with Node)
* **MongoDB** instance (local or Atlas)
* **Cloudinary** account (for image uploads)

### Installation & Run
```bash
# Clone the repository
git clone <repo-url>
cd karan_homeo_pharmacy

# Backend
cd backend
npm install
cp .env.example .env   # edit with your MongoDB URI, Cloudinary creds, JWT secret
npm run dev

# Admin UI
cd ../admin
npm install
npm run dev

# Frontend
cd ../frontend
npm install
npm run dev
```

Each sub‑project runs on its own port (default Vite dev server ports: 5173 for admin, 5174 for frontend, 3000 for backend). Adjust `vercel.json` or `vite.config.js` if you need custom ports.

## Deployment
* **Vercel** – Each folder has a `vercel.json`. Deploy by linking the folder to a Vercel project.
* **Docker** – Build images for backend and each UI; run with Docker Compose.
* **Heroku / Render** – Use the `Procfile` or `start` scripts in `package.json`.

## Testing
* **Backend** – Jest + Supertest (look in `backend/tests/`).
* **Frontend** – React Testing Library + Jest (look in `frontend/src/__tests__/`).
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd ../frontend
npm test
```

## Contributing
1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/xyz`).
3. Run linting and tests (`npm run lint`, `npm test`).
4. Submit a pull request with a clear description.

Please follow the existing coding style and add tests for new features.

## License
MIT © 2026