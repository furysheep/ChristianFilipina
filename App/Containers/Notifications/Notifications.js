import React from 'react'
import { View, TouchableOpacity, FlatList } from 'react-native'
import { Text, Icon, Avatar, Badge } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import firebase from 'react-native-firebase'
import moment from 'moment'

import styles from './NotificationsStyle'
import NotificationsActions from 'App/Stores/Notifications/Actions'
import NavigationService from 'App/Services/NavigationService'
import { Config } from 'App/Config'

class SelectableItem extends React.Component {
  handleOnPress = () => {
    const { onPressItem, item } = this.props
    onPressItem(item)
  }

  render() {
    const {
      item: { message, ref_userid: uid, firstname, date, is_online: isOnline },
    } = this.props

    return (
      <TouchableOpacity onPress={this.handleOnPress} style={styles.itemContainer}>
        <View>
          <Avatar
            rounded
            source={{
              uri: `${Config.BASE_URL}${
                Config.USER_PICTURE_BASE_URL
              }?id=${uid}&width=300&height=300`,
            }}
            size="large"
          />
          {isOnline === 1 && (
            <Badge status="success" containerStyle={styles.badge} badgeStyle={styles.badgeSize} />
          )}
        </View>
        <View style={styles.textSection}>
          <View style={styles.column}>
            <Text style={styles.nameText}>{firstname}</Text>
            <Text style={styles.cityText}>{message}</Text>
            <View style={styles.row}>
              <Text style={styles.viewText}>Click to view</Text>
              <Text style={styles.viewText}>{moment.unix(date).fromNow()}</Text>
            </View>
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

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.notifications !== prevState.data || nextProps.loading !== prevState.refreshing) {
      return { refreshing: nextProps.loading, data: nextProps.notifications }
    }
    return null
  }

  refreshNotifications = () => {
    this.props.getNotifications()
  }

  componentDidMount() {
    firebase.analytics().setCurrentScreen('Notifications', 'Notifications')

    this.refreshNotifications()
  }

  handleOnPressItem = (item) => {
    switch (item.pushnotification.act) {
      case 'M':
        NavigationService.navigate('Message', {
          id: item.pushnotification.ref_userid,
          firstName: item.pushnotification.firstname,
        })
        break
      default:
        // case 'W':
        NavigationService.navigate('Profile', { id: item.pushnotification.ref_userid })
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
        <Text>{"You've no notifications!"}</Text>
      </View>
    ) : (
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.id}
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
  getNotifications: PropTypes.func.isRequired,
  notifications: PropTypes.array,
  loading: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
  notifications: state.notifications.notifications,
  loading: state.notifications.loading,
})

const mapDispatchToProps = (dispatch) => ({
  getNotifications: () => dispatch(NotificationsActions.getNotifications()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications)
