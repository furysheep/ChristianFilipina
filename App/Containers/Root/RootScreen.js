import React, { Component } from 'react'
import NavigationService from 'App/Services/NavigationService'
import AppNavigator from 'App/Navigators/AppNavigator'
import { View, Platform, AsyncStorage } from 'react-native'
import styles from './RootScreenStyle'
import { connect } from 'react-redux'
import StartupActions from 'App/Stores/Startup/Actions'
import { PropTypes } from 'prop-types'
import { ThemeProvider, Button, Text, Image } from 'react-native-elements'
import firebase from 'react-native-firebase'
import Modal from 'react-native-modal'
import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
  type ProductPurchase,
  type PurchaseError,
} from 'react-native-iap'

import { Colors, Metrics, Fonts, Helpers } from 'App/Theme'
import { userService } from 'App/Services/UserService'
import UserActions from 'App/Stores/User/Actions'
import { ChatService } from 'App/Services/ChatService'
import { Config } from 'App/Config'

const theme = {
  colors: {
    primary: Colors.primary,
    error: Colors.destructive,
  },
  CheckBox: {
    textStyle: {
      fontSize: Fonts.size.regular,
      fontWeight: 'normal',
      color: Colors.text,
    },
    containerStyle: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
  },
  Text: {
    style: {
      color: Colors.text,
      fontSize: Fonts.size.regular,
    },
  },
  Input: {
    inputContainerStyle: {
      borderBottomWidth: 0,
      marginBottom: Metrics.largeMargin,
      backgroundColor: 'white',
    },
    leftIconContainerStyle: {
      paddingRight: Metrics.baseMargin,
    },
    inputStyle: {
      fontSize: Fonts.size.regular,
    },
  },
}

class RootScreen extends Component {
  purchaseUpdateSubscription = null
  purchaseErrorSubscription = null

  componentDidMount() {
    this.props.startup()
    this.purchaseUpdateSubscription = purchaseUpdatedListener((purchase) => {
      // console.log('purchaseUpdatedListener', purchase)
      const receipt = purchase.transactionReceipt
      if (receipt) {
        const isAndroid = Platform.OS === 'android'
        userService
          .mobileUpgrade(
            purchase.productId,
            isAndroid ? purchase.signatureAndroid : '',
            purchase.transactionId,
            purchase.transactionDate,
            isAndroid ? purchase.transactionReceipt : '',
            isAndroid ? '' : purchase.transactionReceipt
          )
          .then((userLevel) => {
            console.log('updateUserLevel', userLevel)
            this.props.updateUserLevel(userLevel)
          })
          .catch((e) => console.log(e))
        if (Platform.OS === 'ios') {
          console.log('finish transaction')
          RNIap.finishTransactionIOS(purchase.transactionId)
        } else if (Platform.OS === 'android') {
          // If consumable (can be purchased again)
          // RNIap.consumePurchaseAndroid(purchase.purchaseToken)
          // If not consumable
          RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken)
        }
      }
    })

    this.purchaseErrorSubscription = purchaseErrorListener((error) => {
      console.warn('purchaseErrorListener', error)
    })

    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(async (fcmToken) => {
      // Process your token as required
      console.log('Token', fcmToken)
      AsyncStorage.setItem('FCM_TOKEN', fcmToken)
      const result = await userService.updateUserDeviceToken(fcmToken)
      console.log('updateUserDeviceToken', result)
    })
  }

  componentWillUnmount() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove()
      this.purchaseUpdateSubscription = null
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove()
      this.purchaseErrorSubscription = null
    }

    this.onTokenRefreshListener()
  }

  confirmDialog = async (id, firstName) => {
    NavigationService.navigate('VideoChat', { id, firstName, caller: false })
    this.props.setIncomingUserId(null, null)
  }

  hideDialog = () => {
    this.props.setIncomingUserId(null, null)
  }

  render() {
    const { incomingUserId, incomingUser } = this.props
    return (
      <ThemeProvider theme={theme}>
        {incomingUser && (
          <Modal isVisible={!!incomingUserId}>
            <View style={styles.modalContent}>
              <View style={Helpers.rowCross}>
                <View style={Helpers.colCross}>
                  <Image
                    source={{
                      uri: `${Config.BASE_URL}${
                        Config.USER_PICTURE_BASE_URL
                      }?id=${incomingUserId}&width=200&height=200`,
                    }}
                    style={styles.profileImage}
                  />
                  <Text style={styles.nameText}>{`${incomingUser.firstName}, ${
                    incomingUser.age
                  }`}</Text>
                  <Text>{`${incomingUser.city ? `${incomingUser.city}, ` : ''}${
                    incomingUser.countryCode
                  }`}</Text>
                </View>
                <Text style={styles.modalText}>
                  {incomingUser.firstName} requested to video chat with you. Would you like to
                  accept this request?
                </Text>
              </View>

              <View style={styles.buttons}>
                <Button
                  titleStyle={styles.buttonTitleStyle}
                  onPress={this.confirmDialog.bind(this, incomingUserId, incomingUser.firstName)}
                  title="Accept"
                />
                <Button
                  titleStyle={styles.buttonTitleStyle}
                  onPress={this.hideDialog}
                  buttonStyle={styles.declineButton}
                  title="Decline"
                />
              </View>
            </View>
          </Modal>
        )}

        <View style={styles.container}>
          <AppNavigator
            // Initialize the NavigationService (see https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html)
            ref={(navigatorRef) => {
              NavigationService.setTopLevelNavigator(navigatorRef)
            }}
          />
        </View>
      </ThemeProvider>
    )
  }
}

RootScreen.propTypes = {
  incomingUserId: PropTypes.number,
  incomingUser: PropTypes.object,
  updateUserLevel: PropTypes.func,
  setIncomingUserId: PropTypes.func,
}

const mapStateToProps = (state) => ({
  incomingUserId: state.user.incomingUserId,
  incomingUser: state.user.incomingUser,
})

const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup()),
  updateUserLevel: (userLevel) => dispatch(UserActions.updateUserLevel(userLevel)),
  setIncomingUserId: (userId, user) => dispatch(UserActions.setIncomingUserId(userId, user)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RootScreen)
