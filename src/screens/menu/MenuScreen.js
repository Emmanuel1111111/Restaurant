import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  SectionList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SIZES } from '../../utils/constants';
import { useCart } from '../../context/CartContext';
import MenuItemCard from '../../components/MenuItemCard';
import CategoryTab from '../../components/CategoryTab';
import * as menuAPI from '../../services/api';

const MenuScreen = ({ navigation }) => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const { addToCart, itemCount } = useCart();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getMenu();
      setMenu(response.menu || []);
    } catch (error) {
      console.log('[v0] Fetch menu error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        addOns: item.addOns,
      },
      1,
      []
    );
  };

  const handleMenuItemPress = (item) => {
    navigation.navigate('MenuItem', { item });
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  const handleSearchPress = () => {
    if (searchQuery.trim()) {
      navigation.navigate('MenuItem', { searchQuery: searchQuery.trim() });
    }
  };

  const filteredMenu = selectedCategoryIndex === 0
    ? menu
    : [menu[selectedCategoryIndex]];

  const sections = filteredMenu
    .filter((category) => category.items?.length > 0)
    .map((category) => ({
      title: category.name,
      data: category.items,
    }));

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
      <View style={styles.header}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={COLORS.GRAY} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search menu..."
            placeholderTextColor={COLORS.GRAY}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchPress}
          />
        </View>

        {/* Cart Button */}
        {itemCount > 0 && (
          <TouchableOpacity
            style={styles.cartButton}
            onPress={handleCartPress}
          >
            <Icon name="bag" size={24} color={COLORS.PRIMARY} />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{itemCount}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      {menu.length > 0 && (
        <View style={styles.categoriesContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={[{ id: 'all', name: 'All' }, ...menu]}
            keyExtractor={(item) => item.id || 'all'}
            renderItem={({ item, index }) => (
              <CategoryTab
                category={item}
                isActive={selectedCategoryIndex === index}
                onPress={() => setSelectedCategoryIndex(index)}
              />
            )}
            scrollEnabled={true}
          />
        </View>
      )}

      {/* Menu Items */}
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <MenuItemCard
            item={item}
            onPress={() => handleMenuItemPress(item)}
            onAddCart={() => handleAddToCart(item)}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="fast-food" size={48} color={COLORS.GRAY} />
            <Text style={styles.emptyText}>No items available</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: SIZES.LG,
    paddingVertical: SIZES.MD,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT,
    borderRadius: 8,
    paddingHorizontal: SIZES.MD,
    marginBottom: SIZES.MD,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SIZES.MD,
    paddingHorizontal: SIZES.SM,
    fontSize: 14,
    color: COLORS.DARK,
  },
  cartButton: {
    position: 'absolute',
    top: SIZES.MD,
    right: SIZES.LG,
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: COLORS.WHITE,
    fontSize: 11,
    fontWeight: '700',
  },
  categoriesContainer: {
    backgroundColor: COLORS.WHITE,
    paddingVertical: SIZES.MD,
    paddingHorizontal: SIZES.LG,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.DARK,
    marginTop: SIZES.LG,
    marginBottom: SIZES.MD,
    marginHorizontal: SIZES.LG,
  },
  listContent: {
    paddingHorizontal: SIZES.LG,
    paddingVertical: SIZES.MD,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.XL,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.GRAY,
    marginTop: SIZES.MD,
  },
});

export default MenuScreen;
