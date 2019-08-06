import { StyleSheet } from 'react-native'
import { Fonts, Helpers, Metrics, Colors } from 'App/Theme'
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
    ...Helpers.fillColMain,
    marginLeft: Metrics.largeMargin,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  nameText: {
    fontWeight: 'bold',
    ...Fonts.style.medium,
    marginBottom: Metrics.smallMargin,
  },
  subjectText: {
    fontWeight: 'bold',
    marginBottom: Metrics.smallMargin,
  },
  messageText: {
    color: Colors.altText,
    marginBottom: Metrics.smallMargin,
  },
})
