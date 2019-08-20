import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text, Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import styles from './NotificationsStyle'
import { notificationService } from 'App/Services/NotificationService'

class Notifications extends React.Component {
  static navigationOptions = {
    headerRight: (
      <TouchableOpacity onPress={() => {}}>
        <Icon name="refresh" size={35} underlayColor={'#64b5f6'} />
      </TouchableOpacity>
    ),
  }

  componentDidMount() {
    notificationService.getRecentPushNotifications()
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>You've no notifications!</Text>
      </View>
    )
  }
}

Notifications.propTypes = {
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
)(Notifications)
