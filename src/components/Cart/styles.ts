import { StyleSheet } from 'react-native';
import { colors, spacing, typography, globalStyles, borderRadius, shadows } from '../../styles/globalStyles';

export const styles = StyleSheet.create({
  cartContainer: {
    flex: 1,
    backgroundColor: colors.light,
  },
  cartHeader: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  cartTitle: {
    fontSize: typography.xl,
    fontWeight: 'bold',
    color: colors.dark,
  },
  cartCount: {
    fontSize: typography.sm,
    color: colors.gray,
    marginTop: spacing.xs,
  },
  cartList: {
    flex: 1,
    padding: spacing.sm,
  },
  cartItem: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.medium,
  },
  cartItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: typography.lg,
    fontWeight: 'bold',
    color: colors.dark,
  },
  variantName: {
    fontSize: typography.sm,
    color: colors.gray,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  removeButton: {
    padding: spacing.xs,
  },
  removeButtonText: {
    fontSize: typography.lg,
  },
  priceRow: {
    ...globalStyles.row,
    ...globalStyles.spaceBetween,
  },
  productPrice: {
    fontSize: typography.md,
    color: colors.gray,
  },
  itemTotal: {
    fontSize: typography.lg,
    fontWeight: 'bold',
    color: colors.primary,
  },
  quantityContainer: {
    ...globalStyles.row,
    ...globalStyles.spaceBetween,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  quantityLabel: {
    fontSize: typography.md,
    color: colors.dark,
    fontWeight: '600',
  },
  quantityControls: {
    ...globalStyles.row,
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    backgroundColor: colors.lightGray,
  },
  quantityButtonText: {
    color: colors.white,
    fontSize: typography.lg,
    fontWeight: 'bold',
  },
  quantityButtonTextDisabled: {
    color: colors.gray,
  },
  quantityText: {
    fontSize: typography.lg,
    fontWeight: 'bold',
    color: colors.dark,
    marginHorizontal: spacing.md,
    minWidth: 32,
    textAlign: 'center',
  },
  stockWarning: {
    fontSize: typography.sm,
    color: colors.warning,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  cartFooter: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  totalLabel: {
    fontSize: typography.xl,
    fontWeight: 'bold',
    color: colors.dark,
  },
  totalAmount: {
    fontSize: typography.xxl,
    fontWeight: 'bold',
    color: colors.success,
  },
  checkoutButton: {
    ...globalStyles.button,
    ...globalStyles.buttonSuccess,
    paddingVertical: spacing.lg,
  },
  checkoutButtonText: {
    ...globalStyles.buttonText,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyCartIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyCartTitle: {
    fontSize: typography.xl,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  emptyCartText: {
    fontSize: typography.md,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
});
