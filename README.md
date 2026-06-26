# RentEase

Furniture & appliance rental platform — full-stack app with React (Vite) frontend and Node.js/Express/MongoDB backend.

## Project structure

```
RentEase/
├── client/     # React frontend (Vite + Redux + Tailwind)
└── server/     # Express API + MongoDB
```

## Setup

### 1. Backend

```bash
cd server
cp .env.example .env   # fill in MongoDB URI and JWT secrets
npm install
npm run dev            # runs on http://localhost:8000
```

### 2. Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev            # runs on http://localhost:5173
```

## Features

| Feature | Status |
|---------|--------|
| Browse products (category, city, pagination) | Done |
| Product detail + rental request | Done |
| User auth (register, login, logout) | Done |
| My Rentals (list, cancel pending) | Done |
| My Orders (list, cancel pending) | Done |
| Profile (edit info, address, password) | Done |
| Admin dashboard | Not yet |

## API

- Base URL: `http://localhost:8000/api/v1`
- Swagger docs (dev): `http://localhost:8000/api/docs`

## Tech stack

- **Frontend:** React 19, Vite, Redux Toolkit, Tailwind CSS, React Router
- **Backend:** Express 5, MongoDB/Mongoose, JWT auth, Joi validation
