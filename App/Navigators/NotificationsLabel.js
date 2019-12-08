import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View } from 'react-native'
import { Badge, Text } from 'react-native-elements'
import { connect } from 'react-redux'
import { Helpers } from 'App/Theme'

const DrawerTextStyle = (tintColor) => ({
  fontWeight: 'bold',
  marginVertical: 15,
  color: tintColor,
})

class NotificationsLabel extends Component {
  render() {
    const { tintColor, text, notifications } = this.props
    const badge = notifications ? notifications.length : 0
    return (
      <View style={Helpers.row}>
        <Text style={DrawerTextStyle(tintColor)}>{text}</Text>
        {badge > 0 && <Badge value={`${badge}`} status="error" />}
      </View>
    )
  }
}

NotificationsLabel.propTypes = {
  notifications: PropTypes.array,
  tintColor: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
  notifications: state.notifications.notifications,
})

export default connect(mapStateToProps)(NotificationsLabel)
