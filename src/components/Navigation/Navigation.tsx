import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import type { NavigationProps, TabType } from '../../types';
import { styles } from './styles';

interface TabConfig {
  key: TabType;
  icon: string;
  label: string;
}

const tabs: TabConfig[] = [
  { key: 'products', icon: '📦', label: 'Productos' },
  { key: 'store', icon: '🏪', label: 'Tienda' },
  { key: 'register', icon: '⚙️', label: 'Configuración' },
];

const Navigation: React.FC<NavigationProps> = ({ 
  currentTab, 
  onTabChange, 
  children 
}) => {
  const handleTabPress = (tab: TabType): void => {
    onTabChange(tab);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>
      
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              currentTab === tab.key && styles.activeTab,
            ]}
            onPress={() => handleTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text
              style={[
                styles.tabText,
                currentTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export { Navigation };
export default Navigation;
