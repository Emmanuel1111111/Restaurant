import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES, ORDER_STATUS } from '../../utils/constants';
import OrderCard from '../../components/OrderCard';
import * as orderAPI from '../../services/api';

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (status = null) => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders(status);
      setOrders(response.orders || []);
    } catch (error) {
      console.log('[v0] Fetch orders error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchOrders(selectedStatus);
    } finally {
      setRefreshing(false);
    }
  }, [selectedStatus]);

  const handleStatusFilter = (status) => {
    setSelectedStatus(status === selectedStatus ? null : status);
    fetchOrders(status === selectedStatus ? null : status);
  };

  const handleOrderPress = (order) => {
    navigation.navigate('OrderTracking', { order });
  };

  const statuses = [
    { label: 'Pending', value: ORDER_STATUS.PENDING },
    { label: 'Ready', value: ORDER_STATUS.READY },
    { label: 'Delivered', value: ORDER_STATUS.DELIVERED },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      {/* Status Filters */}
      {orders.length > 0 && (
        <View style={styles.filters}>
          <TouchableOpacity
            style={[styles.filterButton, !selectedStatus && styles.filterButtonActive]}
            onPress={() => handleStatusFilter(null)}
          >
            <Text
              style={[
                styles.filterText,
                !selectedStatus && styles.filterTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {statuses.map((status) => (
            <TouchableOpacity
              key={status.value}
              style={[
                styles.filterButton,
                selectedStatus === status.value && styles.filterButtonActive,
              ]}
              onPress={() => handleStatusFilter(status.value)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedStatus === status.value && styles.filterTextActive,
                ]}
              >
                {status.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Orders List */}
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="receipt-outline" size={80} color={COLORS.GRAY} />
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptyText}>
            Start ordering to see your order history here
          </Text>
          <TouchableOpacity
            style={styles.orderButton}
            onPress={() => navigation.navigate('MenuStack')}
          >
            <Text style={styles.orderButtonText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id || item.id}
          renderItem={({ item }) => (
            <OrderCard order={item} onPress={() => handleOrderPress(item)} />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.PRIMARY}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
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
  filters: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.LG,
    paddingVertical: SIZES.MD,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: SIZES.SM,
  },
  filterButton: {
    paddingHorizontal: SIZES.MD,
    paddingVertical: SIZES.SM,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterButtonActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.GRAY,
  },
  filterTextActive: {
    color: COLORS.WHITE,
  },
  listContent: {
    paddingHorizontal: SIZES.LG,
    paddingVertical: SIZES.MD,
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
  orderButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingHorizontal: SIZES.LG,
    paddingVertical: SIZES.MD,
  },
  orderButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '600',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default OrdersScreen;
