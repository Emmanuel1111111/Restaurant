require('dotenv').config();
const mongoose = require('mongoose');
const MenuCategory = require('../models/MenuCategory');
const MenuItem = require('../models/MenuItem');
const Settings = require('../models/Settings');
const User = require('../models/User');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await MenuCategory.deleteMany({});
    await MenuItem.deleteMany({});
    await Settings.deleteMany({});
    console.log('  Cleared existing data');

    // Create staff user
    const staff = new User({
      phone: '233500000000',
      name: 'Restaurant Manager',
      email: 'manager@restaurant.com',
      role: 'staff',
    });
    await staff.save();
    console.log('✓ Created staff user');

    // Create categories
    const categories = [
      { name: 'Appetizers', description: 'Start your meal right', displayOrder: 1 },
      { name: 'Main Course', description: 'Our specialty dishes', displayOrder: 2 },
      { name: 'Drinks', description: 'Refresh yourself', displayOrder: 3 },
      { name: 'Desserts', description: 'Sweet endings', displayOrder: 4 },
    ];

    const createdCategories = await MenuCategory.insertMany(categories);
    console.log('✓ Created categories');

    // Create menu items
    const menuItems = [
      // Appetizers
      {
        category: createdCategories[0]._id,
        name: 'Spring Rolls',
        description: 'Crispy vegetable spring rolls with sweet chili sauce',
        price: 15,
        image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783',
        addOns: [
          { name: 'Extra Sauce', price: 2 },
        ],
        isPopular: true,
      },
      {
        category: createdCategories[0]._id,
        name: 'Chicken Wings',
        description: 'Spicy buffalo wings with ranch dip',
        price: 25,
        image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f',
        addOns: [
          { name: 'Extra Spicy', price: 0 },
          { name: 'Extra Ranch', price: 3 },
        ],
      },

      // Main Course
      {
        category: createdCategories[1]._id,
        name: 'Jollof Rice with Chicken',
        description: 'Traditional Ghanaian jollof rice with grilled chicken',
        price: 35,
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
        addOns: [
          { name: 'Extra Chicken', price: 10 },
          { name: 'Fried Plantain', price: 5 },
          { name: 'Salad', price: 5 },
        ],
        isPopular: true,
      },
      {
        category: createdCategories[1]._id,
        name: 'Banku with Tilapia',
        description: 'Fresh tilapia with hot pepper and banku',
        price: 40,
        image: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10',
        addOns: [
          { name: 'Extra Fish', price: 15 },
        ],
      },
      {
        category: createdCategories[1]._id,
        name: 'Waakye',
        description: 'Rice and beans with spaghetti, gari, and protein',
        price: 30,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        addOns: [
          { name: 'Beef', price: 8 },
          { name: 'Fish', price: 10 },
          { name: 'Egg', price: 3 },
        ],
        isPopular: true,
      },

      // Drinks
      {
        category: createdCategories[2]._id,
        name: 'Fresh Coconut Water',
        description: 'Chilled fresh coconut water',
        price: 8,
        image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8',
      },
      {
        category: createdCategories[2]._id,
        name: 'Sobolo',
        description: 'Traditional hibiscus drink',
        price: 5,
        image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc',
      },
      {
        category: createdCategories[2]._id,
        name: 'Fresh Juice',
        description: 'Pineapple, orange, or mixed fruit',
        price: 10,
        addOns: [
          { name: 'Pineapple', price: 0 },
          { name: 'Orange', price: 0 },
          { name: 'Mixed', price: 2 },
        ],
      },

      // Desserts
      {
        category: createdCategories[3]._id,
        name: 'Ice Cream',
        description: 'Vanilla, chocolate, or strawberry',
        price: 12,
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb',
        addOns: [
          { name: 'Extra Scoop', price: 5 },
          { name: 'Chocolate Syrup', price: 2 },
        ],
      },
    ];

    await MenuItem.insertMany(menuItems);
    console.log('✓ Created menu items');

    // Create settings
    const settings = new Settings({
      restaurant: {
        name: 'Delicious Bites Ghana',
        phone: '233244123456',
        email: 'info@deliciousbites.gh',
        address: 'East Legon, Accra',
      },
      delivery: {
        enabled: true,
        radius: 5,
        fee: 5,
        minimumOrder: 20,
      },
      operatingHours: [
        { day: 'Monday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
        { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
        { day: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
        { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '22:00' },
        { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '23:00' },
        { day: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '23:00' },
        { day: 'Sunday', isOpen: true, openTime: '10:00', closeTime: '21:00' },
      ],
      isAcceptingOrders: true,
    });

    await settings.save();
    console.log('⚙  Created settings');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nStaff Login:');
    console.log('Phone: 233500000000');
    console.log('(Request OTP to login)\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error);
    process.exit(1);
  }
};

seedDatabase();
