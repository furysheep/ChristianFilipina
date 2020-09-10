import React from 'react'
import { View, Image, Platform, ScrollView, Alert, Linking } from 'react-native'
import { Text } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import Spinner from 'react-native-loading-spinner-overlay'
import styles from './SubscriptionStyle'
import { Images, Colors } from 'App/Theme'
import { TouchableOpacity } from 'react-native-gesture-handler'
import firebase from 'react-native-firebase'
import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener,
  type ProductPurchase,
  type PurchaseError,
} from 'react-native-iap'
import FAIcon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'

import UserActions from 'App/Stores/User/Actions'
import { userService } from 'App/Services/UserService'
import { User, getSubscriptionLevel } from '../../Services/ApiClient'

class Subscription extends React.Component {
  items = Platform.select({
    ios: [
      // 'com.christianfilipina.app.platinum_monthly3',
      // 'com.christianfilipina.app.silver_monthly3',
      // 'com.christianfilipina.ChristianFilipinaiOSClient.christianfilipinaOneYearAccess',
      'air.com.christianfilipina.mobile.gold3months',
    ],
    android: ['air.com.christianfilipina.mobile.gold3months'],
  })

  constructor() {
    super()
    this.state = { products: [], loading: false }
  }

  async componentDidMount() {
    const { user } = this.props
    console.log(user)
    this.setState({ loading: true })
    firebase.analytics().setCurrentScreen('Subscriptions', 'Subscriptions')

    try {
      const products = await RNIap.getSubscriptions(this.items)
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

  showAlert = (message) => {
    this.setState({ loading: false })
    setTimeout(() => {
      Alert.alert(null, message)
    }, 500)
  }

  callSupport = () => {
    Linking.openURL(`tel:+18005781469`)
  }

  render() {
    const { products, loading } = this.state
    const { user } = this.props
    const Item = ({ key, onPress, title, price, description }) => {
      return (
        <TouchableOpacity style={styles.productContainer} key={key} onPress={onPress}>
          <Text style={styles.productTitle}>{title}</Text>
          <View>
            <Text style={styles.productPrice}>{price}</Text>
            <Text style={styles.productDesc}>{description}</Text>
          </View>
        </TouchableOpacity>
      )
    }
    return (
      <ScrollView style={styles.scrollView}>
        <Spinner visible={loading} />
        <View style={styles.container}>
          {user.userLevel === User.FREE ? (
            <>
              {products.map((product, index) => (
                <Item
                  key={index}
                  onPress={async () => {
                    try {
                      await RNIap.requestSubscription(product.productId)
                    } catch (err) {
                      console.warn(err.code, err.message)
                      // setTimeout(() => Alert.alert(null, err.message), 500)
                    }
                  }}
                  title={product.title}
                  price={product.localizedPrice}
                  description={product.description}
                />
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
              <TouchableOpacity
                style={styles.restoreButton}
                onPress={async () => {
                  try {
                    this.setState({ loading: true })
                    const purchases = await RNIap.getAvailablePurchases()
                    let receipts = []

                    purchases.forEach((purchase) => {
                      if (purchase.productId === this.items[0]) {
                        receipts.push(purchase)
                      }
                    })
                    if (receipts.length > 0) {
                      const receipt = receipts.sort(
                        (a, b) => b.transactionDate - a.transactionDate
                      )[0]
                      const isAndroid = Platform.OS === 'android'
                      userService
                        .mobileUpgrade(
                          receipt.productId,
                          isAndroid ? receipt.signatureAndroid : '',
                          receipt.transactionId,
                          receipt.transactionDate,
                          isAndroid ? receipt.transactionReceipt : '',
                          isAndroid ? '' : receipt.transactionReceipt
                        )
                        .then((userLevel) => {
                          this.props.updateUserLevel(userLevel)
                          this.showAlert('You restored Gold membership.')
                        })
                        .catch((e) => {
                          this.showAlert(e.message)
                        })
                        .finally(() => {})
                    } else {
                      this.showAlert('No items to restore.')
                    }
                  } catch (err) {
                    console.warn(err) // standardized err.code and err.message available
                    this.showAlert(err.message)
                  }
                }}
              >
                <Text style={styles.restore}>Restore purchase</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Item
              key={1}
              title="Account Overview"
              price={`Subscription Level: ${getSubscriptionLevel(user.userLevel)}`}
              description={`Expiration Date: ${moment.unix(user.levelend).format('MMMM DD, YYYY')}`}
            />
          )}
          {user.userLevel === User.FREE || user.userLevel === User.GOLD ? (
            <>
              <Text>
                {`• Renewal: Subscription automatically renews every 3 months unless auto renew is turned off at least 24 hours before the end of the current period.\n• The account will be charged for renewal within 24 hours prior to the end of the current period.\n• To manage your subscription or turn off auto-renewal`}
              </Text>
              <Text style={{ marginLeft: 20 }}>
                {`• Go to Settings > iTunes & App Store
• Tap your Apple ID at the top of the screen
• Tap View Apple ID. You might need to sign in or use Touch ID
• Tap Subscriptions
• Tap the subscription you want to manage.
• Use the options to manage your subscription`}
              </Text>
              <TouchableOpacity
                onPress={this.callSupport}
                style={{
                  flex: 1,
                  borderRadius: 5,
                  overflow: 'hidden',
                  marginVertical: 30,
                  flexDirection: 'row',
                }}
              >
                <View
                  style={{
                    backgroundColor: Colors.primary,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                  }}
                >
                  <FAIcon name="mobile" size={36} color="white" />
                  <Text
                    style={{ color: 'white', marginLeft: 10, textAlign: 'center' }}
                  >{`Call us\nNOW`}</Text>
                </View>
                <View
                  style={{ backgroundColor: 'white', alignItems: 'center', padding: 10, flex: 1 }}
                >
                  <Text style={{ color: Colors.destructive, fontSize: 26 }}>(800) 578-1469</Text>
                  <Text style={{ textAlign: 'center', fontSize: 10 }}>
                    Our team members will guide you through the upgrade process if you prefer
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text>
                {`• For subscription and upgrade assistance, you can call us through the following numbers`}
              </Text>
              <Text style={{ marginLeft: 20 }}>
                {`1-800-578-1469 (toll-free from USA - and usually Canada)
USA # 415-991-6998 from inside or outside USA/Canada
604-670-5477 in Canada
02-8880-5162 in Australia
9-887-5076 in New Zealand
1344-231492 in United Kingdom`}
              </Text>
              <Text>
                {`• Our team mmebers will guide you through the upgrade process if you prefer. We are available 24 hours a day.`}
              </Text>
              <TouchableOpacity
                onPress={this.callSupport}
                style={{ flex: 1, borderRadius: 5, overflow: 'hidden', marginVertical: 30 }}
              >
                <View
                  style={{
                    backgroundColor: Colors.primary,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                  }}
                >
                  <FAIcon name="mobile" size={36} color="white" />
                  <Text style={{ color: 'white', marginLeft: 10 }}>{`Call us\nTODAY!`}</Text>
                </View>
                <View style={{ backgroundColor: 'white', alignItems: 'center', padding: 10 }}>
                  <Text style={{ color: Colors.destructive, fontSize: 26 }}>(800) 578-1469</Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    )
  }
}

Subscription.propTypes = {
  user: PropTypes.object,
  updateUserLevel: PropTypes.func,
}

const mapStateToProps = (state) => ({
  user: state.user.user,
})

const mapDispatchToProps = (dispatch) => ({
  updateUserLevel: (userLevel) => dispatch(UserActions.updateUserLevel(userLevel)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Subscription)
