import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES, PAYMENT_METHODS, MINIMUM_ORDER } from '../../utils/constants';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/helpers';
import * as orderAPI from '../../services/api';

const CheckoutScreen = ({ navigation }) => {
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.CASH);
  const [loading, setLoading] = useState(false);
  const [canCheckout, setCanCheckout] = useState(false);

  const { fullCart, cart, getSubtotal, getTotal, deliveryFee } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setCanCheckout(getSubtotal() >= MINIMUM_ORDER && deliveryAddress.trim().length > 0);
  }, [getSubtotal(), deliveryAddress]);

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      Alert.alert('Error', 'Please enter a delivery address');
      return;
    }

    if (getSubtotal() < MINIMUM_ORDER) {
      Alert.alert(
        'Minimum Order Not Met',
        `Minimum order amount is ${formatCurrency(MINIMUM_ORDER)}`
      );
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cart.map((item) => ({
          menuItemId: item.menuItem || item._id, // menuItem is the ObjectId reference
          quantity: item.quantity,
          addOns: item.addOns || [],
        })),
        deliveryAddress,
        deliveryInstructions: instructions,
        paymentMethod,
      };

      console.log('[v0] Placing order with data:', orderData);

      const response = await orderAPI.createOrder(orderData);

      if (response.success) {
        Alert.alert('Order Placed!', `Order #${response.order.orderNumber} created`, [
          {
            text: 'Track Order',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'OrdersStack' }],
              });
            },
          },
        ]);
      } else {
        Alert.alert('Error', response.error || 'Failed to place order');
      }
    } catch (error) {
      console.log('[v0] Place order error:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="chevron-back" size={28} color={COLORS.DARK} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Checkout</Text>
            <View style={{ width: 28 }} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Order Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Summary</Text>
              {cart.map((item, index) => (
                <View key={index} style={styles.summaryItem}>
                  <View>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                  </View>
                  <Text style={styles.itemPrice}>
                    {formatCurrency(item.subtotal || item.price * item.quantity)}
                  </Text>
                </View>
              ))}
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Subtotal</Text>
                <Text style={styles.value}>{formatCurrency(getSubtotal())}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Delivery Fee</Text>
                <Text style={styles.value}>{formatCurrency(deliveryFee)}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatCurrency(getTotal())}</Text>
              </View>
            </View>

            {/* Delivery Address */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your delivery address"
                placeholderTextColor={COLORS.GRAY}
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              {deliveryAddress.length > 0 && deliveryAddress.length < 10 && (
                <Text style={styles.error}>Please enter a valid address</Text>
              )}
            </View>

            {/* Delivery Instructions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Delivery Instructions (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Ring the bell twice, Leave at gate..."
                placeholderTextColor={COLORS.GRAY}
                value={instructions}
                onChangeText={setInstructions}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>

            {/* Payment Method */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
                <TouchableOpacity
                  key={value}
                  style={styles.paymentOption}
                  onPress={() => setPaymentMethod(value)}
                >
                  <View
                    style={[
                      styles.radio,
                      paymentMethod === value && styles.radioActive,
                    ]}
                  >
                    {paymentMethod === value && (
                      <View style={styles.radioDot} />
                    )}
                  </View>
                  <Text style={styles.paymentLabel}>
                    {value === PAYMENT_METHODS.MOBILE_MONEY
                      ? 'Mobile Money'
                      : value === PAYMENT_METHODS.CARD
                      ? 'Card Payment'
                      : 'Cash on Delivery'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Minimum Order Notice */}
            {getSubtotal() < MINIMUM_ORDER && (
              <View style={styles.notice}>
                <Icon name="information-circle" size={20} color={COLORS.WARNING} />
                <Text style={styles.noticeText}>
                  Minimum order amount is {formatCurrency(MINIMUM_ORDER)}. Add {formatCurrency(MINIMUM_ORDER - getSubtotal())} more to checkout.
                </Text>
              </View>
            )}

            {/* Spacing */}
            <View style={{ height: SIZES.XL }} />
          </View>
        </ScrollView>

        {/* Footer Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, !canCheckout && styles.buttonDisabled]}
            onPress={handlePlaceOrder}
            disabled={!canCheckout || loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.WHITE} size="small" />
            ) : (
              <>
                <Text style={styles.buttonText}>Place Order</Text>
                <Text style={styles.buttonPrice}>{formatCurrency(getTotal())}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.DARK,
  },
  content: {
    paddingHorizontal: SIZES.LG,
    paddingVertical: SIZES.MD,
  },
  section: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    padding: SIZES.MD,
    marginBottom: SIZES.LG,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.DARK,
    marginBottom: SIZES.MD,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.SM,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.DARK,
  },
  itemQuantity: {
    fontSize: 12,
    color: COLORS.GRAY,
    marginTop: SIZES.SM,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: SIZES.MD,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.SM,
  },
  label: {
    fontSize: 13,
    color: COLORS.GRAY,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.DARK,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: SIZES.MD,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.DARK,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  input: {
    backgroundColor: COLORS.LIGHT,
    borderRadius: 8,
    paddingHorizontal: SIZES.MD,
    paddingVertical: SIZES.MD,
    fontSize: 14,
    color: COLORS.DARK,
    marginBottom: SIZES.MD,
    minHeight: 80,
  },
  error: {
    fontSize: 12,
    color: COLORS.DANGER,
    marginTop: -SIZES.MD,
    marginBottom: SIZES.MD,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.MD,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginRight: SIZES.MD,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: COLORS.PRIMARY,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.PRIMARY,
  },
  paymentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.DARK,
  },
  notice: {
    flexDirection: 'row',
    backgroundColor: '#FFF5F0',
    borderRadius: 8,
    padding: SIZES.MD,
    gap: SIZES.MD,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.WARNING,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: SIZES.LG,
    paddingVertical: SIZES.MD,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingVertical: SIZES.MD,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.MD,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPrice: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default CheckoutScreen;
