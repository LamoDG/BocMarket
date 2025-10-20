import { StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../styles/globalStyles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.xs,
  },
  activeTab: {
    backgroundColor: colors.primary + '20',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  tabText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.gray,
  },
  activeTabText: {
    color: colors.primary,
  },
});
