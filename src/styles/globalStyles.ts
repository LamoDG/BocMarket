import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const colors = {
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
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

export const shadows = {
  small: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  medium: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  flex1: {
    flex: 1,
  },
  textCenter: {
    textAlign: 'center',
  },
  // Textos
  heading1: {
    fontSize: typography.xxxl,
    fontWeight: 'bold',
    color: colors.dark,
  },
  heading2: {
    fontSize: typography.xxl,
    fontWeight: 'bold',
    color: colors.dark,
  },
  heading3: {
    fontSize: typography.xl,
    fontWeight: '600',
    color: colors.dark,
  },
  bodyText: {
    fontSize: typography.md,
    color: colors.dark,
  },
  smallText: {
    fontSize: typography.sm,
    color: colors.gray,
  },
  // Botones
  button: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.secondary,
  },
  buttonSuccess: {
    backgroundColor: colors.success,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.md,
    fontWeight: '600',
  },
  buttonTextSmall: {
    color: colors.white,
    fontSize: typography.sm,
    fontWeight: '600',
  },
  // Inputs
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.md,
    backgroundColor: colors.white,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  // Cards
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    margin: spacing.sm,
    ...shadows.medium,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    paddingBottom: spacing.sm,
    marginBottom: spacing.md,
  },
  // Layout específico para tablets
  tabletContainer: {
    maxWidth: width > 768 ? 768 : width,
    alignSelf: 'center',
    width: '100%',
  },
});

export const isTablet = width > 600;
