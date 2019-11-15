import { StyleSheet } from 'react-native'
import { Fonts, Helpers, Metrics, Colors } from 'App/Theme'
import ApplicationStyles from 'App/Theme/ApplicationStyles'

export default StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
    flex: 1,
    ...Helpers.center,
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
    color: Colors.altText,
    ...Fonts.style.medium,
    marginBottom: Metrics.smallMargin,
  },
})
