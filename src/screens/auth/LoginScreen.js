import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS, SIZES } from '../../utils/constants';
import { formatPhoneNumber } from '../../utils/helpers';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { requestOTP } = useAuth();

  const handleSendOTP = async () => {
    // Validate phone number
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (phone.replace(/\D/g, '').length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phone);
      const result = await requestOTP(formattedPhone);

      if (result.success) {
        navigation.navigate('OTP', { phone: formattedPhone });
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.log('[v0] Send OTP error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.logo}>🍽️</Text>
          <Text style={styles.appName}>Delicious Bites</Text>
          <Text style={styles.subtitle}>Order your favorite meals</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.description}>
            Enter your phone number to get started
          </Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="024 412 3456"
              placeholderTextColor={COLORS.GRAY}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={15}
              editable={!loading}
            />
            <Text style={styles.hint}>We'll send you an OTP code</Text>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSendOTP}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.WHITE} size="small" />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{'\n'}
            <Text style={styles.link}>Terms & Conditions</Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.LG,
    justifyContent: 'space-between',
    paddingVertical: SIZES.XL,
  },
  header: {
    alignItems: 'center',
    marginTop: SIZES.XL,
  },
  logo: {
    fontSize: 60,
    marginBottom: SIZES.MD,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.DARK,
    marginBottom: SIZES.SM,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.GRAY,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.DARK,
    marginBottom: SIZES.SM,
  },
  description: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginBottom: SIZES.XL,
    lineHeight: 20,
  },
  inputWrapper: {
    marginBottom: SIZES.XL,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.DARK,
    marginBottom: SIZES.SM,
  },
  input: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    paddingHorizontal: SIZES.MD,
    paddingVertical: SIZES.MD,
    fontSize: 16,
    color: COLORS.DARK,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: SIZES.SM,
  },
  hint: {
    fontSize: 12,
    color: COLORS.GRAY,
    marginTop: SIZES.SM,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingVertical: SIZES.MD,
    alignItems: 'center',
    marginTop: SIZES.MD,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: SIZES.LG,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.GRAY,
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
});

export default LoginScreen;
