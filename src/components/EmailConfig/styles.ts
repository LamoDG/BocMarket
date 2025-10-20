import { StyleSheet } from 'react-native';
import { colors, spacing, typography, globalStyles, borderRadius } from '../../styles/globalStyles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.md,
    color: colors.gray,
  },
  section: {
    backgroundColor: colors.white,
    marginTop: spacing.sm,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  input: {
    ...globalStyles.input,
    marginBottom: spacing.sm,
  },
  helpText: {
    fontSize: typography.sm,
    color: colors.gray,
    fontStyle: 'italic',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  switchLabel: {
    fontSize: typography.md,
    fontWeight: '600',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  switchDescription: {
    fontSize: typography.sm,
    color: colors.gray,
  },
  buttonContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  testButton: {
    marginBottom: spacing.sm,
  },
  saveButton: {
    // Styles inherited from globalStyles
  },
  infoBox: {
    backgroundColor: colors.light,
    margin: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  infoTitle: {
    fontSize: typography.md,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: typography.sm,
    color: colors.gray,
    lineHeight: 20,
  },
  loadingText: {
    fontSize: typography.md,
    color: colors.gray,
  },
});
