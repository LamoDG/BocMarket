import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { styles } from '../styles';
import type { StatCardProps } from '../../../types';

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color 
}) => {
  const { colors: themeColors } = useTheme();
  const { t } = useLanguage();
  const cardColor = color || themeColors.primary;
  
  return (
    <View style={[styles.statCard, { 
      borderLeftColor: cardColor, 
      backgroundColor: themeColors.cardBackground 
    }]}>
      <View style={styles.statHeader}>
        <Text style={styles.statIcon}>{icon}</Text>
        <Text style={[styles.statTitle, { color: themeColors.text }]}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color: cardColor }]}>{value}</Text>
      {subtitle && <Text style={[styles.statSubtitle, { color: themeColors.textSecondary }]}>{subtitle}</Text>}
    </View>
  );
};
