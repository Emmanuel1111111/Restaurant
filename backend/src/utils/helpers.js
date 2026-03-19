// Calculate distance between two coordinates (Haversine formula)
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

// Format phone number for Ghana
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
  
  // Add the + prefix for E.164 format
  return '+' + cleaned;
};

// Format currency (Ghana Cedis)
export const formatCurrency = (amount) => {
  return `GH₵${parseFloat(amount).toFixed(2)}`;
};

// Calculate estimated delivery time
export const calculateDeliveryTime = (distance) => {
  // Average speed: 20 km/h
  const travelTime = (distance / 20) * 60; // in minutes
  const preparationTime = 20; // minutes
  return Math.ceil(travelTime + preparationTime);
};

