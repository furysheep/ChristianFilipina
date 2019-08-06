import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics, Helpers } from 'App/Theme'
import ApplicationStyles from 'App/Theme/ApplicationStyles'

export default StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    padding: Metrics.largeMargin,
  },
  profileImageContainer: {
    ...Helpers.rowCenter,
    marginBottom: Metrics.baseMargin,
  },
  profileImageDesc: {
    marginLeft: 10,
    flex: 1,
  },
  rowCross: {
    ...Helpers.rowCross,
  },
  fill: {
    ...Helpers.fill,
  },
  multilineStyle: {
    height: 100,
    ...Helpers.multilineStyle,
  },
  saveButton: {
    width: '50%',
    alignSelf: 'center',
  },
})
