import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  RefreshControl,
} from 'react-native';
import { getSales, processReturn } from '../../utils/storage';
import { styles } from './styles';
import type { Sale, Return, ReturnItem } from '../../types';

interface ReturnsScreenProps {
  visible: boolean;
  onClose: () => void;
}

const ReturnsScreen: React.FC<ReturnsScreenProps> = ({ visible, onClose }) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [returnReason, setReturnReason] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [showReturnModal, setShowReturnModal] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      loadSales();
    }
  }, [visible]);

  const loadSales = async (): Promise<void> => {
    try {
      const loadedSales = await getSales();
      // Mostrar solo las ventas de los últimos 30 días
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentSales = loadedSales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= thirtyDaysAgo;
      });
      
      setSales(recentSales);
    } catch (error) {
      console.error('Error loading sales:', error);
      Alert.alert('Error', 'No se pudieron cargar las ventas');
    }
  };

  const onRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadSales();
    setRefreshing(false);
  };

  const handleSelectSale = (sale: Sale): void => {
    setSelectedSale(sale);
    
    // Inicializar items para devolución
    const initialReturnItems: ReturnItem[] = sale.items.map(item => ({
      ...item,
      originalSaleId: sale.id,
      quantity: 0, // Empezar con 0, el usuario seleccionará la cantidad
    }));
    
    setReturnItems(initialReturnItems);
    setReturnReason('');
    setShowReturnModal(true);
  };

  const updateReturnQuantity = (index: number, quantity: number): void => {
    const updatedItems = [...returnItems];
    const maxQuantity = selectedSale?.items[index]?.quantity || 0;
    
    if (quantity < 0) quantity = 0;
    if (quantity > maxQuantity) quantity = maxQuantity;
    
    updatedItems[index] = {
      ...updatedItems[index],
      quantity,
      totalPrice: quantity * updatedItems[index].unitPrice,
    };
    
    setReturnItems(updatedItems);
  };

  const calculateReturnTotal = (): number => {
    return returnItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleProcessReturn = async (): Promise<void> => {
    if (!selectedSale) return;
    
    const itemsToReturn = returnItems.filter(item => item.quantity > 0);
    
    if (itemsToReturn.length === 0) {
      Alert.alert('Error', 'Debes seleccionar al menos un producto para devolver');
      return;
    }
    
    if (returnReason.trim().length < 3) {
      Alert.alert('Error', 'Debes proporcionar una razón para la devolución');
      return;
    }

    try {
      const result = await processReturn({
        originalSaleId: selectedSale.id,
        items: itemsToReturn,
        reason: returnReason.trim(),
      });

      if (result.success) {
        Alert.alert(
          'Devolución procesada',
          'La devolución se ha procesado correctamente. El inventario ha sido actualizado.',
          [
            {
              text: 'OK',
              onPress: () => {
                setShowReturnModal(false);
                setSelectedSale(null);
                loadSales();
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', result.message || 'No se pudo procesar la devolución');
      }
    } catch (error) {
      console.error('Error processing return:', error);
      Alert.alert('Error', 'Ocurrió un error al procesar la devolución');
    }
  };

  const renderSaleItem = ({ item }: { item: Sale }) => (
    <TouchableOpacity
      style={styles.saleItem}
      onPress={() => handleSelectSale(item)}
      activeOpacity={0.7}
    >
      <View style={styles.saleHeader}>
        <Text style={styles.saleId}>#{item.id.slice(-6)}</Text>
        <Text style={styles.saleDate}>
          {new Date(item.date).toLocaleDateString('es-ES')}
        </Text>
      </View>
      
      <View style={styles.saleDetails}>
        <Text style={styles.saleAmount}>€{item.totalAmount.toFixed(2)}</Text>
        <Text style={styles.saleMethod}>
          {item.paymentMethod === 'efectivo' ? '💰' : '💳'} {item.paymentMethod}
        </Text>
      </View>
      
      <Text style={styles.saleItems}>
        {item.items.length} producto{item.items.length !== 1 ? 's' : ''}
      </Text>
    </TouchableOpacity>
  );

  const renderReturnItem = ({ item, index }: { item: ReturnItem; index: number }) => (
    <View style={styles.returnItem}>
      <View style={styles.returnItemHeader}>
        <Text style={styles.returnItemName}>{item.productName}</Text>
        {item.variant && (
          <Text style={styles.returnItemVariant}>{item.variant}</Text>
        )}
      </View>
      
      <View style={styles.returnItemControls}>
        <Text style={styles.returnItemPrice}>€{item.unitPrice.toFixed(2)}</Text>
        
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateReturnQuantity(index, item.quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateReturnQuantity(index, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.returnItemTotal}>
          €{item.totalPrice.toFixed(2)}
        </Text>
      </View>
      
      <Text style={styles.availableQuantity}>
        Máximo: {selectedSale?.items[index]?.quantity || 0}
      </Text>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🔄 Devoluciones</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Selecciona una venta de los últimos 30 días para procesar una devolución
        </Text>

        <FlatList
          data={sales}
          renderItem={renderSaleItem}
          keyExtractor={(item) => item.id}
          style={styles.salesList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyTitle}>No hay ventas recientes</Text>
              <Text style={styles.emptyText}>
                No se encontraron ventas en los últimos 30 días
              </Text>
            </View>
          )}
        />

        {/* Modal de devolución */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showReturnModal}
          onRequestClose={() => setShowReturnModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>
                Devolución - Venta #{selectedSale?.id.slice(-6)}
              </Text>

              <FlatList
                data={returnItems}
                renderItem={renderReturnItem}
                keyExtractor={(item, index) => `${item.productId}-${index}`}
                style={styles.returnItemsList}
              />

              <View style={styles.returnReasonContainer}>
                <Text style={styles.returnReasonLabel}>Razón de la devolución:</Text>
                <TextInput
                  style={styles.returnReasonInput}
                  value={returnReason}
                  onChangeText={setReturnReason}
                  placeholder="Ej: Producto defectuoso, talla incorrecta..."
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.returnTotal}>
                <Text style={styles.returnTotalText}>
                  Total a devolver: €{calculateReturnTotal().toFixed(2)}
                </Text>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowReturnModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.processButton}
                  onPress={handleProcessReturn}
                >
                  <Text style={styles.processButtonText}>Procesar Devolución</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

export default ReturnsScreen;