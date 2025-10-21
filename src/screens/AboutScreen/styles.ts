import { StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../../styles/globalStyles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingVertical: spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: spacing.lg,
    borderRadius: 60,
    backgroundColor: '#000000',
    padding: spacing.md,
  },
  title: {
    fontSize: typography.xxxl,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.lg,
    color: colors.gray,
    fontStyle: 'italic',
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.lightGray,
    ...shadows.small,
  },
  sectionTitle: {
    fontSize: typography.xl,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.md,
    color: colors.gray,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  highlight: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoLabel: {
    fontSize: typography.md,
    color: colors.gray,
  },
  infoValue: {
    fontSize: typography.md,
    fontWeight: '600',
    color: colors.dark,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginTop: spacing.lg,
  },
  footerText: {
    fontSize: typography.sm,
    color: colors.gray,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  logoButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoOnly: {
    width: 40,
    height: 40,
  },
});