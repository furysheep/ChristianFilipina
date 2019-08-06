import { StyleSheet } from 'react-native'
import { Fonts, Colors, Helpers, Metrics } from 'App/Theme'
import ApplicationStyles from 'App/Theme/ApplicationStyles'

export default StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
    flex: 1,
  },
  modal: {
    justifyContent: 'flex-end',
    flex: 1,
    // somehow top goes off screen when not full screen
    paddingTop: 55,
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
