import { StyleSheet } from 'react-native'
import { Fonts, Metrics, Colors, Helpers } from 'App/Theme'
import ApplicationStyles from 'App/Theme/ApplicationStyles'

export default StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
    flex: 1,
    justifyContent: 'center',
  },
  itemContainer: {
    ...Helpers.row,
    padding: Metrics.largeMargin,
  },
  textSection: {
    ...Helpers.fillRowCross,
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
  viewText: {
    color: Colors.altText,
    marginBottom: Metrics.smallMargin,
  },
  like: {
    width: 50,
    height: 50,
  },
})
