import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES, ORDER_STATUS } from '../../utils/constants';
import StatusBadge from '../../components/StatusBadge';
import { formatCurrency, getStatusColor, getStatusText } from '../../utils/helpers';

const OrderTrackingScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const [currentOrder, setCurrentOrder] = useState(order);

  const orderSteps = [
    { status: ORDER_STATUS.PENDING, label: 'Order Placed' },
    { status: ORDER_STATUS.CONFIRMED, label: 'Confirmed' },
    { status: ORDER_STATUS.PREPARING, label: 'Preparing' },
    { status: ORDER_STATUS.READY, label: 'Ready' },
    { status: ORDER_STATUS.PICKED_UP, label: 'Picked Up' },
    { status: ORDER_STATUS.DELIVERED, label: 'Delivered' },
  ];

  const getCurrentStepIndex = () => {
    return orderSteps.findIndex((step) => step.status === currentOrder.status);
  };

  const handleRateOrder = () => {
    if (currentOrder.status === ORDER_STATUS.DELIVERED) {
      Alert.alert('Rate Order', 'Open rating screen', [
        { text: 'Cancel', onPress: () => {} },
        { text: 'Rate', onPress: () => {} },
      ]);
    }
  };

  const currentStep = getCurrentStepIndex();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" size={28} color={COLORS.DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Tracking</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Order Info */}
        <View style={styles.orderInfo}>
          <View>
            <Text style={styles.orderNumber}>#{currentOrder.orderNumber}</Text>
            <Text style={styles.orderDate}>
              {new Date(currentOrder.createdAt).toLocaleDateString()} at{' '}
              {new Date(currentOrder.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
          <StatusBadge status={currentOrder.status} />
        </View>

        {/* Progress Timeline */}
        <View style={styles.timelineContainer}>
          <Text style={styles.sectionTitle}>Order Progress</Text>
          {orderSteps.map((step, index) => {
            const isCompleted = index <= currentStep;
            const isCurrent = index === currentStep;

            return (
              <View key={step.status} style={styles.timelineStep}>
                {/* Circle */}
                <View style={styles.timelineMarkerContainer}>
                  <View
                    style={[
                      styles.timelineMarker,
                      isCompleted && styles.timelineMarkerCompleted,
                      isCurrent && styles.timelineMarkerCurrent,
                    ]}
                  >
                    {isCompleted && (
                      <Icon
                        name="checkmark"
                        size={14}
                        color={isCompleted ? COLORS.WHITE : COLORS.GRAY}
                      />
                    )}
                  </View>

                  {/* Line */}
                  {index < orderSteps.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        isCompleted && styles.timelineLineCompleted,
                      ]}
                    />
                  )}
                </View>

                {/* Label */}
                <View style={styles.timelineLabel}>
                  <Text
                    style={[
                      styles.stepLabel,
                      isCompleted && styles.stepLabelCompleted,
                    ]}
                  >
                    {step.label}
                  </Text>
                  {isCurrent && (
                    <Text style={styles.stepTime}>In progress</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items Ordered</Text>
          {currentOrder.items?.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemContent}>
                <Text style={styles.itemName}>{item.name}</Text>
                {item.addOns?.length > 0 && (
                  <Text style={styles.itemAddOns}>
                    +{item.addOns.map((a) => a.name).join(', ')}
                  </Text>
                )}
              </View>
              <View style={styles.itemPrice}>
                <Text style={styles.itemQty}>x{item.quantity}</Text>
                <Text style={styles.itemValue}>
                  {formatCurrency(item.subtotal)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressBox}>
            <Icon name="location" size={20} color={COLORS.PRIMARY} />
            <Text style={styles.addressText}>
              {currentOrder.deliveryAddress}
            </Text>
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>
              {formatCurrency(currentOrder.subtotal)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Delivery Fee</Text>
            <Text style={styles.value}>
              {formatCurrency(currentOrder.deliveryFee)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(currentOrder.total)}
            </Text>
          </View>
        </View>

        {/* Rate Order Button */}
        {currentOrder.status === ORDER_STATUS.DELIVERED && (
          <TouchableOpacity
            style={styles.rateButton}
            onPress={handleRateOrder}
          >
            <Icon name="star-outline" size={20} color={COLORS.WHITE} />
            <Text style={styles.rateButtonText}>Rate This Order</Text>
          </TouchableOpacity>
        )}

        {/* Spacing */}
        <View style={{ height: SIZES.XL }} />
      </ScrollView>
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
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.LG,
    paddingVertical: SIZES.LG,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.DARK,
    marginBottom: SIZES.SM,
  },
  orderDate: {
    fontSize: 12,
    color: COLORS.GRAY,
  },
  section: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    padding: SIZES.MD,
    marginHorizontal: SIZES.LG,
    marginVertical: SIZES.MD,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.DARK,
    marginBottom: SIZES.MD,
  },
  timelineContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    padding: SIZES.MD,
    marginHorizontal: SIZES.LG,
    marginVertical: SIZES.MD,
  },
  timelineStep: {
    flexDirection: 'row',
    marginBottom: SIZES.MD,
  },
  timelineMarkerContainer: {
    alignItems: 'center',
    marginRight: SIZES.MD,
  },
  timelineMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
  },
  timelineMarkerCompleted: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  timelineMarkerCurrent: {
    borderColor: COLORS.PRIMARY,
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginTop: SIZES.SM,
  },
  timelineLineCompleted: {
    backgroundColor: COLORS.PRIMARY,
  },
  timelineLabel: {
    flex: 1,
    justifyContent: 'center',
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.GRAY,
  },
  stepLabelCompleted: {
    color: COLORS.DARK,
  },
  stepTime: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    marginTop: SIZES.SM,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.MD,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.DARK,
  },
  itemAddOns: {
    fontSize: 11,
    color: COLORS.GRAY,
    marginTop: SIZES.SM,
  },
  itemPrice: {
    alignItems: 'flex-end',
  },
  itemQty: {
    fontSize: 12,
    color: COLORS.GRAY,
  },
  itemValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.PRIMARY,
    marginTop: SIZES.SM,
  },
  addressBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.LIGHT,
    borderRadius: 8,
    padding: SIZES.MD,
    gap: SIZES.MD,
  },
  addressText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.DARK,
    lineHeight: 18,
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
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: SIZES.MD,
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
  rateButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingVertical: SIZES.MD,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.SM,
    marginHorizontal: SIZES.LG,
  },
  rateButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default OrderTrackingScreen;
