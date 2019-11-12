import React from 'react'
import { View, Image, Platform, ScrollView, Alert } from 'react-native'
import { Text } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import Spinner from 'react-native-loading-spinner-overlay'
import * as RNIap from 'react-native-iap'
import styles from './SubscriptionStyle'
import { Images } from 'App/Theme'
import { TouchableOpacity } from 'react-native-gesture-handler'
import firebase from 'react-native-firebase'

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
                this.setState({ loading: true })
                try {
                  await RNIap.requestSubscription(product.productId)
                } catch (err) {
                  console.warn(err.code, err.message)
                  setTimeout(() => Alert.alert(err.message), 500)
                }
                this.setState({ loading: false })
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
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Subscription)
