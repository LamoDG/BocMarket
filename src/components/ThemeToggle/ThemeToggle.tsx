import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { spacing, typography, borderRadius } from '../../styles/globalStyles';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, colors } = useTheme();

  const styles = {
    container: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: colors.surface,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      marginVertical: spacing.sm,
    },
    label: {
      fontSize: typography.md,
      color: colors.text,
      flex: 1,
      fontWeight: '600' as const,
    },
    toggleContainer: {
      flexDirection: 'row' as const,
      backgroundColor: colors.lightGray,
      borderRadius: borderRadius.lg,
      padding: spacing.xs,
    },
    toggleOption: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.md,
      minWidth: 60,
      alignItems: 'center' as const,
    },
    activeToggle: {
      backgroundColor: colors.primary,
    },
    inactiveToggle: {
      backgroundColor: 'transparent',
    },
    toggleText: {
      fontSize: typography.sm,
      fontWeight: '600' as const,
    },
    activeText: {
      color: colors.white,
    },
    inactiveText: {
      color: colors.textSecondary,
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>🌓 Tema</Text>
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleOption,
            theme === 'light' ? styles.activeToggle : styles.inactiveToggle
          ]}
          onPress={() => theme !== 'light' && toggleTheme()}
        >
          <Text style={[
            styles.toggleText,
            theme === 'light' ? styles.activeText : styles.inactiveText
          ]}>
            ☀️ Claro
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.toggleOption,
            theme === 'dark' ? styles.activeToggle : styles.inactiveToggle
          ]}
          onPress={() => theme !== 'dark' && toggleTheme()}
        >
          <Text style={[
            styles.toggleText,
            theme === 'dark' ? styles.activeText : styles.inactiveText
          ]}>
            🌙 Oscuro
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};