import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';

const CartItem = ({ item, index, onRemove, onUpdateQuantity }) => {
  const [updatingQuantity, setUpdatingQuantity] = useState(false);

  const handleUpdateQuantity = async (newQuantity) => {
    setUpdatingQuantity(true);
    await onUpdateQuantity(index, newQuantity);
    setUpdatingQuantity(false);
  };

  const getItemSubtotal = () => {
    return item.subtotal || 0;
  };

  return (
    <View style={styles.container}>
      {/* Image */}
      <Image
        source={{ uri: item.image || '/placeholder.svg?key=8qrfe' }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Content */}
      <View style={styles.content}>
        <View>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          {item.addOns?.length > 0 && (
            <Text style={styles.addOns} numberOfLines={1}>
              +{item.addOns.map((a) => a.name).join(', ')}
            </Text>
          )}
          <Text style={styles.price}>{formatCurrency(item.price)}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <View style={styles.quantityControl}>
            <TouchableOpacity
              onPress={() => handleUpdateQuantity(item.quantity - 1)}
              disabled={updatingQuantity}
            >
              {updatingQuantity ? (
                <ActivityIndicator size="small" color={COLORS.PRIMARY} />
              ) : (
                <Icon name="remove-circle-outline" size={20} color={COLORS.PRIMARY} />
              )}
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => handleUpdateQuantity(item.quantity + 1)}
              disabled={updatingQuantity}
            >
              <Icon name="add-circle-outline" size={20} color={COLORS.PRIMARY} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => onRemove(index)} disabled={updatingQuantity}>
            <Icon
              name="trash-outline"
              size={20}
              color={updatingQuantity ? COLORS.GRAY : COLORS.DANGER}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Subtotal */}
      <Text style={styles.subtotal}>{formatCurrency(getItemSubtotal())}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    marginBottom: SIZES.MD,
    overflow: 'hidden',
    padding: SIZES.MD,
    gap: SIZES.MD,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.LIGHT,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.DARK,
    marginBottom: SIZES.SM,
  },
  addOns: {
    fontSize: 12,
    color: COLORS.GRAY,
    marginBottom: SIZES.SM,
  },
  price: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.PRIMARY,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SIZES.MD,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.SM,
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.DARK,
    minWidth: 20,
    textAlign: 'center',
  },
  subtotal: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.PRIMARY,
    textAlignVertical: 'center',
  },
});

export default CartItem;
