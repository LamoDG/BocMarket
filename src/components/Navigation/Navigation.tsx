import React from 'react';
import { View, TouchableOpacity, Text, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import type { NavigationProps, TabType } from '../../types';
import { styles } from './styles';

interface TabConfig {
  key: TabType;
  icon: string;
  label: string;
}

const Navigation: React.FC<NavigationProps> = ({ 
  currentTab, 
  onTabChange, 
  children
}) => {
  const { colors: themeColors } = useTheme();
  const { t } = useLanguage();
  
  const tabs: TabConfig[] = [
    { key: 'products', icon: '📦', label: t('nav.products') },
    { key: 'store', icon: '🏪', label: t('nav.store') },
    { key: 'register', icon: '📊', label: t('nav.register') },
    { key: 'about', icon: '🎵', label: t('nav.about') },
  ];
  
  const handleTabPress = (tab: TabType): void => {
    onTabChange(tab);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.content}>
          {children}
        </View>
        
        <View style={[styles.tabBar, { backgroundColor: themeColors.surface, borderTopColor: themeColors.border }]}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                currentTab === tab.key && { backgroundColor: themeColors.primary },
              ]}
              onPress={() => handleTabPress(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text
                style={[
                  styles.tabText,
                  { color: themeColors.textSecondary },
                  currentTab === tab.key && { color: themeColors.white },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export { Navigation };
export default Navigation;
