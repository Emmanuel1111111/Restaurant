# MongoDB Cloud Setup Guide

## Production Ready Cart System

This restaurant delivery app now uses MongoDB Cloud (Atlas) for storing cart data, ensuring:
- **Data Persistence** - Cart data survives app restarts
- **Cross-Device Sync** - Access cart from any device
- **Scalability** - Handle unlimited users
- **Security** - Data encrypted in transit and at rest

## Prerequisites

- MongoDB Atlas Account (free tier available)
- Node.js 16+ installed
- Your MongoDB URI connection string

## Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign Up" and create a free account
3. Create a free shared cluster (M0 - no credit card required)
4. Configure network access and create database user
5. Get your connection string

## Step 2: Set Environment Variables

Update your `.env` file with your MongoDB URI:

\`\`\`
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurant-delivery?retryWrites=true&w=majority

# Other settings remain the same
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-key
\`\`\`

## Step 3: Collections Created Automatically

The app will create these MongoDB collections:

### Users Collection
\`\`\`javascript
{
  phone: String (required, unique),
  name: String,
  email: String,
  role: String (customer, staff, driver),
  otp: { code: String, expiresAt: Date },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### Carts Collection (NEW)
\`\`\`javascript
{
  customer: ObjectId (reference to User),
  items: [{
    menuItem: ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    addOns: [{ name: String, price: Number }],
    subtotal: Number
  }],
  subtotal: Number,
  deliveryFee: Number,
  total: Number,
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

### MenuCategories & MenuItems Collections
- Store restaurant menu structure
- Automatic syncing with app

### Orders Collection
- Store all customer orders
- Links to carts for historical reference

## Step 4: API Endpoints for Cart

All cart operations require authentication (Bearer token).

### Get Cart
\`\`\`
GET /api/cart
Header: Authorization: Bearer {token}
Response: { success: true, cart: { items: [...], total: 100 } }
\`\`\`

### Add Item to Cart
\`\`\`
POST /api/cart/add
Header: Authorization: Bearer {token}
Body: { 
  menuItemId: "60d5ec49c1234567890abcde",
  quantity: 2,
  selectedAddOns: [{ name: "Extra Cheese", price: 2 }]
}
\`\`\`

### Update Item Quantity
\`\`\`
PUT /api/cart/update
Header: Authorization: Bearer {token}
Body: { itemIndex: 0, quantity: 3 }
\`\`\`

### Remove Item from Cart
\`\`\`
DELETE /api/cart/remove
Header: Authorization: Bearer {token}
Body: { itemIndex: 0 }
\`\`\`

### Clear Cart
\`\`\`
DELETE /api/cart/clear
Header: Authorization: Bearer {token}
\`\`\`

## Step 5: Connect React Native App

Update your `.env` file in the customer app:

\`\`\`
API_URL=http://your-backend-url:5000/api
\`\`\`

For development on local machine:
- Android: `API_URL=http://10.0.2.2:5000/api`
- iOS: `API_URL=http://localhost:5000/api`

## Step 6: Test the Integration

### Test with curl

\`\`\`bash
# 1. Get OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "233244123456"}'

# 2. Verify OTP (use 123456 for test)
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "233244123456", "otp": "123456"}'
# Response includes token

# 3. Get cart
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer {your-token}"

# 4. Add item to cart
curl -X POST http://localhost:5000/api/cart/add \
  -H "Authorization: Bearer {your-token}" \
  -H "Content-Type: application/json" \
  -d '{"menuItemId": "...", "quantity": 2, "selectedAddOns": []}'
\`\`\`

## Troubleshooting

### "Cannot connect to MongoDB"
- Check MONGODB_URI in .env
- Verify network access in Atlas dashboard
- Ensure IP whitelist includes your server

### "Cart not syncing across devices"
- Ensure authentication token is valid
- Check network connectivity
- Verify customer ID is consistent

### "Items disappearing from cart"
- Clear cart is working as expected
- Check browser console for errors
- Verify backend logs for API issues

## Production Checklist

- [ ] Use MongoDB Atlas paid tier for production
- [ ] Enable auto-backup in MongoDB settings
- [ ] Configure IP whitelist for your servers
- [ ] Enable encryption at rest
- [ ] Set up monitoring and alerts
- [ ] Regular backup testing
- [ ] Update Node.js and dependencies
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting on API
- [ ] Set up error logging service (Sentry, etc.)

## Next Steps

1. Deploy backend to DigitalOcean, Heroku, or AWS
2. Update React Native app with production API URL
3. Test complete flow on actual devices
4. Set up CI/CD pipeline for deployments
5. Monitor performance and user feedback
