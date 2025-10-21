import { StyleSheet } from 'react-native';
import { colors, spacing, typography, globalStyles, shadows, borderRadius } from '../../styles/globalStyles';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    margin: spacing.sm,
    ...shadows.medium,
  },
  cardOutOfStock: {
    opacity: 0.7,
    borderWidth: 1,
    borderColor: colors.danger + '30',
  },
  cardHeader: {
    ...globalStyles.row,
    ...globalStyles.spaceBetween,
  },
  productInfo: {
    ...globalStyles.flex1,
  },
  productName: {
    fontSize: typography.lg,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  productPrice: {
    fontSize: typography.xl,
    fontWeight: 'bold',
    color: colors.primary,
  },
  stockContainer: {
    alignItems: 'flex-end',
  },
  stockBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  stockText: {
    fontSize: typography.xs,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  quantityRow: {
    ...globalStyles.row,
    ...globalStyles.spaceBetween,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  quantityText: {
    fontSize: typography.sm,
    color: colors.gray,
  },
  cartQuantityText: {
    fontSize: typography.sm,
    color: colors.secondary,
    fontWeight: '600',
  },
  actionsContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  actionButtonsRow: {
    ...globalStyles.row,
    flex: 1,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: colors.warning + '20',
  },
  deleteButton: {
    backgroundColor: colors.danger + '20',
  },
  actionButtonText: {
    fontSize: typography.sm,
    fontWeight: '600',
  },
  addToCartButton: {
    backgroundColor: colors.success,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  addToCartButtonText: {
    color: colors.white,
    fontSize: typography.md,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: colors.gray,
  },
  disabledButtonText: {
    color: colors.lightGray,
  },
  // Estilos para variantes
  variantsContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  variantsTitle: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  variantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  variantName: {
    fontSize: typography.sm,
    color: colors.dark,
  },
  variantStock: {
    fontSize: typography.xs,
    fontWeight: '600',
  },
  // Modal para variantes
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    margin: spacing.lg,
    maxHeight: '70%',
    width: '90%',
    maxWidth: 400,
    ...shadows.large,
  },
  modalTitle: {
    fontSize: typography.lg,
    fontWeight: 'bold',
    color: colors.dark,
    padding: spacing.lg,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  variantOption: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  variantOptionDisabled: {
    opacity: 0.5,
    backgroundColor: colors.lightGray + '30',
  },
  variantOptionRow: {
    flexDirection: 'column',
    gap: spacing.sm,
  },
  variantInfo: {
    flex: 1,
  },
  variantOptionText: {
    fontSize: typography.md,
    color: colors.dark,
    fontWeight: '600',
  },
  variantOptionTextDisabled: {
    color: colors.gray,
  },
  variantOptionStock: {
    fontSize: typography.sm,
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  quantityButton: {
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: colors.white,
    fontSize: typography.md,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginLeft: spacing.sm,
  },
  addButtonText: {
    color: colors.white,
    fontSize: typography.sm,
    fontWeight: '600',
  },
  modalCancelButton: {
    padding: spacing.lg,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  modalCancelText: {
    fontSize: typography.md,
    color: colors.primary,
    fontWeight: '600',
  },
});
