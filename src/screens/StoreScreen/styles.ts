import { StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../styles/globalStyles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md, // Reducido desde spacing.lg para mejor uso del espacio
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    // Asegurar que el header tenga espacio seguro
    minHeight: 60,
  },
  headerTitle: {
    fontSize: typography.xxl,
    color: colors.dark,
  },
  cartButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md, // Aumentado desde spacing.sm para mayor área de toque
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 44, // Área de toque mínima recomendada
    minWidth: 80,
  },
  cartButtonText: {
    fontSize: typography.md,
    color: colors.white,
    fontWeight: '600',
  },
  cartBadge: {
    backgroundColor: colors.white,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  productsList: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  productItem: {
    marginBottom: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.lg,
    color: colors.dark,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.md,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  lastUpdated: {
    fontSize: typography.sm,
    color: colors.gray,
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
});
