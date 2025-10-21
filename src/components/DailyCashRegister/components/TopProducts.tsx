import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { styles } from '../styles';
import type { DailyReport } from '../../../types';

interface TopProductsProps {
  topProducts: DailyReport['topProducts'];
}

export const TopProducts: React.FC<TopProductsProps> = ({ topProducts }) => {
  const { colors: themeColors } = useTheme();
  const { t } = useLanguage();
  if (topProducts.length === 0) {
    return null;
  }

  return (
    <View style={[styles.topProductsContainer, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.border }]}>
      <View style={[styles.topProductsHeader, { borderBottomColor: themeColors.border }]}>
        <Text style={[styles.topProductsTitle, { color: themeColors.text }]}>{t('register.topProducts')}</Text>
      </View>
      
      {topProducts.map((product, index) => (
        <View 
          key={product.name} 
          style={[
            styles.topProductItem,
            { borderBottomColor: themeColors.border },
            index === topProducts.length - 1 && { borderBottomWidth: 0 }
          ]}
        >
          <View style={styles.topProductInfo}>
            <Text style={[styles.topProductName, { color: themeColors.text }]}>{product.name}</Text>
            <Text style={[styles.topProductStats, { color: themeColors.textSecondary }]}>
              {product.quantity} {t('register.unitsSold')}
            </Text>
          </View>
          <Text style={[styles.topProductRevenue, { color: themeColors.primary }]}>
            €{product.revenue.toFixed(2)}
          </Text>
        </View>
      ))}
    </View>
  );
};
