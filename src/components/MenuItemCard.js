import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES } from '../utils/constants';
import { formatCurrency } from '../utils/helpers';

const MenuItemCard = ({ item, onPress, onAddCart }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image || '/diverse-food-spread.png' }}
          style={styles.image}
          resizeMode="cover"
        />
        {item.isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>Popular</Text>
          </View>
        )}
        {!item.isAvailable && (
          <View style={styles.unavailableBadge}>
            <Text style={styles.unavailableText}>Out of Stock</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.price}>{formatCurrency(item.price)}</Text>
          <TouchableOpacity
            style={[styles.addButton, !item.isAvailable && styles.addButtonDisabled]}
            onPress={() => onAddCart(item)}
            disabled={!item.isAvailable}
          >
            <Icon name="add" size={20} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: SIZES.MD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.LIGHT,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  popularBadge: {
    position: 'absolute',
    top: SIZES.MD,
    right: SIZES.MD,
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SIZES.MD,
    paddingVertical: SIZES.SM,
    borderRadius: 20,
  },
  popularText: {
    color: COLORS.WHITE,
    fontSize: 11,
    fontWeight: '600',
  },
  unavailableBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: SIZES.MD,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.DARK,
    marginBottom: SIZES.SM,
  },
  description: {
    fontSize: 12,
    color: COLORS.GRAY,
    marginBottom: SIZES.MD,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  addButton: {
    backgroundColor: COLORS.PRIMARY,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: COLORS.GRAY,
    opacity: 0.5,
  },
});

export default MenuItemCard;
