import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES } from '../../utils/constants';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/helpers';

const MenuItemScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  const toggleAddOn = (addOn) => {
    setSelectedAddOns((prev) => {
      const exists = prev.find((a) => a.name === addOn.name);
      if (exists) {
        return prev.filter((a) => a.name !== addOn.name);
      }
      return [...prev, addOn];
    });
  };

  const calculateAddOnsTotal = () => {
    return selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0);
  };

  const getItemTotal = () => {
    return (item.price + calculateAddOnsTotal()) * quantity;
  };

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const result = await addToCart(item, quantity, selectedAddOns);
      
      if (result.success) {
        Alert.alert('Success', `${item.name} added to cart!`, [
          {
            text: 'Continue Shopping',
            onPress: () => navigation.goBack(),
          },
          {
            text: 'Go to Cart',
            onPress: () => navigation.navigate('Cart'),
          },
        ]);
      } else {
        Alert.alert('Error', result.error || 'Failed to add item to cart');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to cart');
      console.log('[v0] Add to cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back" size={28} color={COLORS.WHITE} />
          </TouchableOpacity>
          <Image
            source={{ uri: item.image || '/diverse-food-spread.png' }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={styles.name}>{item.name}</Text>
              {item.isPopular && (
                <View style={styles.popularBadge}>
                  <Icon name="star" size={14} color={COLORS.PRIMARY} />
                  <Text style={styles.popularText}>Popular</Text>
                </View>
              )}
            </View>
            <Text style={styles.price}>{formatCurrency(item.price)}</Text>
          </View>

          {/* Description */}
          <Text style={styles.description}>{item.description}</Text>

          {/* Add-ons */}
          {item.addOns && item.addOns.length > 0 && (
            <View style={styles.addOnsContainer}>
              <Text style={styles.sectionTitle}>Customize Your Order</Text>
              {item.addOns.map((addOn, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.addOnItem}
                  onPress={() => toggleAddOn(addOn)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      selectedAddOns.find((a) => a.name === addOn.name) &&
                        styles.checkboxActive,
                    ]}
                  >
                    {selectedAddOns.find((a) => a.name === addOn.name) && (
                      <Icon name="checkmark" size={16} color={COLORS.WHITE} />
                    )}
                  </View>
                  <View style={styles.addOnContent}>
                    <Text style={styles.addOnName}>{addOn.name}</Text>
                  </View>
                  <Text style={styles.addOnPrice}>
                    {addOn.price > 0 ? `+${formatCurrency(addOn.price)}` : 'Free'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Quantity */}
          <View style={styles.quantityContainer}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Icon name="remove" size={20} color={COLORS.PRIMARY} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Icon name="add" size={20} color={COLORS.PRIMARY} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Spacing */}
          <View style={{ height: SIZES.XL }} />
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>{formatCurrency(getItemTotal())}</Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, loading && styles.addButtonDisabled]}
          onPress={handleAddToCart}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.WHITE} size="small" />
          ) : (
            <>
              <Icon name="bag-add" size={20} color={COLORS.WHITE} />
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </>
          )}
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
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: COLORS.LIGHT,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: SIZES.MD,
    left: SIZES.MD,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  content: {
    paddingHorizontal: SIZES.LG,
    paddingTop: SIZES.LG,
  },
  header: {
    marginBottom: SIZES.LG,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.MD,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.DARK,
    flex: 1,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
    paddingHorizontal: SIZES.MD,
    paddingVertical: SIZES.SM,
    borderRadius: 20,
    marginLeft: SIZES.MD,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginLeft: SIZES.SM,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  description: {
    fontSize: 14,
    color: COLORS.GRAY,
    lineHeight: 20,
    marginBottom: SIZES.LG,
  },
  addOnsContainer: {
    marginBottom: SIZES.LG,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.DARK,
    marginBottom: SIZES.MD,
  },
  addOnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.MD,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.MD,
  },
  checkboxActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  addOnContent: {
    flex: 1,
  },
  addOnName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.DARK,
  },
  addOnPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  quantityContainer: {
    marginBottom: SIZES.LG,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    padding: SIZES.MD,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.LIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.DARK,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.LG,
    paddingVertical: SIZES.MD,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: SIZES.MD,
  },
  totalContainer: {
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 12,
    color: COLORS.GRAY,
    marginBottom: SIZES.SM,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingVertical: SIZES.MD,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.SM,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MenuItemScreen;
