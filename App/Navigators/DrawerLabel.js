import React, { Component } from 'react'
import { View } from 'react-native'
import { Badge, Text } from 'react-native-elements'
import { connect } from 'react-redux'
import { Helpers } from 'App/Theme'

const DrawerTextStyle = (tintColor) => ({
  fontWeight: 'bold',
  marginVertical: 15,
  color: tintColor,
})

export class DrawerLabel extends Component {
  render() {
    const { text, tintColor, notification, label } = this.props

    const badge = notification ? notification[label] : 0
    return (
      <View style={Helpers.row}>
        <Text style={DrawerTextStyle(tintColor)}>{text}</Text>
        {badge > 0 && <Badge value={`${badge}`} status="error" />}
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  notification: state.user.notification,
})

export default connect(mapStateToProps)(DrawerLabel)
