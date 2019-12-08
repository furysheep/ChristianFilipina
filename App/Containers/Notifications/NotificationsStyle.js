import { StyleSheet } from 'react-native'
import { Fonts, Helpers, Metrics, Colors } from 'App/Theme'
import ApplicationStyles from 'App/Theme/ApplicationStyles'

export default StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
  },
  noContainer: {
    ...ApplicationStyles.screen.container,
    ...Helpers.center,
  },
  badge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  badgeSize: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  itemContainer: {
    ...Helpers.row,
    paddingHorizontal: Metrics.baseMargin,
    paddingVertical: Metrics.smallMargin,
  },
  textSection: {
    ...Helpers.fillColMain,
    marginLeft: Metrics.largeMargin,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  column: {
    ...Helpers.fillColMain,
  },
  nameText: {
    fontWeight: 'bold',
    ...Fonts.style.medium,
    marginBottom: Metrics.smallMargin,
  },
  cityText: {
    color: Colors.altText,
    ...Fonts.style.medium,
    marginBottom: Metrics.smallMargin,
  },
  row: {
    ...Helpers.row,
    ...Helpers.mainSpaceBetween,
  },
})
