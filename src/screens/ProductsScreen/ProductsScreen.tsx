import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Product } from '../../types';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../utils/storage';
import ProductCard from '../../components/ProductCard';
import { ProductForm } from './components/ProductForm';
import { styles } from './styles';
import { globalStyles } from '../../styles/globalStyles';

export const ProductsScreen: React.FC = () => {
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
      Alert.alert('Error', 'No se pudieron cargar los productos');
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
    try {
      if (editingProduct) {
        const updatedProduct = await updateProduct(editingProduct.id, productData);
        if (updatedProduct) {
          setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
          Alert.alert('Éxito', 'Producto actualizado correctamente');
        } else {
          Alert.alert('Error', 'No se pudo actualizar el producto');
        }
      } else {
        // Validar que tenemos todos los campos requeridos
        if (!productData.name || !productData.price || productData.quantity === undefined) {
          Alert.alert('Error', 'Todos los campos son requeridos');
          return;
        }

        const newProducts = await addProduct(productData as Omit<Product, 'id' | 'createdAt'>);
        if (newProducts && newProducts.length > 0) {
          setProducts(newProducts);
          Alert.alert('Éxito', 'Producto añadido correctamente');
        } else {
          Alert.alert('Error', 'No se pudo añadir el producto');
        }
      }
      closeModal();
    } catch (error) {
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
      <Text style={styles.emptyIcon}>📦</Text>
      <Text style={styles.emptyTitle}>No hay productos</Text>
      <Text style={styles.emptyText}>
        Añade tu primer producto tocando el botón de abajo
      </Text>
    </View>
  );

  return (
    <View style={globalStyles.flex1}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => openModal()}
      >
        <Text style={styles.fabText}>+</Text>
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
