import { StyleSheet } from 'react-native'
import Colors from 'App/Theme/Colors'
import ApplicationStyles from 'App/Theme/ApplicationStyles'

export default StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  splash: {
    flex: 1,
    width: null,
    height: null,
  },
  bgTopContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgTop: {
    width: '100%',
  },
})
