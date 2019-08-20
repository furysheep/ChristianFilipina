import { StyleSheet } from 'react-native'
import { Fonts, Colors, Helpers, Metrics } from 'App/Theme'
import ApplicationStyles from 'App/Theme/ApplicationStyles'

export default StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileContainer: {
    padding: 4,
    backgroundColor: 'white',
  },
  profileSmallImage: {
    aspectRatio: 1,
    width: 50,
    margin: 5,
  },
  infoContainer: {
    ...Helpers.colMain,
    flex: 1,
  },
  profileImage: { aspectRatio: 1 },
  nameText: {
    color: Colors.destructive,
  },
  buttonsContainer: {
    position: 'absolute',
    left: 0,
    right: 10,
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  buttonImage: {
    width: 40,
    height: 40,
  },
  marginRight: {
    marginRight: Metrics.baseMargin,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
})
