import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES } from '../utils/constants';
import { getStatusColor, getStatusText } from '../utils/helpers';

const StatusBadge = ({ status }) => {
  const getStatusIcon = (stat) => {
    const icons = {
      pending: 'time-outline',
      confirmed: 'checkmark-circle-outline',
      preparing: 'flame-outline',
      ready: 'checkmark-done-circle-outline',
      picked_up: 'car-outline',
      in_transit: 'navigate-circle-outline',
      delivered: 'checkmark-circle',
      cancelled: 'close-circle-outline',
    };
    return icons[stat] || 'help-circle-outline';
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: getStatusColor(status) + '20' },
      ]}
    >
      <Icon
        name={getStatusIcon(status)}
        size={16}
        color={getStatusColor(status)}
      />
      <Text style={[styles.text, { color: getStatusColor(status) }]}>
        {getStatusText(status)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.SM,
    paddingHorizontal: SIZES.MD,
    paddingVertical: SIZES.SM,
    borderRadius: 20,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default StatusBadge;
