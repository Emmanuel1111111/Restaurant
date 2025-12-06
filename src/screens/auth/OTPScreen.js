import React, { useState, useEffect, useRef } from 'react';
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
import { COLORS, SIZES, OTP_LENGTH, OTP_EXPIRY } from '../../utils/constants';

const OTPScreen = ({ route, navigation }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(OTP_EXPIRY * 60);
  const { login, requestOTP } = useAuth();
  const { phone } = route.params;
  const otpInputRef = useRef(null);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== OTP_LENGTH) {
      Alert.alert('Error', `Please enter a valid ${OTP_LENGTH}-digit OTP`);
      return;
    }

    setLoading(true);
    try {
      const result = await login(phone, otp);

      if (result.success) {
        // Login successful, navigation handled by AppNavigator
      } else {
        Alert.alert('Error', result.error);
        setOtp('');
        otpInputRef.current?.focus();
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.log('[v0] Verify OTP error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) {
      Alert.alert('Wait', `Please wait ${formatTime(timer)} before requesting again`);
      return;
    }

    setResending(true);
    try {
      const result = await requestOTP(phone);

      if (result.success) {
        Alert.alert('Success', 'New OTP sent to your phone');
        setTimer(OTP_EXPIRY * 60);
        setOtp('');
        otpInputRef.current?.focus();
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP');
      console.log('[v0] Resend OTP error:', error);
    } finally {
      setResending(false);
    }
  };

  const handleChangeOTP = (text) => {
    // Only allow digits
    const numericText = text.replace(/[^0-9]/g, '');
    setOtp(numericText.slice(0, OTP_LENGTH));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.stepIndicator}>Step 2 of 2</Text>
          <Text style={styles.title}>Verify Your Phone</Text>
          <Text style={styles.description}>
            We sent a verification code to{'\n'}
            <Text style={styles.phone}>{phone}</Text>
          </Text>
        </View>

        {/* OTP Input Section */}
        <View style={styles.form}>
          <Text style={styles.label}>Enter 6-Digit Code</Text>
          <TextInput
            ref={otpInputRef}
            style={styles.otpInput}
            placeholder="000000"
            placeholderTextColor={COLORS.GRAY}
            value={otp}
            onChangeText={handleChangeOTP}
            keyboardType="number-pad"
            maxLength={OTP_LENGTH}
            editable={!loading && !resending}
            selectTextOnFocus
          />

          {/* OTP Display (visual feedback) */}
          <View style={styles.otpDisplay}>
            {Array.from({ length: OTP_LENGTH }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.otpDigit,
                  index < otp.length && styles.otpDigitFilled,
                ]}
              >
                <Text style={styles.otpDigitText}>
                  {otp[index] || '-'}
                </Text>
              </View>
            ))}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.button,
              (loading || otp.length !== OTP_LENGTH) && styles.buttonDisabled,
            ]}
            onPress={handleVerifyOTP}
            disabled={loading || otp.length !== OTP_LENGTH}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.WHITE} size="small" />
            ) : (
              <Text style={styles.buttonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>

          {/* Resend Section */}
          <View style={styles.resendContainer}>
            {timer > 0 ? (
              <Text style={styles.resendText}>
                Resend code in <Text style={styles.timer}>{formatTime(timer)}</Text>
              </Text>
            ) : (
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={resending}
              >
                <Text style={styles.resendLink}>
                  {resending ? 'Sending...' : 'Resend Code'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Didn't receive the code?{'\n'}
            <Text style={styles.link}>Contact Support</Text>
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
    marginTop: SIZES.XL,
    marginBottom: SIZES.XL,
  },
  stepIndicator: {
    fontSize: 12,
    color: COLORS.PRIMARY,
    fontWeight: '600',
    marginBottom: SIZES.SM,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.DARK,
    marginBottom: SIZES.MD,
  },
  description: {
    fontSize: 14,
    color: COLORS.GRAY,
    lineHeight: 20,
  },
  phone: {
    fontWeight: '600',
    color: COLORS.DARK,
  },
  form: {
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.DARK,
    marginBottom: SIZES.MD,
  },
  otpInput: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    paddingHorizontal: SIZES.MD,
    paddingVertical: SIZES.MD,
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 8,
    color: COLORS.DARK,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    textAlign: 'center',
    marginBottom: SIZES.MD,
  },
  otpDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.XL,
  },
  otpDigit: {
    width: '15%',
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
  },
  otpDigitFilled: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: '#FFF5F0',
  },
  otpDigitText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.DARK,
  },
  button: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingVertical: SIZES.MD,
    alignItems: 'center',
    marginBottom: SIZES.XL,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.MD,
  },
  resendText: {
    fontSize: 14,
    color: COLORS.GRAY,
  },
  timer: {
    fontWeight: '600',
    color: COLORS.DARK,
  },
  resendLink: {
    fontSize: 14,
    color: COLORS.PRIMARY,
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

export default OTPScreen;
