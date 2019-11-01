import { StyleSheet } from 'react-native'
import { Fonts, Colors, Helpers, Metrics } from 'App/Theme'
import ApplicationStyles from 'App/Theme/ApplicationStyles'

export default StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
    flex: 1,
  },
  dialogInput: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  modal: {
    backgroundColor: 'black',
    opacity: 0.2,
    flex: 1,
  },
  scrollView: {},
  powerSearch: {
    backgroundColor: Colors.destructive,
    marginRight: Metrics.baseMargin,
  },
  sectionHeader: {
    ...Fonts.style.large,
    fontWeight: 'bold',
    marginLeft: Metrics.baseMargin,
    color: Colors.altText,
    marginTop: Metrics.baseMargin,
  },
  buttons: {
    margin: Metrics.baseMargin,
    marginBottom: Metrics.largeMargin,
    ...Helpers.row,
    ...Helpers.mainEnd,
  },
  noResults: {
    alignSelf: 'center',
  },
})
