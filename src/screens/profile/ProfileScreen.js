import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = ({ navigation }) => {
  const { user, logout, updateUserProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    setSaving(true);
    try {
      const result = await updateUserProfile({
        name: name.trim(),
        email: email.trim(),
      });

      if (result.success) {
        Alert.alert('Success', 'Profile updated successfully');
        setEditMode(false);
      } else {
        Alert.alert('Error', result.error || 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.log('[v0] Save profile error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: async () => {
          await logout();
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* User Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Icon name="person" size={40} color={COLORS.PRIMARY} />
          </View>
          <View style={styles.userBasicInfo}>
            <Text style={styles.userName}>{user?.name || 'Guest'}</Text>
            <Text style={styles.userPhone}>{user?.phone}</Text>
          </View>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {!editMode && (
              <TouchableOpacity onPress={() => setEditMode(true)}>
                <Icon name="create-outline" size={20} color={COLORS.PRIMARY} />
              </TouchableOpacity>
            )}
          </View>

          {editMode ? (
            <View style={styles.editForm}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor={COLORS.GRAY}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={COLORS.GRAY}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value={user?.phone}
                  editable={false}
                />
              </View>

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveProfile}
                  disabled={saving}
                >
                  <Text style={styles.saveButtonText}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setEditMode(false);
                    setName(user?.name || '');
                    setEmail(user?.email || '');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.infoRows}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{user?.name || 'Not set'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || 'Not set'}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{user?.phone}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingContent}>
              <Icon name="notifications-outline" size={20} color={COLORS.PRIMARY} />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={COLORS.GRAY} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingContent}>
              <Icon name="shield-checkmark-outline" size={20} color={COLORS.PRIMARY} />
              <Text style={styles.settingLabel}>Privacy & Security</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={COLORS.GRAY} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingContent}>
              <Icon name="help-circle-outline" size={20} color={COLORS.PRIMARY} />
              <Text style={styles.settingLabel}>Help & Support</Text>
            </View>
            <Icon name="chevron-forward" size={20} color={COLORS.GRAY} />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={20} color={COLORS.DANGER} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

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
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.LG,
    paddingVertical: SIZES.LG,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: SIZES.MD,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userBasicInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.DARK,
    marginBottom: SIZES.SM,
  },
  userPhone: {
    fontSize: 13,
    color: COLORS.GRAY,
  },
  section: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    paddingHorizontal: SIZES.MD,
    paddingVertical: SIZES.MD,
    marginHorizontal: SIZES.LG,
    marginVertical: SIZES.MD,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.MD,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.DARK,
  },
  editForm: {
    gap: SIZES.MD,
  },
  formGroup: {
    marginBottom: SIZES.MD,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.DARK,
    marginBottom: SIZES.SM,
  },
  input: {
    backgroundColor: COLORS.LIGHT,
    borderRadius: 8,
    paddingHorizontal: SIZES.MD,
    paddingVertical: SIZES.SM,
    fontSize: 14,
    color: COLORS.DARK,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  formActions: {
    flexDirection: 'row',
    gap: SIZES.MD,
    marginTop: SIZES.MD,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingVertical: SIZES.SM,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.LIGHT,
    borderRadius: 8,
    paddingVertical: SIZES.SM,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.GRAY,
    fontSize: 14,
    fontWeight: '600',
  },
  infoRows: {
    gap: SIZES.MD,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.SM,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.GRAY,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.DARK,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.MD,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.MD,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.DARK,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.SM,
    paddingVertical: SIZES.MD,
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    marginHorizontal: SIZES.LG,
    marginVertical: SIZES.MD,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.DANGER,
  },
});

export default ProfileScreen;
