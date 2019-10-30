import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text, Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import firebase from 'react-native-firebase'

import styles from './NotificationsStyle'
import { notificationService } from 'App/Services/NotificationService'

class Notifications extends React.Component {
  static navigationOptions = ({ navigation }) => {
    if (!navigation.state.params) return null
    return {
      headerRight: (
        <TouchableOpacity onPress={navigation.state.params.refreshNotifications}>
          <Icon name="refresh" size={35} underlayColor={'#64b5f6'} />
        </TouchableOpacity>
      ),
    }
  }

  constructor(props) {
    super(props)
    props.navigation.setParams({
      refreshNotifications: this.refreshNotifications,
    })
  }

  refreshNotifications = async () => {
    const data = await notificationService.getRecentPushNotifications()
    console.log(data)
  }

  componentDidMount() {
    firebase.analytics().setCurrentScreen('Notifications', 'Notifications')
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
  navigation: PropTypes.object,
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications)
