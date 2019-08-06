import { StyleSheet } from 'react-native'
import { Fonts, Helpers, Metrics } from 'App/Theme'
import ApplicationStyles from 'App/Theme/ApplicationStyles'

export default StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
    flex: 1,
    padding: Metrics.largeMargin,
  },
  row: {
    ...Helpers.row,
    paddingVertical: Metrics.smallMargin,
  },
  fill: {
    ...Helpers.fill,
  },
  benefitItem: {
    ...Helpers.fill,
    ...Helpers.rowCross,
  },
})
