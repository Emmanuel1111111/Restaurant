# Restaurant Delivery Backend Setup Guide

## Overview
Complete Node.js + Express + MongoDB backend for restaurant delivery app with full API endpoints.

## Prerequisites
- Node.js v20+ and npm
- MongoDB Atlas account (free tier available)
- Paystack account (for Ghana payments)
- Hubtel account (for Ghana SMS)

## Installation

### 1. Clone and Install Dependencies
\`\`\`bash
cd backend
npm install
\`\`\`

### 2. Configure Environment Variables
Create `.env` file in backend root:

\`\`\`env
# Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurant-delivery?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Paystack (Ghana)
PAYSTACK_SECRET_KEY=sk_test_xxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxx

# Hubtel SMS (Ghana)
HUBTEL_CLIENT_ID=your_client_id
HUBTEL_CLIENT_SECRET=your_client_secret
HUBTEL_FROM=RestaurantName

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret
\`\`\`

### 3. Seed Database
\`\`\`bash
npm run seed
\`\`\`

This creates:
- Menu categories and items
- Staff user account
- Restaurant settings

### 4. Start Backend
\`\`\`bash
npm run dev
\`\`\`

Server runs on http://localhost:5000

## API Endpoints

### Authentication
- POST `/api/auth/send-otp` - Send OTP to phone
- POST `/api/auth/verify-otp` - Verify OTP and login
- GET `/api/auth/me` - Get current user
- PUT `/api/auth/profile` - Update profile

### Menu (Public)
- GET `/api/menu` - Get all categories and items
- GET `/api/menu/item/:id` - Get item details
- GET `/api/menu/search?q=search_term` - Search items

### Menu Management (Staff Only)
- POST `/api/menu/category` - Create category
- PUT `/api/menu/category/:id` - Update category
- DELETE `/api/menu/category/:id` - Delete category
- POST `/api/menu/item` - Create item
- PUT `/api/menu/item/:id` - Update item
- DELETE `/api/menu/item/:id` - Delete item
- PATCH `/api/menu/item/:id/toggle` - Toggle availability

### Cart (MongoDB Backed)
- POST `/api/cart/add` - Add item to cart
- GET `/api/cart` - Get user's cart
- PUT `/api/cart/item/:itemId` - Update quantity
- DELETE `/api/cart/item/:itemId` - Remove from cart
- DELETE `/api/cart/clear` - Clear entire cart

### Orders
- POST `/api/orders` - Create order (from cart)
- GET `/api/orders/my-orders` - Get user's orders
- GET `/api/orders/:id` - Get order details
- POST `/api/orders/:id/rate` - Rate order

### Orders Management (Staff Only)
- GET `/api/orders` - Get all orders
- PUT `/api/orders/:id/status` - Update order status
- PUT `/api/orders/:id/cancel` - Cancel order
- GET `/api/orders/stats/summary` - Get statistics

### Payments
- POST `/api/payment/initialize` - Initialize Paystack payment
- GET `/api/payment/verify/:reference` - Verify payment
- POST `/api/payment/webhook` - Paystack webhook

### Settings
- GET `/api/settings` - Get restaurant settings
- PUT `/api/settings` - Update settings (Staff only)
- PATCH `/api/settings/toggle-orders` - Toggle order acceptance (Staff only)

## Database Models

### User
- Phone (unique, required)
- Name
- Email
- Role (customer, staff, driver)
- OTP (code + expiry)

### Cart
- User ID
- Items (with quantity, add-ons, subtotal)
- Timestamps

### Order
- Customer ID
- Items (with prices, add-ons)
- Delivery address & instructions
- Payment method & status
- Order status timeline
- Driver ID
- Timestamps

### MenuItem
- Category ID
- Name, Description, Price
- Image URL
- Add-ons
- Availability & popularity flags
- Order count

### MenuCategory
- Name, Description
- Display order
- Active flag

### Settings
- Restaurant info
- Delivery settings
- Operating hours

## Testing Endpoints

### 1. Send OTP
\`\`\`bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "0244123456"}'
\`\`\`

### 2. Get Menu
\`\`\`bash
curl http://localhost:5000/api/menu
\`\`\`

### 3. Get Settings
\`\`\`bash
curl http://localhost:5000/api/settings
\`\`\`

## Deployment

1. Update .env with production MongoDB URI
2. Set NODE_ENV=production
3. Deploy to DigitalOcean/Heroku/Railway
4. Use process manager like PM2

\`\`\`bash
npm install -g pm2
pm2 start src/index.js --name "restaurant-api"
pm2 startup
pm2 save
\`\`\`

## Troubleshooting

**MongoDB Connection Error**
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas

**SMS Not Sending**
- Verify Hubtel credentials
- Check phone number format (should be 233XXXXXXXXX)

**Payment Errors**
- Use Paystack test credentials
- Check amount is in Ghana Cedis

## Support
For issues, check logs: `npm run dev` shows all errors in real-time
