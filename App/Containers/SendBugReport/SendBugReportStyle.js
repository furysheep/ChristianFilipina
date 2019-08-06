import { StyleSheet } from 'react-native'
import { Fonts, Metrics, Helpers, Colors } from 'App/Theme'
import ApplicationStyles from 'App/Theme/ApplicationStyles'

export default StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
    flex: 1,
    padding: Metrics.baseMargin,
    backgroundColor: Colors.background,
  },
  multilineStyle: {
    ...Helpers.multilineStyle,
    height: 120,
  },
  problem: {
    marginTop: Metrics.baseMargin,
  },
})
