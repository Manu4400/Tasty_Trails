# TastyTrails

TastyTrails is a full-stack food ordering web application with admin and user roles, built with React (frontend) and Node.js/Express/MySQL (backend).

## Features
- User registration and login (JWT authentication)
- Admin and user roles
- Browse and search food menu
- Add to cart and place orders
- Admin can add new food items
- Persistent login and secure API

## Project Structure
```
TastyTrails-master/
  backend/        # Node.js/Express backend
  frontend/       # React frontend
```

## Prerequisites
- Node.js (v14+ recommended)
- npm
- MySQL

## Database Setup

### Create Tables

#### `users` Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user'
);
```
- **id**: Unique user ID (auto-incremented)
- **name**: User's name
- **email**: User's email (must be unique)
- **password**: Hashed password (bcrypt)
- **role**: User role (`user` or `admin`)

#### `food` Table
```sql
CREATE TABLE food (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(255),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
- **id**: Unique food item ID (auto-incremented)
- **name**: Name of the food item
- **description**: Description of the food item
- **price**: Price of the food item
- **image**: Path to the image (e.g., `food_images/food_1.png`)
- **category**: Category (e.g., Salad, Rolls, etc.)
- **created_at**: Timestamp when the item was added

## Setup Instructions

### 1. Clone the Repository
```
git clone <repo-url>
cd TastyTrails-master
```

### 2. Backend Setup
```
cd backend
npm install
```
- Create a MySQL database named `food_delivery_db`.
- Import or create the required tables (`users`, `food`).
- Update `backend/db.js` with your MySQL credentials if needed.

#### Start the backend server:
```
npm start
```
- The backend runs on [http://localhost:4000](http://localhost:4000)

### 3. Frontend Setup
```
cd ../frontend
npm install
```
#### Start the frontend app:
```
npm start
```
- The frontend runs on [http://localhost:3000](http://localhost:3000)

### 4. Food Images
- Place all food images in `frontend/public/food_images/`.
- Image paths in the database should be like `food_images/food_1.png`.

## Usage
- Register as a user or log in as admin (`admin@example.com` or your admin user).
- Admins can add new food items from the navbar.
- Users can browse, add to cart, and place orders.

## Security Notes
- JWT tokens are used for authentication and stored in localStorage.
- Admin-only features are protected both in frontend and backend.

## Customization
- Update styles in `frontend/src` as needed.
- Extend backend API for more features (orders, reviews, etc).

## License
MIT 