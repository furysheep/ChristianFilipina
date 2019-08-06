import { StyleSheet } from 'react-native'
import ApplicationStyles from 'App/Theme/ApplicationStyles'
import { Colors, Fonts, Helpers, Metrics } from 'App/Theme'

export default StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
    flex: 1,
  },
  profileImageCard: { width: 200, alignSelf: 'center' },
  profileImage: {
    width: 200,
    height: 200,
  },
  gameX: {
    position: 'absolute',
    top: -100,
    left: -40,
  },
  gameHeart: {
    position: 'absolute',
    top: -100,
    right: -40,
  },
  topText: {
    alignSelf: 'center',
    ...Fonts.style.medium,
  },
  header: {
    ...Helpers.row,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    padding: Metrics.smallMargin,
  },
  headerTextStyle: {
    flex: 1,
    marginLeft: Metrics.smallMargin,
    color: 'white',
    fontWeight: 'bold',
  },
  description: {
    padding: Metrics.smallMargin,
  },
  specifiedSection: {
    marginVertical: Metrics.baseMargin,
  },
  specifiedIcon: {
    marginHorizontal: Metrics.smallMargin,
    tintColor: Colors.text,
  },
  specifiedText: {
    ...Fonts.style.medium,
    color: Colors.destructive,
    paddingLeft: Metrics.largeMargin,
  },
  footer: {
    padding: Metrics.baseMargin,
  },
})
