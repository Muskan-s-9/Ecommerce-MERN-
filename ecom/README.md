
A full-stack shopping cart application built for E Commerce screening.

## Features

-  Add/Remove items from cart
-  Update item quantities
-  Calculate totals
-  Mock checkout (no real payments)
-  Responsive UI
-  RESTful API
-  Database integration (SQLite/MongoDB)

## Tech Stack

- **Frontend**: React 18
- **Backend**: Node.js + Express
- **Database**: SQLite (default) or MongoDB

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional, defaults work):
```
PORT=5000
DB_TYPE=sqlite
MONGODB_URI=mongodb://localhost:27017/ecommerce
```

4. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Cart
- `GET /api/cart` - Get all cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `POST /api/cart/checkout` - Mock checkout (clears cart)

## Database

By default, the app uses SQLite which creates a local database file (`ecommerce.db`). The database is automatically initialized with sample products on first run.

To use MongoDB instead, set `DB_TYPE=mongodb` in the `.env` file and ensure MongoDB is running.

## Project Structure

```
ecom/
├── backend/          # Express API server
│   ├── config/       # Database configuration
│   ├── models/       # Data models
│   ├── routes/       # API routes
│   └── server.js     # Server entry point
├── frontend/         # React application
│   ├── public/       # Public assets
│   └── src/          # Source code
│       ├── components/  # React components
│       ├── services/    # API services
│       └── styles/      # CSS styles
└── README.md
```

## Testing the Application

1. Start both backend and frontend servers
2. Browse products and add items to cart
3. Update quantities or remove items
4. Proceed to checkout (mock - no real payment)
5. Fill in the checkout form and place order

## Notes

- This is a mock implementation for screening purposes
- No real payment processing
- Cart data persists in database
- Checkout clears the cart


