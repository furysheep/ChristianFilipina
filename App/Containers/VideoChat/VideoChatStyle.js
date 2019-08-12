import { StyleSheet } from 'react-native'
import { Fonts, Metrics, Colors, Helpers } from 'App/Theme'
import ApplicationStyles from 'App/Theme/ApplicationStyles'

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  listViewContainer: {
    height: 150,
  },
  remoteView: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  selfView: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 150,
    height: 266,
  },
  callButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.success,
    borderRadius: 5,
    justifyContent: 'center',
  },
  videoButton: {
    marginHorizontal: Metrics.baseMargin,
    width: 40,
    height: 40,
    backgroundColor: Colors.primary,
    borderRadius: 5,
    justifyContent: 'center',
  },
  hangupButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.destructive,
    borderRadius: 5,
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.3,
  },
  endCallButton: {
    backgroundColor: Colors.destructive,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalText: {
    fontSize: 17,
    marginBottom: 20,
  },
  buttonTitleStyle: {
    paddingHorizontal: 10,
  },
  buttons: {
    alignSelf: 'center',
    flexDirection: 'row',
  },
})
