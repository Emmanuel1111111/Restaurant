import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES } from '../../utils/constants';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/helpers';
import CartItem from '../../components/CartItem';

const CartScreen = ({ navigation }) => {
  const {
    cart,
    fullCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getSubtotal,
    getTotal,
    deliveryFee,
    loading,
    error,
    refreshCart,
  } = useCart();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshCart();
    });
    return unsubscribe;
  }, [navigation]);

  const handleRemoveItem = (itemIndex) => {
    Alert.alert('Remove Item', 'Are you sure you want to remove this item?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Remove',
        onPress: async () => {
          const result = await removeFromCart(itemIndex);
          if (!result.success) {
            Alert.alert('Error', result.error || 'Failed to remove item');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const handleUpdateQuantity = async (itemIndex, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemIndex);
      return;
    }
    
    const result = await updateQuantity(itemIndex, newQuantity);
    if (!result.success) {
      Alert.alert('Error', result.error || 'Failed to update quantity');
    }
  };

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Remove all items from your cart?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Clear',
        onPress: async () => {
          const result = await clearCart();
          if (!result.success) {
            Alert.alert('Error', result.error || 'Failed to clear cart');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items before checking out');
      return;
    }
    navigation.navigate('Checkout');
  };

  const handleContinueShopping = () => {
    navigation.navigate('MenuList');
  };

  if (loading && !fullCart) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Loading your cart...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state if cart failed to load
  if (error && !fullCart) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={60} color={COLORS.DANGER} />
          <Text style={styles.errorTitle}>Failed to load cart</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={refreshCart}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Icon name="bag-outline" size={80} color={COLORS.GRAY} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>
            Add some delicious items from the menu to get started
          </Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinueShopping}
          >
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <TouchableOpacity onPress={handleClearCart} disabled={loading}>
          <Text style={[styles.clearButton, loading && styles.clearButtonDisabled]}>
            Clear All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Items List */}
      <FlatList
        data={cart}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <CartItem
            item={item}
            index={index}
            onRemove={() => handleRemoveItem(index)}
            onUpdateQuantity={handleUpdateQuantity}
          />
        )}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
      />

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatCurrency(getSubtotal())}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>{formatCurrency(deliveryFee)}</Text>
        </View>

        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(getTotal())}</Text>
        </View>

        {/* Checkout Button */}
        <TouchableOpacity
          style={[styles.checkoutButton, loading && styles.checkoutButtonDisabled]}
          onPress={handleCheckout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.WHITE} size="small" />
          ) : (
            <>
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              <Icon name="arrow-forward" size={20} color={COLORS.WHITE} />
            </>
          )}
        </TouchableOpacity>

        {/* Continue Shopping */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinueShopping}
          disabled={loading}
        >
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.LG,
    paddingVertical: SIZES.MD,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.DARK,
  },
  clearButton: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.DANGER,
  },
  clearButtonDisabled: {
    opacity: 0.5,
  },
  listContent: {
    paddingHorizontal: SIZES.LG,
    paddingVertical: SIZES.MD,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: SIZES.MD,
    fontSize: 14,
    color: COLORS.GRAY,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.LG,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.DARK,
    marginTop: SIZES.MD,
    marginBottom: SIZES.SM,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.GRAY,
    textAlign: 'center',
    marginBottom: SIZES.LG,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingHorizontal: SIZES.LG,
    paddingVertical: SIZES.MD,
  },
  retryButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.LG,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.DARK,
    marginTop: SIZES.LG,
    marginBottom: SIZES.SM,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.GRAY,
    textAlign: 'center',
    marginBottom: SIZES.XL,
    lineHeight: 20,
  },
  summary: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SIZES.LG,
    paddingVertical: SIZES.LG,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.MD,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.GRAY,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.DARK,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: SIZES.MD,
    marginBottom: SIZES.LG,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.DARK,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  checkoutButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingVertical: SIZES.MD,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.SM,
    marginBottom: SIZES.MD,
  },
  checkoutButtonDisabled: {
    opacity: 0.5,
  },
  checkoutButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingVertical: SIZES.MD,
    alignItems: 'center',
  },
  continueButtonText: {
    color: COLORS.PRIMARY,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CartScreen;
