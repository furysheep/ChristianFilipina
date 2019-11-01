import { StyleSheet } from 'react-native'
import { Fonts, Colors, Helpers, Metrics } from 'App/Theme'
import ApplicationStyles from 'App/Theme/ApplicationStyles'

export default StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
    flex: 1,
    backgroundColor: Colors.background,
  },
  dialogInput: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  grid: {
    flex: 1,
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
    right: 0,
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
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
  saveSearch: {
    backgroundColor: Colors.destructive,
  },
})
