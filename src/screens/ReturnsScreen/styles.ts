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
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    fontSize: typography.xxl,
    color: colors.dark,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.lightGray,
  },
  closeButtonText: {
    fontSize: typography.lg,
    color: colors.dark,
  },
  subtitle: {
    fontSize: typography.md,
    color: colors.gray,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  salesList: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  saleItem: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  saleId: {
    fontSize: typography.md,
    fontWeight: 'bold',
    color: colors.primary,
  },
  saleDate: {
    fontSize: typography.sm,
    color: colors.gray,
  },
  saleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  saleAmount: {
    fontSize: typography.lg,
    fontWeight: 'bold',
    color: colors.success,
  },
  saleMethod: {
    fontSize: typography.sm,
    color: colors.gray,
  },
  saleItems: {
    fontSize: typography.sm,
    color: colors.gray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.lg,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.md,
    color: colors.gray,
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    margin: spacing.md,
    maxHeight: '90%',
    width: '90%',
  },
  modalTitle: {
    fontSize: typography.lg,
    fontWeight: 'bold',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  returnItemsList: {
    maxHeight: 300,
    marginBottom: spacing.md,
  },
  returnItem: {
    backgroundColor: colors.light,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  returnItemHeader: {
    marginBottom: spacing.sm,
  },
  returnItemName: {
    fontSize: typography.md,
    fontWeight: 'bold',
    color: colors.dark,
  },
  returnItemVariant: {
    fontSize: typography.sm,
    color: colors.gray,
  },
  returnItemControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  returnItemPrice: {
    fontSize: typography.md,
    color: colors.primary,
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quantityButton: {
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: colors.white,
    fontSize: typography.md,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: typography.md,
    fontWeight: 'bold',
    color: colors.dark,
    minWidth: 30,
    textAlign: 'center',
  },
  returnItemTotal: {
    fontSize: typography.md,
    fontWeight: 'bold',
    color: colors.success,
  },
  availableQuantity: {
    fontSize: typography.xs,
    color: colors.gray,
    textAlign: 'right',
  },
  returnReasonContainer: {
    marginBottom: spacing.md,
  },
  returnReasonLabel: {
    fontSize: typography.md,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  returnReasonInput: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: typography.md,
    backgroundColor: colors.white,
    textAlignVertical: 'top',
  },
  returnTotal: {
    backgroundColor: colors.light,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  returnTotalText: {
    fontSize: typography.lg,
    fontWeight: 'bold',
    color: colors.success,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.lightGray,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: typography.md,
    fontWeight: '600',
    color: colors.dark,
  },
  processButton: {
    flex: 1,
    backgroundColor: colors.danger,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  processButtonText: {
    fontSize: typography.md,
    fontWeight: '600',
    color: colors.white,
  },
});