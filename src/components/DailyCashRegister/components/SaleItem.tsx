import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { styles } from '../styles';
import type { Sale } from '../../../types';

interface SaleItemProps {
  sale: Sale;
}

export const SaleItem: React.FC<SaleItemProps> = ({ sale }) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.saleItem, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
      <View style={styles.saleHeader}>
        <Text style={[styles.saleTime, { color: colors.textSecondary }]}>
          {new Date(sale.date).toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
        <Text style={[styles.saleAmount, { color: colors.primary }]}>€{sale.totalAmount.toFixed(2)}</Text>
      </View>
      
      <Text style={[styles.salePayment, { color: colors.textSecondary, backgroundColor: colors.lightGray }]}>
        {sale.paymentMethod === 'efectivo' ? '💰 Efectivo' : '💳 Tarjeta'}
      </Text>
    
      <View style={styles.saleProducts}>
        {sale.items.map((item, index) => (
          <View key={index} style={styles.saleProduct}>
            <Text style={[styles.productName, { color: colors.text }]}>
              {item.productName}
              {item.variant && <Text style={[styles.variantText, { color: colors.primary }]}> ({item.variant})</Text>}
            </Text>
            <Text style={[styles.productDetails, { color: colors.textSecondary }]}>
              {item.quantity}x €{item.unitPrice.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
