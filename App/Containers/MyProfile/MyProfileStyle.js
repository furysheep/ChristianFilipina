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
  requiredField: {
    color: 'red',
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
    paddingLeft: Metrics.baseMargin,
  },
  saveButton: {
    width: '50%',
    alignSelf: 'center',
  },
  inputContainer: {
    alignSelf: 'stretch',
    paddingHorizontal: 10,
    marginBottom: Metrics.largeMargin,
  },
  input: {
    paddingLeft: Metrics.baseMargin,
  },
  datePicker: { backgroundColor: 'white', width: '100%' },
  dateIcon: {
    position: 'absolute',
    left: 0,
    marginLeft: 10,
  },
})
