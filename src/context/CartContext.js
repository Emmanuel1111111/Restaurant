import React, { createContext, useState, useContext, useEffect } from 'react';
import * as cartAPI from '../services/api';
import { DELIVERY_FEE } from '../utils/constants';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(DELIVERY_FEE);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.getCart();
      console.log('[v0] Cart loaded from backend:', response);
      setCart(response.cart);
      setDeliveryFee(response.cart.deliveryFee || DELIVERY_FEE);
    } catch (err) {
      console.log('[v0] Load cart error:', err);
      setError(err.message || 'Failed to load cart');
      // Initialize empty cart on error
      setCart({ items: [], subtotal: 0, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item, quantity = 1, selectedAddOns = []) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.addToCart(item._id, quantity, selectedAddOns);
      console.log('[v0] Item added to cart:', response);
      setCart(response.cart);
      setDeliveryFee(response.cart.deliveryFee || DELIVERY_FEE);
      return { success: true };
    } catch (err) {
      console.log('[v0] Add to cart error:', err);
      setError(err.message || 'Failed to add item to cart');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemIndex, quantity) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.updateCartItem(itemIndex, quantity);
      console.log('[v0] Cart item updated:', response);
      setCart(response.cart);
      setDeliveryFee(response.cart.deliveryFee || DELIVERY_FEE);
      return { success: true };
    } catch (err) {
      console.log('[v0] Update quantity error:', err);
      setError(err.message || 'Failed to update item');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemIndex) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.removeFromCart(itemIndex);
      console.log('[v0] Item removed from cart:', response);
      setCart(response.cart);
      setDeliveryFee(response.cart.deliveryFee || DELIVERY_FEE);
      return { success: true };
    } catch (err) {
      console.log('[v0] Remove from cart error:', err);
      setError(err.message || 'Failed to remove item');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartAPI.clearCart();
      console.log('[v0] Cart cleared:', response);
      setCart(response.cart);
      return { success: true };
    } catch (err) {
      console.log('[v0] Clear cart error:', err);
      setError(err.message || 'Failed to clear cart');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Calculate item total (local calculation from cart state)
  const getItemTotal = (item) => {
    return item.subtotal || 0;
  };

  // Get subtotal from cart state
  const getSubtotal = () => {
    return cart?.subtotal || 0;
  };

  // Get total with delivery fee
  const getTotal = () => {
    return cart?.total || 0;
  };

  // Get item count
  const getItemCount = () => {
    return cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  };

  return (
    <CartContext.Provider
      value={{
        cart: cart?.items || [],
        fullCart: cart,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemTotal,
        getSubtotal,
        getTotal,
        deliveryFee,
        itemCount: getItemCount(),
        refreshCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
