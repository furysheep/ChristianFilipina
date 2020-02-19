import React from 'react'
import { View, Image, Platform, ScrollView, Alert } from 'react-native'
import { Text } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import Spinner from 'react-native-loading-spinner-overlay'
import styles from './SubscriptionStyle'
import { Images } from 'App/Theme'
import { TouchableOpacity } from 'react-native-gesture-handler'
import firebase from 'react-native-firebase'
import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
  type ProductPurchase,
  type PurchaseError,
} from 'react-native-iap'

import UserActions from 'App/Stores/User/Actions'
import { userService } from 'App/Services/UserService'

class Subscription extends React.Component {
  constructor() {
    super()
    this.state = { products: [], loading: false }
  }

  async componentDidMount() {
    this.setState({ loading: true })
    firebase.analytics().setCurrentScreen('Subscriptions', 'Subscriptions')
    const items = Platform.select({
      ios: [
        // 'com.christianfilipina.app.platinum_monthly3',
        // 'com.christianfilipina.app.silver_monthly3',
        // 'com.christianfilipina.ChristianFilipinaiOSClient.christianfilipinaOneYearAccess',
        'air.com.christianfilipina.mobile.gold3months',
      ],
      android: ['air.com.christianfilipina.mobile.gold3months'],
    })

    try {
      const products = await RNIap.getSubscriptions(items)
      console.log('products', products)
      this.setState({ products })
    } catch (err) {
      console.warn(err) // standardized err.code and err.message available
    }
    this.setState({ loading: false })

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
            Alert.alert(null, 'Your purchase was successful')
          })
          .catch((e) => console.log(e))
          .finally(() => {})
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
    const { products, loading } = this.state
    return (
      <ScrollView style={styles.scrollView}>
        <Spinner visible={loading} />
        <View style={styles.container}>
          {products.map((product, index) => (
            <TouchableOpacity
              style={styles.productContainer}
              key={index}
              onPress={async () => {
                try {
                  await RNIap.requestSubscription(product.productId)
                } catch (err) {
                  console.warn(err.code, err.message)
                  setTimeout(() => Alert.alert(null, err.message), 500)
                }
              }}
            >
              <Text style={styles.productTitle}>{product.title}</Text>
              <View>
                <Text style={styles.productPrice}>{product.localizedPrice}</Text>
                <Text style={styles.productDesc}>{product.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <Text>Benefits of a Gold Membership:</Text>
          <View style={styles.row}>
            <View style={styles.benefitItem}>
              <Image source={Images.greenTick} />
              <Text style={styles.fill}>Live Video Chat with our members</Text>
            </View>
            <View style={styles.benefitItem}>
              <Image source={Images.greenTick} />
              <Text style={styles.fill}>Send 50 custom messages per day</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.benefitItem}>
              <Image source={Images.greenTick} />
              <Text style={styles.fill}>Exchange Contact Details</Text>
            </View>
            <View style={styles.benefitItem}>
              <Image source={Images.greenTick} />
              <Text style={styles.fill}>60-Min Consultation with your Romance Consultant</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.benefitItem}>
              <Image source={Images.greenTick} />
              <Text style={styles.fill}>Send Unlimited Winks per day</Text>
            </View>
            <View style={styles.benefitItem}>
              <Image source={Images.greenTick} />
              <Text style={styles.fill}>Membership discounts with our partners</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}

Subscription.propTypes = {
  user: PropTypes.object,
  updateUserLevel: PropTypes.func,
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({
  updateUserLevel: (userLevel) => dispatch(UserActions.updateUserLevel(userLevel)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Subscription)
