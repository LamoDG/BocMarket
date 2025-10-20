import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';
import type { Sale } from '../../../types';

interface SaleItemProps {
  sale: Sale;
}

export const SaleItem: React.FC<SaleItemProps> = ({ sale }) => (
  <View style={styles.saleItem}>
    <View style={styles.saleHeader}>
      <Text style={styles.saleTime}>
        {new Date(sale.date).toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </Text>
      <Text style={styles.saleAmount}>€{sale.totalAmount.toFixed(2)}</Text>
    </View>
    
    <Text style={styles.salePayment}>
      {sale.paymentMethod === 'efectivo' ? '💰 Efectivo' : '💳 Tarjeta'}
    </Text>
    
    <View style={styles.saleProducts}>
      {sale.items.map((item, index) => (
        <View key={index} style={styles.saleProduct}>
          <Text style={styles.productName}>{item.productName}</Text>
          <Text style={styles.productDetails}>
            {item.quantity}x €{item.unitPrice.toFixed(2)}
          </Text>
        </View>
      ))}
    </View>
  </View>
);
