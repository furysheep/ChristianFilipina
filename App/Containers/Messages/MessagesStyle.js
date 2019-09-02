import { StyleSheet } from 'react-native'
import { Fonts, Helpers, Metrics, Colors } from 'App/Theme'
import ApplicationStyles from 'App/Theme/ApplicationStyles'

export default StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
    flex: 1,
    justifyContent: 'center',
  },
  itemContainer: {
    ...Helpers.row,
    paddingHorizontal: Metrics.baseMargin,
    paddingVertical: Metrics.smallMargin,
  },
  textSection: {
    ...Helpers.fillColMain,
    marginLeft: Metrics.largeMargin,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
  },
  newMatchContainer: {
    ...Helpers.rowCross,
  },
  newMatchText: {
    marginLeft: Metrics.smallMargin,
    color: Colors.destructive,
  },
  nameContainer: {
    ...Helpers.rowCross,
    ...Helpers.selfStretch,
    marginBottom: Metrics.smallMargin,
  },
  nameText: {
    fontWeight: 'bold',
    ...Fonts.style.medium,
    marginRight: Metrics.smallMargin,
  },
  subjectText: {
    fontWeight: 'bold',
    marginBottom: Metrics.smallMargin,
  },
  messageText: {
    color: Colors.altText,
    marginBottom: Metrics.smallMargin,
  },
  unreadMessageText: {
    color: Colors.destructive,
    fontWeight: 'bold',
    marginBottom: Metrics.smallMargin,
  },
  notificationText: {
    color: Colors.primary,
    marginBottom: Metrics.smallMargin,
  },
  editButton: {
    padding: Metrics.baseMargin,
  },
  buttons: {
    ...Helpers.rowCross,
  },
  deleteButton: {
    backgroundColor: Colors.destructive,
    width: 30,
    height: 30,
  },
})
