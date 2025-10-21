import { StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../styles/globalStyles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    ...shadows.small,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: typography.xxl,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  dateText: {
    fontSize: typography.md,
    color: colors.gray,
  },
  exportButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  exportButtonText: {
    fontSize: typography.md,
    color: colors.white,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  returnsButton: {
    backgroundColor: colors.secondary,
  },
  actionButtonText: {
    fontSize: typography.md,
    color: colors.white,
    fontWeight: '600',
  },
  bottomActionBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    gap: spacing.sm,
    ...shadows.small,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    fontSize: typography.lg,
    color: colors.gray,
    marginTop: spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    ...shadows.small,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statIcon: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  statTitle: {
    fontSize: typography.md,
    color: colors.gray,
    flex: 1,
  },
  statValue: {
    fontSize: typography.xxl,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  statSubtitle: {
    fontSize: typography.sm,
    color: colors.gray,
  },
  sectionTitle: {
    fontSize: typography.lg,
    color: colors.dark,
    margin: spacing.md,
    marginBottom: spacing.sm,
  },
  salesList: {
    paddingHorizontal: spacing.md,
  },
  saleItem: {
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.small,
  },
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  saleTime: {
    fontSize: typography.md,
    color: colors.gray,
  },
  saleAmount: {
    fontSize: typography.lg,
    color: colors.primary,
    fontWeight: '600',
  },
  salePayment: {
    fontSize: typography.sm,
    color: colors.gray,
    backgroundColor: colors.lightGray,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  saleProducts: {
    gap: spacing.xs,
  },
  saleProduct: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  productName: {
    fontSize: typography.md,
    color: colors.dark,
    flex: 1,
  },
  productDetails: {
    fontSize: typography.md,
    color: colors.gray,
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
  topProductsContainer: {
    margin: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    ...shadows.small,
  },
  topProductsHeader: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  topProductsTitle: {
    fontSize: typography.lg,
    color: colors.dark,
  },
  topProductItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  topProductInfo: {
    flex: 1,
  },
  topProductName: {
    fontSize: typography.md,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  topProductStats: {
    fontSize: typography.sm,
    color: colors.gray,
  },
  topProductRevenue: {
    fontSize: typography.md,
    color: colors.primary,
    fontWeight: '600',
  },
});
