# Dermstore

Dermstore is a full-stack ecommerce web application for browsing skincare products, managing a cart, placing orders, and handling seller-side product management. The project is split into a React + TypeScript frontend and an Express + MongoDB backend.

## Features

- User registration and login
- Seller registration and login
- Product listing and product detail pages
- Cart management with quantity updates
- Checkout and order placement
- Order history for users
- Seller dashboard for managing products
- Create, edit, and delete seller products
- Persistent frontend state using Redux Persist
- Toast notifications for user feedback

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express
- MongoDB Atlas / MongoDB
- Mongoose
- JWT authentication
- bcryptjs

## Project Structure

```text
Dermstore/
|- backend/
|  |- config/
|  |- controllers/
|  |- middlewares/
|  |- models/
|  |- routes/
|  |- .env
|  |- package.json
|  |- server.js
|- Dermstore/
|  |- public/
|  |- src/
|  |  |- components/
|  |  |- pages/
|  |  |- routes/
|  |  |- store/
|  |  |- types/
|  |  |- utils/
|  |- .env
|  |- package.json
|  |- vite.config.ts
```

## Main Pages

### User Side

- `/` - Home page
- `/product/:id` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/login` - User login
- `/register` - User registration

### Seller Side

- `/seller/login` - Seller login
- `/seller/register` - Seller registration
- `/seller/dashboard` - Seller dashboard
- `/seller/new-product` - Create a new product
- `/seller/edit-product/:id` - Edit an existing product

## API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Seller

- `POST /api/seller/register`
- `POST /api/seller/login`
- `GET /api/seller/dashboard`

### Products

- `GET /api/products`
- `GET /api/products/:id`
- `GET /api/products/me`
- `GET /api/products/mine`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Cart

- `GET /api/cart`
- `POST /api/cart/update`

### Orders

- `POST /api/orders/place`
- `GET /api/orders`
- `GET /api/orders/my-orders`

## Environment Variables

Create a `.env` file inside `backend/` with values similar to:

```env
MONGO_URI=mongodb+srv://yourUsername:yourPassword@your-cluster.mongodb.net/Dermstore?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_jwt_secret
PORT=5000
```

If needed, create a `.env` file inside `Dermstore/` for frontend-specific values:

```env
VITE_API_URL=http://localhost:5000/api
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Dermstore
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Install frontend dependencies

```bash
cd ..\Dermstore
npm install
```

### 4. Start the backend server

From `backend/`:

```bash
npm start
```

For development with nodemon:

```bash
npm run dev
```

### 5. Start the frontend server

From `Dermstore/`:

```bash
npm run dev
```

The frontend will usually run on `http://localhost:5173` and the backend on `http://localhost:5000`.

## Typical User Flow

1. Register or log in as a user.
2. Browse products on the home page.
3. Open a product detail page.
4. Add products to the cart.
5. Go to checkout and enter address details.
6. Place the order.
7. View order history.

## Typical Seller Flow

1. Register or log in as a seller.
2. Open the seller dashboard.
3. Add a new product.
4. Edit existing products.
5. Delete products when needed.

## Notes

- MongoDB Atlas database name should match the exact case already used in the cluster, for example `Dermstore`.
- Seller-authenticated product requests and user-authenticated cart or order requests rely on valid JWT tokens stored in local storage.
- The project currently uses one backend auth middleware for multiple protected flows, which is a good area for future improvement.

## Future Improvements

- Add role-based authorization for users and sellers
- Improve backend validation and error handling
- Add product search and filtering improvements
- Add payment integration
- Add image upload support instead of image URLs only
- Add automated tests
- Improve README screenshots and deployment instructions

## Author

Built as a full-stack Dermstore ecommerce project using React, Express, and MongoDB.
