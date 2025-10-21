import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Product } from '../../types';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../utils/storage';
import ProductCard from '../../components/ProductCard';
import { ProductForm } from './components/ProductForm';
import { styles } from './styles';
import { globalStyles } from '../../styles/globalStyles';

export const ProductsScreen: React.FC = () => {
  const { colors: themeColors } = useTheme();
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (): Promise<void> => {
    try {
      const loadedProducts = await getProducts();
      setProducts(loadedProducts);
    } catch (error) {
      Alert.alert(t('common.error'), t('products.loadError'));
    }
  };

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const openModal = (product?: Product): void => {
    setEditingProduct(product || null);
    setModalVisible(true);
  };

  const closeModal = (): void => {
    setModalVisible(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = async (productData: Partial<Product>): Promise<void> => {
    console.log('ProductsScreen: handleSaveProduct called with:', productData);
    console.log('ProductsScreen: editingProduct:', editingProduct);
    
    try {
      if (editingProduct) {
        console.log('ProductsScreen: Updating existing product');
        const updatedProduct = await updateProduct(editingProduct.id, productData);
        console.log('ProductsScreen: Update result:', updatedProduct);
        if (updatedProduct) {
          setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
          Alert.alert('Éxito', 'Producto actualizado correctamente');
        } else {
          Alert.alert('Error', 'No se pudo actualizar el producto');
        }
      } else {
        console.log('ProductsScreen: Creating new product');
        // Validar que tenemos todos los campos requeridos
        if (!productData.name || !productData.price || productData.quantity === undefined) {
          console.log('ProductsScreen: Missing required fields');
          Alert.alert('Error', 'Todos los campos son requeridos');
          return;
        }

        const newProducts = await addProduct(productData as Omit<Product, 'id' | 'createdAt'>);
        console.log('ProductsScreen: Add result:', newProducts);
        if (newProducts && newProducts.length > 0) {
          setProducts(newProducts);
          Alert.alert('Éxito', 'Producto añadido correctamente');
        } else {
          Alert.alert('Error', 'No se pudo añadir el producto');
        }
      }
      closeModal();
    } catch (error) {
      console.error('ProductsScreen: Error saving product:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar el producto');
    }
  };

  const handleDeleteProduct = async (productId: string): Promise<void> => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este producto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await deleteProduct(productId);
              if (success) {
                setProducts(products.filter(p => p.id !== productId));
                Alert.alert('Éxito', 'Producto eliminado correctamente');
              } else {
                Alert.alert('Error', 'No se pudo eliminar el producto');
              }
            } catch (error) {
              Alert.alert('Error', 'Ocurrió un error al eliminar el producto');
            }
          },
        },
      ]
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onEdit={() => openModal(item)}
      onDelete={handleDeleteProduct}
      onAddToCart={() => {}} // No se usa en la pantalla de productos
      showActions={true}
    />
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Image 
        source={require('../../../assets/logoboc.png')} 
        style={styles.emptyLogo}
        resizeMode="contain"
      />
      <Text style={[styles.emptyTitle, { color: themeColors.text }]}>{t('products.empty.title')}</Text>
      <Text style={[styles.emptyText, { color: themeColors.textSecondary }]}>
        {t('products.empty.text')}
      </Text>
    </View>
  );

  return (
    <View style={[globalStyles.flex1, { backgroundColor: themeColors.background }]}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContainer, { backgroundColor: themeColors.background }]}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: themeColors.primary }]}
        onPress={() => openModal()}
      >
        <Text style={[styles.fabText, { color: themeColors.white }]}>+</Text>
      </TouchableOpacity>

      <ProductForm
        visible={modalVisible}
        product={editingProduct}
        onSave={handleSaveProduct}
        onCancel={closeModal}
      />
    </View>
  );
};
