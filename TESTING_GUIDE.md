# Testing Guide - Customer App

## Environment Setup

### Backend Requirements
1. MongoDB running (local or Atlas)
2. Node.js backend running on port 5000
3. Seed data loaded into database

### Mobile App Requirements
1. React Native development environment
2. Android emulator or iOS simulator
3. .env file configured

## Test Scenarios

### 1. Authentication Flow

**Objective:** Test phone-based OTP login

**Steps:**
1. Open app (should show LoginScreen)
2. Enter phone: `0244123456`
3. Click "Send OTP"
4. Observe SMS sent notification
5. Enter OTP: `123456`
6. Click "Verify OTP"
7. Should navigate to Menu screen
8. Check user data in auth context

**Expected Results:**
- OTP sent successfully
- Valid OTP accepted
- Invalid OTP rejected
- User logged in with token stored
- Navigation to authenticated screens

**Test Data:**
- Phone: +233244123456
- OTP: 123456 (default)
- Username: Test User

---

### 2. Menu Browsing

**Objective:** Test menu display and navigation

**Steps:**
1. Logged in on MenuScreen
2. Observe category tabs (Appetizers, Main Course, Drinks, Desserts)
3. Tap category to filter items
4. Tap "All" to show all items
5. Scroll through menu items
6. Search for "Jollof" in search bar
7. Tap menu item to view details

**Expected Results:**
- All categories load correctly
- Category filtering works
- Search filters items
- Item details screen shows all info
- Images load properly
- Prices display correctly

**Test Data:**
- Appetizers: Spring Rolls, Chicken Wings
- Main Course: Jollof Rice, Banku, Waakye
- Drinks: Coconut Water, Sobolo, Fresh Juice
- Desserts: Ice Cream

---

### 3. Add to Cart

**Objective:** Test cart functionality

**Steps:**
1. Tap menu item to view details
2. View item customization options
3. Select add-ons (Extra Sauce, Extra Spicy)
4. Adjust quantity (1, 2, 3)
5. Click "Add to Cart"
6. Tap cart icon to view cart
7. Verify item appears with correct price
8. Add more items to cart
9. Verify cart count updates

**Expected Results:**
- Add-ons selection works
- Price updates with add-ons
- Quantity can be changed
- Cart updates in real-time
- Cart count badge shows correct number
- Cart persists on app reload

**Test Cases:**
- Add item without add-ons: ✓
- Add item with add-ons: ✓
- Update quantity: ✓
- Remove from cart: ✓
- Clear cart: ✓

---

### 4. Checkout Flow

**Objective:** Test order creation

**Steps:**
1. Go to Cart screen
2. Verify items and total
3. Proceed to Checkout
4. Enter delivery address: "East Legon, Accra"
5. Add delivery instructions: "Ring bell twice"
6. Select payment method: Cash on Delivery
7. Click "Place Order"
8. Observe order confirmation
9. Check order in My Orders

**Expected Results:**
- Order summary displays correctly
- Subtotal + delivery fee = total
- Address validation works
- Payment method selection works
- Order created successfully
- Order appears in order history
- Order number displayed

**Test Cases:**
- Minimum order validation: ✓
- Invalid address: ✓
- Different payment methods: ✓
- Order success confirmation: ✓

---

### 5. Order Tracking

**Objective:** Test order status and tracking

**Steps:**
1. Go to "My Orders" tab
2. View list of orders
3. Filter by status (Pending, Ready, Delivered)
4. Tap order to see details
5. Observe order progress timeline
6. View order items
7. View delivery address
8. View payment summary

**Expected Results:**
- Order list displays all orders
- Status filters work
- Order details show all information
- Timeline shows correct progress
- Items displayed with prices
- Delivery address shown
- Payment breakdown correct

**Test Data:**
- Order statuses: pending, confirmed, ready, delivered
- Timeline shows: Order Placed → Confirmed → Preparing → Ready → Delivered

---

### 6. User Profile

**Objective:** Test profile management

**Steps:**
1. Go to Profile tab
2. View user information
3. Click edit button
4. Change name to "John Doe"
5. Enter email: "john@example.com"
6. Click "Save Changes"
7. Verify changes saved
8. Click logout
9. Verify redirected to login

**Expected Results:**
- Profile information displays
- Edit mode activates
- Changes save successfully
- Profile updates reflected
- Logout clears session
- Redirects to login screen

---

### 7. Error Handling

**Objective:** Test error scenarios

**Test Cases:**

A. **Network Error**
- Disable internet
- Try to fetch menu
- Observe error handling
- Check error message
- Expected: Clear error message, retry option

B. **Invalid Input**
- Enter invalid phone number
- Try to submit empty address
- Try to send OTP with invalid phone
- Expected: Validation messages, form rejected

C. **API Timeout**
- Slow network
- Long loading times
- Expected: Loading state, timeout handling

D. **Server Error**
- API returns error
- Invalid token
- Expected: User-friendly error, logout if needed

---

### 8. Performance Testing

**Objective:** Test app performance

**Test Cases:**

A. **Large Data**
- Load menu with 100+ items
- Scroll smoothly
- Expected: No lag, smooth scrolling

B. **Image Loading**
- Load images from URLs
- Check image quality
- Expected: Images load properly

C. **Cart Updates**
- Add 20+ items to cart
- Update quantities
- Expected: Quick updates, no freezing

D. **Memory Usage**
- Monitor memory while using app
- Expected: < 200MB RAM usage

---

## Manual Test Checklist

- [ ] Login with phone and OTP
- [ ] View all menu categories
- [ ] Add items to cart
- [ ] Apply add-ons to items
- [ ] Update item quantity
- [ ] Remove items from cart
- [ ] Clear entire cart
- [ ] Proceed to checkout
- [ ] Enter delivery address
- [ ] Select payment method
- [ ] Place order successfully
- [ ] View order in My Orders
- [ ] Track order status
- [ ] View order details
- [ ] Update user profile
- [ ] Change name/email
- [ ] Logout and re-login
- [ ] Search menu items
- [ ] Filter by category
- [ ] View item details
- [ ] See price calculations
- [ ] Handle network errors
- [ ] Validate form inputs
- [ ] Check loading states
- [ ] Verify data persistence

## Automated Testing (Future)

\`\`\`javascript
// Example Jest test
describe('CartContext', () => {
  test('adds item to cart', () => {
    const { addToCart, cart } = useCart();
    addToCart(mockItem, 1, []);
    expect(cart).toHaveLength(1);
  });
});
\`\`\`

## Performance Metrics

Target metrics:
- App startup: < 3 seconds
- Menu load: < 2 seconds
- Cart update: < 500ms
- Checkout submit: < 3 seconds
- Memory usage: < 200MB

---

## Debugging

### Enable Debugging
\`\`\`javascript
// In App.js
console.log('[v0] Debug logs enabled');
\`\`\`

### Check Network Requests
- Open React Native Debugger
- Monitor network tab
- Verify API calls

### Check Local Storage
\`\`\`javascript
import AsyncStorage from '@react-native-async-storage/async-storage';
// Inspect stored data
AsyncStorage.getAllKeys().then(keys => console.log(keys));
\`\`\`

---

## Deployment Checklist

Before deploying to production:

- [ ] Remove debug logs
- [ ] Update API_URL to production
- [ ] Set correct Paystack keys
- [ ] Test all authentication flows
- [ ] Verify all API endpoints working
- [ ] Test on actual devices
- [ ] Check iOS and Android builds
- [ ] Verify push notifications
- [ ] Load test with multiple users
- [ ] Security audit
- [ ] Privacy policy updated
- [ ] Terms of service ready
