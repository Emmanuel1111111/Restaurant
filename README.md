# Restaurant Delivery App - Customer App

A fully-featured React Native food delivery application for Ghana with OTP authentication, menu browsing, cart management, and real-time order tracking.

## Features

### Authentication
- Phone-based OTP login (SMS via Hubtel)
- Secure token management
- User profile management

### Menu & Browsing
- Browse restaurants menu by categories
- Search for menu items
- View detailed product information
- Add-ons/customizations support
- Popular items highlighting

### Shopping Cart
- Add items to cart with customizations
- Quantity management
- Real-time price calculations
- Cart persistence (local storage)
- Clear all functionality

### Checkout
- Multiple payment methods (Mobile Money, Card, Cash)
- Delivery address input
- Special instructions
- Order summary
- Minimum order validation

### Order Management
- View order history
- Real-time order status tracking
- Visual timeline of order progress
- Itemized order details
- Delivery address tracking
- Rate delivered orders

### User Profile
- View and edit personal information
- Profile picture support
- Settings menu
- Help & support
- Logout functionality

## Project Structure

\`\`\`
src/
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.js
│   │   └── OTPScreen.js
│   ├── menu/
│   │   ├── MenuScreen.js
│   │   ├── MenuItemScreen.js
│   │   └── CartScreen.js
│   ├── checkout/
│   │   └── CheckoutScreen.js
│   ├── orders/
│   │   ├── OrdersScreen.js
│   │   └── OrderTrackingScreen.js
│   └── profile/
│       └── ProfileScreen.js
├── components/
│   ├── MenuItemCard.js
│   ├── CartItem.js
│   ├── OrderCard.js
│   ├── StatusBadge.js
│   └── CategoryTab.js
├── context/
│   ├── AuthContext.js
│   └── CartContext.js
├── services/
│   └── api.js
├── utils/
│   ├── constants.js
│   └── helpers.js
├── navigation/
│   └── AppNavigator.js
└── App.js
\`\`\`

## Setup Instructions

### Prerequisites
- Node.js 20+ 
- npm or yarn
- React Native CLI
- Android Studio (for Android) or Xcode (for iOS)
- MongoDB running locally or MongoDB Atlas URI

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables

Create `.env` file in the project root:

\`\`\`env
API_URL=http://localhost:5000/api
ENVIRONMENT=development
PAYSTACK_PUBLIC_KEY=pk_test_your_key_here
\`\`\`

### 3. Start Backend Server

Make sure the backend API is running on port 5000:

\`\`\`bash
cd ../backend
npm install
npm run seed  # Seed database with sample data
npm run dev   # Start development server
\`\`\`

### 4. Run the App

**For Android:**
\`\`\`bash
npx react-native run-android
\`\`\`

**For iOS:**
\`\`\`bash
npx react-native run-ios
\`\`\`

**For Web (if using Expo):**
\`\`\`bash
npm start -- --web
\`\`\`

## Testing the App

### Test Flow

1. **Login**
   - Enter phone: 024 412 3456 (or any valid phone)
   - Backend will send OTP via SMS
   - Enter OTP: 123456 (default from seed)

2. **Browse Menu**
   - View categories (Appetizers, Main Course, Drinks, Desserts)
   - Browse items with images and prices
   - Search for specific items

3. **Add to Cart**
   - Click item to see details
   - Add customizations (extra sauce, etc.)
   - Adjust quantity
   - Add to cart

4. **Checkout**
   - Review cart items
   - Enter delivery address
   - Select payment method
   - Place order

5. **Track Order**
   - View orders in "My Orders"
   - See real-time status updates
   - Track delivery progress

6. **Profile**
   - Edit name and email
   - View order history
   - Access settings

## API Integration

The app communicates with the backend API at `http://localhost:5000/api`:

### Authentication Endpoints
- `POST /auth/send-otp` - Send OTP to phone
- `POST /auth/verify-otp` - Verify OTP and login
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update profile

### Menu Endpoints
- `GET /menu` - Get all categories and items
- `GET /menu/item/:id` - Get single item details
- `GET /menu/search?q=query` - Search items

### Order Endpoints
- `POST /orders` - Create new order
- `GET /orders/my-orders` - Get user's orders
- `GET /orders/:id` - Get order details
- `POST /orders/:id/rate` - Rate an order

### Payment Endpoints
- `POST /payment/initialize` - Initialize Paystack payment
- `GET /payment/verify/:reference` - Verify payment

## State Management

### AuthContext
Manages user authentication and profile:
- User data
- Login/logout
- OTP request and verification
- Token management
- Profile updates

### CartContext
Manages shopping cart:
- Cart items with quantities
- Add/remove items
- Update quantities
- Calculate totals
- Persistent storage

## UI Components

All components follow the design system:
- **Colors**: Primary orange (#FF6B35), Secondary blue (#004E89)
- **Typography**: Clear hierarchy with multiple font weights
- **Spacing**: Consistent 4px, 8px, 12px, 16px, 20px, 24px, 32px scale
- **Icons**: Ionicons for consistent iconography

## Styling

The app uses React Native StyleSheet for performance and ThemedStyle for consistency.

### Color System
\`\`\`
PRIMARY: #FF6B35 (Orange)
SECONDARY: #004E89 (Blue)
SUCCESS: #06A77D (Green)
WARNING: #F77F00 (Amber)
DANGER: #E63946 (Red)
LIGHT: #F5F5F5 (Light Gray)
DARK: #222222 (Dark)
\`\`\`

## Error Handling

All screens include:
- Try-catch blocks for API calls
- User-friendly error messages via Alert
- Loading states with ActivityIndicators
- Network error handling
- Validation feedback

## Performance Optimization

- Lazy loading of images
- SectionList for efficient rendering
- FlatList with keyExtractor optimization
- Context API for state management (no Redux bloat)
- AsyncStorage for persistent data
- Axios interceptors for efficient API calls

## Known Limitations

- Phone verification requires Hubtel SMS service configured
- Paystack payment integration requires live keys
- Maps/location features not yet implemented
- Push notifications require Firebase setup

## Dependencies

- `@react-navigation/*` - Navigation
- `axios` - HTTP client
- `@react-native-async-storage/async-storage` - Local storage
- `react-native-vector-icons` - Icons
- Express, MongoDB, Paystack (backend)

## Support & Troubleshooting

### App won't connect to API
- Ensure backend is running on port 5000
- Check API_URL in .env file
- Verify network connectivity
- Check firewall settings

### OTP not received
- Ensure Hubtel SMS service is configured
- Check phone number format
- Verify SMS service credentials

### Images not loading
- Check image URLs in database
- Verify Cloudinary credentials if using image upload
- Check network connectivity

## Development Notes

- App uses React Native with Expo CLI support
- All screens are functional components with hooks
- State management via Context API
- Navigation via React Navigation (v6)
- Axios for API calls with interceptors
- AsyncStorage for persistence

## Future Enhancements

- Real-time notifications (Firebase)
- Google Maps integration
- Favorite items
- Referral system
- Payment history
- Multiple delivery addresses
- Live order tracking with driver location
- Chat with support
- Ratings and reviews

## License

MIT

---

For backend setup, see `../backend/README.md`
  
