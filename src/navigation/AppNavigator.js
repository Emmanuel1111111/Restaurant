import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import OTPScreen from '../screens/auth/OTPScreen';

// Menu Screens
import MenuScreen from '../screens/menu/MenuScreen';
import MenuItemScreen from '../screens/menu/MenuItemScreen';
import CartScreen from '../screens/menu/CartScreen';

// Checkout Screens
import CheckoutScreen from '../screens/checkout/CheckoutScreen';

// Orders Screens
import OrdersScreen from '../screens/orders/OrdersScreen';
import OrderTrackingScreen from '../screens/orders/OrderTrackingScreen';

// Profile Screens
import ProfileScreen from '../screens/profile/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MenuStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: { backgroundColor: COLORS.WHITE },
      headerTintColor: COLORS.DARK,
      headerTitleStyle: { fontWeight: '600' },
    }}
  >
    <Stack.Screen
      name="MenuList"
      component={MenuScreen}
      options={{ title: 'Menu' }}
    />
    <Stack.Screen
      name="MenuItem"
      component={MenuItemScreen}
      options={{ title: 'Item Details' }}
    />
    <Stack.Screen
      name="Cart"
      component={CartScreen}
      options={{ title: 'Your Cart' }}
    />
    <Stack.Screen
      name="Checkout"
      component={CheckoutScreen}
      options={{ title: 'Checkout' }}
    />
  </Stack.Navigator>
);

const OrdersStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: { backgroundColor: COLORS.WHITE },
      headerTintColor: COLORS.DARK,
      headerTitleStyle: { fontWeight: '600' },
    }}
  >
    <Stack.Screen
      name="OrdersList"
      component={OrdersScreen}
      options={{ title: 'My Orders' }}
    />
    <Stack.Screen
      name="OrderTracking"
      component={OrderTrackingScreen}
      options={{ title: 'Track Order' }}
    />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'MenuStack') {
          iconName = focused ? 'restaurant' : 'restaurant-outline';
        } else if (route.name === 'OrdersStack') {
          iconName = focused ? 'receipt' : 'receipt-outline';
        } else if (route.name === 'ProfileStack') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.PRIMARY,
      tabBarInactiveTintColor: COLORS.GRAY,
      headerShown: false,
    })}
  >
    <Tab.Screen
      name="MenuStack"
      component={MenuStack}
      options={{ title: 'Menu' }}
    />
    <Tab.Screen
      name="OrdersStack"
      component={OrdersStack}
      options={{ title: 'Orders' }}
    />
    <Tab.Screen
      name="ProfileStack"
      component={ProfileScreen}
      options={{ title: 'Profile', headerShown: false }}
    />
  </Tab.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="OTP" component={OTPScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null; // or a loading screen
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
