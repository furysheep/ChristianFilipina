import React, { Component } from 'react'
import NavigationService from 'App/Services/NavigationService'
import AppNavigator from 'App/Navigators/AppNavigator'
import { View, Platform } from 'react-native'
import styles from './RootScreenStyle'
import { connect } from 'react-redux'
import StartupActions from 'App/Stores/Startup/Actions'
import { PropTypes } from 'prop-types'
import { ThemeProvider } from 'react-native-elements'
import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
  type ProductPurchase,
  type PurchaseError,
} from 'react-native-iap'

import { Colors, Metrics, Fonts } from 'App/Theme'
import { userService } from 'App/Services/UserService'
import UserActions from 'App/Stores/User/Actions'

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
      console.log('purchaseUpdatedListener', purchase)
      const receipt = purchase.transactionReceipt
      if (receipt) {
        console.log(purchase)
        userService
          .mobileUpgrade(
            purchase.productId,
            '',
            purchase.transactionId,
            purchase.transactionDate,
            '',
            purchase.transactionReceipt
          )
          .then((userLevel) => {
            this.props.updateUserLevel(userLevel)
            if (Platform.OS === 'ios') {
              RNIap.finishTransactionIOS(purchase.transactionId)
            } else if (Platform.OS === 'android') {
              // If consumable (can be purchased again)
              RNIap.consumePurchaseAndroid(purchase.purchaseToken)
              // If not consumable
              RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken)
            }
          })
          .catch((e) => console.log(e))
      }
    })

    this.purchaseErrorSubscription = purchaseErrorListener((error) => {
      console.warn('purchaseErrorListener', error)
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
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
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
  startup: PropTypes.func,
  updateUserLevel: PropTypes.func,
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup()),
  updateUserLevel: (userLevel) => dispatch(UserActions.updateUserLevel(userLevel)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RootScreen)
