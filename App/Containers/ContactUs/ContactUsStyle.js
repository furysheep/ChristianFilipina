import { StyleSheet } from 'react-native'
import { Fonts, Metrics, Helpers, Colors } from 'App/Theme'
import ApplicationStyles from 'App/Theme/ApplicationStyles'

export default StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
    flex: 1,
    padding: Metrics.largeMargin,
    backgroundColor: Colors.background,
  },
  multilineStyle: {
    ...Helpers.multilineStyle,
    height: 120,
  },
  sendButton: {
    backgroundColor: Colors.destructive,
  },
  divider: {
    backgroundColor: Colors.text,
    marginVertical: Metrics.smallMargin,
  },
  header: {
    ...Fonts.style.medium,
    marginTop: Metrics.largeMargin,
  },
})
