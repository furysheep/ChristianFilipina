import { StyleSheet } from 'react-native'
import ApplicationStyles from 'App/Theme/ApplicationStyles'
import { Metrics, Colors, Helpers } from 'App/Theme'

export default StyleSheet.create({
  container: {
    ...ApplicationStyles.screen.container,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  profileImage: {
    width: 100,
    height: 100,
  },
  modalText: {
    flex: 1,
    fontSize: 17,
    marginLeft: Metrics.baseMargin,
    marginBottom: Metrics.largeMargin,
  },
  buttonTitleStyle: {
    paddingHorizontal: 10,
  },
  declineButton: {
    backgroundColor: Colors.destructive,
    marginLeft: Metrics.baseMargin,
  },
  buttons: {
    marginTop: Metrics.baseMargin,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  nameText: {
    color: Colors.destructive,
  },
})
