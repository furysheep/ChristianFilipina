import { StyleSheet } from 'react-native'
import { Fonts, Metrics, Helpers, Colors } from 'App/Theme'
import ApplicationStyles from 'App/Theme/ApplicationStyles'

export default StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
    flex: 1,
    justifyContent: 'center',
  },
  lockedContainer: {
    flex: 1,
    padding: Metrics.baseMargin,
  },
  avatarContainer: {
    ...Helpers.rowCross,
  },
  lockIcon: {
    margin: Metrics.smallMargin,
  },
  upgradeContainer: {
    position: 'absolute',
    bottom: Metrics.largeMargin,
    left: 0,
    right: 0,
    padding: Metrics.baseMargin,
  },
  lockMessage: {
    color: Colors.destructive,
    flex: 1,
    marginRight: 100,
  },
  iconContainer: { width: 40, alignItems: 'center' },
  row: {
    ...Helpers.row,
    paddingVertical: Metrics.smallMargin,
  },
  benefitItem: {
    ...Helpers.fill,
    ...Helpers.rowCross,
  },
  fill: {
    marginHorizontal: Metrics.smallMargin,
    ...Helpers.fill,
  },
  benefitTitle: {
    color: Colors.primary,
  },
  benefitDesc: {
    fontSize: 10,
  },
})
