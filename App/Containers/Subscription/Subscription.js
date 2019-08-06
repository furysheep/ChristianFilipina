import React from 'react'
import { View, Image } from 'react-native'
import { Text } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import styles from './SubscriptionStyle'
import { Images } from 'App/Theme'

class Subscription extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Benefits of a paid member:</Text>
        <View style={styles.row}>
          <View style={styles.benefitItem}>
            <Image source={Images.greenTick} />
            <Text style={styles.fill}>Communicate with any member</Text>
          </View>
          <View style={styles.benefitItem}>
            <Image source={Images.greenTick} />
            <Text style={styles.fill}>Unlock all messages</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.benefitItem}>
            <Image source={Images.greenTick} />
            <Text style={styles.fill}>Email, chat & webcam access</Text>
          </View>
          <View style={styles.benefitItem}>
            <Image source={Images.greenTick} />
            <Text style={styles.fill}>Partner Discounts</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.benefitItem}>
            <Image source={Images.greenTick} />
            <Text style={styles.fill}>See all profile visitors</Text>
          </View>
          <View style={styles.benefitItem}>
            <Image source={Images.greenTick} />
            <Text style={styles.fill}>Custom messages</Text>
          </View>
        </View>
      </View>
    )
  }
}

Subscription.propTypes = {
  user: PropTypes.object,
  userIsLoading: PropTypes.bool,
  userErrorMessage: PropTypes.string,
  fetchUser: PropTypes.func,
  liveInEurope: PropTypes.bool,
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Subscription)
