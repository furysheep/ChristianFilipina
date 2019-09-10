import React from 'react'
import { View } from 'react-native'
import { Image, Badge } from 'react-native-elements'
import { connect } from 'react-redux'
import { Images } from 'App/Theme'

const MessageIcon = (props) => {
  const { tintColor, notification } = props
  const badge = notification ? notification['unread_messages'] : 0
  return (
    <View>
      <Image source={Images.messageMenuIcon} style={{ tintColor }} />
      {badge > 0 && (
        <Badge
          containerStyle={{ position: 'absolute', right: -10, top: -5 }}
          value={`${badge}`}
          status="error"
        />
      )}
    </View>
  )
}

const mapStateToProps = (state) => ({
  notification: state.user.notification,
})

export default connect(mapStateToProps)(MessageIcon)
