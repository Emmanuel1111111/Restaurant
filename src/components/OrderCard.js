import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES } from '../utils/constants';
import { formatCurrency, getStatusText, getStatusColor, formatOrderNumber } from '../utils/helpers';

const OrderCard = ({ order, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Order Number & Status */}
      <View style={styles.header}>
        <Text style={styles.orderNumber}>{formatOrderNumber(order.orderNumber)}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(order.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
        </View>
      </View>

      {/* Items Count */}
      <Text style={styles.itemCount}>
        {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
      </Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.date}>
            {new Date(order.createdAt).toLocaleDateString()}
          </Text>
          <Text style={styles.time}>
            {new Date(order.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{formatCurrency(order.total)}</Text>
          <Icon name="chevron-forward" size={20} color={COLORS.GRAY} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    padding: SIZES.MD,
    marginBottom: SIZES.MD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.SM,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.DARK,
  },
  statusBadge: {
    paddingHorizontal: SIZES.MD,
    paddingVertical: SIZES.SM,
    borderRadius: 16,
  },
  statusText: {
    color: COLORS.WHITE,
    fontSize: 11,
    fontWeight: '600',
  },
  itemCount: {
    fontSize: 12,
    color: COLORS.GRAY,
    marginBottom: SIZES.MD,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: SIZES.MD,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.DARK,
  },
  time: {
    fontSize: 11,
    color: COLORS.GRAY,
    marginTop: SIZES.SM,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.SM,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
});

export default OrderCard;
