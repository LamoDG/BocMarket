import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

// Colores para tema claro
export const lightColors = {
  primary: '#2E86AB',
  secondary: '#A23B72',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  light: '#F8FAFC',
  dark: '#1E293B',
  gray: '#64748B',
  lightGray: '#E2E8F0',
  white: '#FFFFFF',
  black: '#000000',
  // Colores específicos para componentes
  background: '#FFFFFF',
  surface: '#F8FAFC',
  text: '#1E293B',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  cardBackground: '#FFFFFF',
  modalBackground: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// Colores para tema oscuro
export const darkColors = {
  primary: '#3B9EC7',
  secondary: '#C45794',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#F87171',
  light: '#374151',
  dark: '#F9FAFB',
  gray: '#9CA3AF',
  lightGray: '#4B5563',
  white: '#FFFFFF',
  black: '#000000',
  // Colores específicos para componentes
  background: '#111827',
  surface: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
  cardBackground: '#1F2937',
  modalBackground: '#1F2937',
  overlay: 'rgba(0, 0, 0, 0.7)',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'bocmarket_theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };

  const saveTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, newTheme);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveTheme(newTheme);
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};