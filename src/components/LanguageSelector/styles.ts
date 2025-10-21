import { StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../styles/globalStyles';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.lightGray,
    ...shadows.small,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.md,
  },
  languageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  languageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.lightGray,
    minHeight: 50,
  },
  flag: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  languageName: {
    fontSize: typography.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
});