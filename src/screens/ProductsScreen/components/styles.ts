import { StyleSheet } from 'react-native';
import { colors, spacing, typography, globalStyles, borderRadius, shadows } from '../../../styles/globalStyles';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    height: '80%',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    height: '100%',
    minHeight: 500,
  },
  modalTitle: {
    fontSize: typography.xl,
    fontWeight: 'bold',
    color: colors.dark,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  formScrollView: {
    flexGrow: 1,
    marginBottom: spacing.lg,
    minHeight: 300,
  },
  form: {
    paddingBottom: spacing.md,
  },
  inputLabel: {
    fontSize: typography.md,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    ...globalStyles.input,
  },
  inputError: {
    borderColor: colors.danger,
    borderWidth: 2,
  },
  errorText: {
    fontSize: typography.sm,
    color: colors.danger,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.light,
    borderRadius: borderRadius.md,
  },
  variantsSection: {
    marginTop: spacing.md,
  },
  variantsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addVariantButton: {
    backgroundColor: colors.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  addVariantText: {
    color: colors.white,
    fontSize: typography.sm,
    fontWeight: 'bold',
  },
  variantContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.light,
    borderRadius: borderRadius.md,
    width: '100%',
  },
  variantInputs: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginRight: spacing.sm,
  },
  variantNameContainer: {
    flex: 2,
  },
  variantQuantityContainer: {
    flex: 1,
  },
  variantLabel: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  variantInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.md,
    color: colors.dark,
  },
  removeVariantButton: {
    backgroundColor: colors.danger,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  removeVariantText: {
    color: colors.white,
    fontSize: typography.md,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.lightGray,
  },
  cancelButtonText: {
    color: colors.dark,
    fontSize: typography.md,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: typography.md,
    fontWeight: 'bold',
  },
});
