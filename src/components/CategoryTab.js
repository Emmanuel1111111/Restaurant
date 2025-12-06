import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS, SIZES } from '../utils/constants';

const CategoryTab = ({ category, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={onPress}
    >
      <Text style={[styles.text, isActive && styles.activeText]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tab: {
    paddingHorizontal: SIZES.MD,
    paddingVertical: SIZES.SM,
    marginRight: SIZES.MD,
    borderRadius: 20,
    backgroundColor: COLORS.LIGHT,
  },
  activeTab: {
    backgroundColor: COLORS.PRIMARY,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.GRAY,
  },
  activeText: {
    color: COLORS.WHITE,
  },
});

export default CategoryTab;
