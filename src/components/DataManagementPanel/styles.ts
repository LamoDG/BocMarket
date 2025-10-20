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
  backButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.md,
  },
  backButtonText: {
    fontSize: typography.md,
    color: colors.white,
    fontWeight: '600',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: typography.lg,
    color: colors.white,
    fontWeight: 'bold',
  },
  title: {
    fontSize: typography.xxl,
    color: colors.dark,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  sectionHeader: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  sectionTitle: {
    fontSize: typography.lg,
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  sectionDescription: {
    fontSize: typography.md,
    color: colors.gray,
    lineHeight: 20,
  },
  sectionContent: {
    padding: spacing.md,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  actionButtonSecondary: {
    backgroundColor: colors.secondary,
  },
  actionButtonWarning: {
    backgroundColor: colors.warning,
  },
  actionButtonDanger: {
    backgroundColor: colors.danger,
  },
  actionButtonText: {
    fontSize: typography.md,
    color: colors.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: colors.gray,
    opacity: 0.6,
  },
  loadingText: {
    fontSize: typography.md,
    color: colors.gray,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoBox: {
    backgroundColor: colors.lightGray,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  infoText: {
    fontSize: typography.md,
    color: colors.dark,
    lineHeight: 20,
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFECB5',
    borderWidth: 1,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  warningText: {
    fontSize: typography.md,
    color: '#856404',
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  buttonHalf: {
    flex: 1,
  },
});
