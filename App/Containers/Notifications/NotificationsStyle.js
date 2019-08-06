import { StyleSheet } from 'react-native'
import { Fonts, Helpers } from 'App/Theme'
import ApplicationStyles from 'App/Theme/ApplicationStyles'

export default StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
    flex: 1,
    ...Helpers.center,
  },
})
