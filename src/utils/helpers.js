/**
 * Format phone number to standardized format
 */
export const formatPhoneNumber = (phone) => {
  // Remove all non-digits
  let cleaned = phone.replace(/\D/g, '');

  // Add country code if missing
  if (!cleaned.startsWith('233')) {
    if (cleaned.startsWith('0')) {
      cleaned = '233' + cleaned.substring(1);
    } else {
      cleaned = '233' + cleaned;
    }
  }

  return cleaned;
};

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return `GH₵${parseFloat(amount).toFixed(2)}`;
};

/**
 * Calculate distance between two coordinates
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (value) => {
  return (value * Math.PI) / 180;
};

/**
 * Calculate estimated delivery time
 */
export const calculateDeliveryTime = (distance) => {
  const travelTime = (distance / 20) * 60; // average speed 20 km/h
  const preparationTime = 20; // minutes
  return Math.ceil(travelTime + preparationTime);
};

/**
 * Format order number for display
 */
export const formatOrderNumber = (orderNumber) => {
  return `#${orderNumber}`;
};

/**
 * Get status badge color
 */
export const getStatusColor = (status) => {
  const colors = {
    pending: '#FFA500',
    confirmed: '#4169E1',
    preparing: '#FF6B6B',
    ready: '#51CF66',
    picked_up: '#5C7CFA',
    in_transit: '#8C7EE3',
    delivered: '#06A77D',
    cancelled: '#E63946',
  };
  return colors[status] || '#888888';
};

/**
 * Get status display text
 */
export const getStatusText = (status) => {
  const texts = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    ready: 'Ready for Pickup',
    picked_up: 'Picked Up',
    in_transit: 'In Transit',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return texts[status] || status;
};
