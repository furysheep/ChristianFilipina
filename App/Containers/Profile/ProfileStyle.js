import { StyleSheet } from 'react-native'
import { Fonts, Helpers, Metrics, Colors } from 'App/Theme'
import ApplicationStyles from 'App/Theme/ApplicationStyles'

export default StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
    flex: 1,
  },
  titleContainer: {
    ...Helpers.colCenter,
  },
  profileName: {
    fontWeight: 'bold',
    ...Fonts.style.medium,
  },
  profileImageCard: { width: 200, alignSelf: 'center' },
  profileImageCardInner: {
    ...Helpers.noPadding,
  },
  profileImage: {
    width: 200,
    height: 200,
  },
  buttons: {
    position: 'absolute',
    bottom: 0,
    ...Helpers.row,
    alignSelf: 'center',
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
