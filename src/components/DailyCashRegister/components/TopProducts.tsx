import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';
import type { DailyReport } from '../../../types';

interface TopProductsProps {
  topProducts: DailyReport['topProducts'];
}

export const TopProducts: React.FC<TopProductsProps> = ({ topProducts }) => {
  if (topProducts.length === 0) {
    return null;
  }

  return (
    <View style={styles.topProductsContainer}>
      <View style={styles.topProductsHeader}>
        <Text style={styles.topProductsTitle}>🏆 Productos más vendidos</Text>
      </View>
      
      {topProducts.map((product, index) => (
        <View 
          key={product.name} 
          style={[
            styles.topProductItem,
            index === topProducts.length - 1 && { borderBottomWidth: 0 }
          ]}
        >
          <View style={styles.topProductInfo}>
            <Text style={styles.topProductName}>{product.name}</Text>
            <Text style={styles.topProductStats}>
              {product.quantity} unidades vendidas
            </Text>
          </View>
          <Text style={styles.topProductRevenue}>
            €{product.revenue.toFixed(2)}
          </Text>
        </View>
      ))}
    </View>
  );
};
