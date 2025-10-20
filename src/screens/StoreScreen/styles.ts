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
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    fontSize: typography.xxl,
    color: colors.dark,
  },
  cartButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
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
