import React from 'react'
import { View, TouchableOpacity, FlatList } from 'react-native'
import { Text, Icon, Avatar } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import firebase from 'react-native-firebase'

import styles from './NotificationsStyle'
import { notificationService } from 'App/Services/NotificationService'
import NavigationService from 'App/Services/NavigationService'
import { Config } from 'App/Config'

class SelectableItem extends React.Component {
  handleOnPress = () => {
    const { onPressItem, item } = this.props
    onPressItem(item)
  }

  render() {
    const {
      item: {
        pushnotification: { message, ref_userid: uid, date },
      },
    } = this.props

    return (
      <TouchableOpacity onPress={this.handleOnPress} style={styles.itemContainer}>
        <Avatar
          rounded
          source={{
            uri: `${Config.BASE_URL}${Config.USER_PICTURE_BASE_URL}?id=${uid}&width=300&height=300`,
          }}
          size="large"
        />
        <View style={styles.textSection}>
          <View style={styles.column}>
            <Text style={styles.nameText}>{message}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

SelectableItem.propTypes = {
  onPressItem: PropTypes.func,
  item: PropTypes.object,
}

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
    this.state = {
      refreshing: false,
      data: [],
    }
    props.navigation.setParams({
      refreshNotifications: this.refreshNotifications,
    })
  }

  refreshNotifications = async () => {
    this.setState({ refreshing: true })
    let data = []
    try {
      data = await notificationService.getRecentPushNotifications()
      console.log(data)
    } catch (e) {
      console.log(e)
    }
    this.setState({ data, refreshing: false })
  }

  componentDidMount() {
    firebase.analytics().setCurrentScreen('Notifications', 'Notifications')

    this.refreshNotifications()
  }

  handleOnPressItem = (item) => {
    switch (item.pushnotification.act) {
      case 'W':
        NavigationService.navigate('Profile', { id: item.pushnotification.ref_userid })
        break
      case 'M':
        NavigationService.navigate('Message', {
          id: item.pushnotification.ref_userid,
          firstName: item.pushnotification.firstname,
        })
        break
    }
  }

  renderItem = ({ item }) => {
    return <SelectableItem item={item} onPressItem={this.handleOnPressItem} />
  }

  render() {
    const { data, refreshing } = this.state
    return !refreshing && data.length === 0 ? (
      <View style={styles.container}>
        <Text>You've no notifications!</Text>
      </View>
    ) : (
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.pushnotification.id}
        renderItem={this.renderItem}
        onRefresh={this.refreshNotifications}
        refreshing={refreshing}
      />
    )
  }
}

Notifications.propTypes = {
  user: PropTypes.object,
  navigation: PropTypes.object,
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications)
