import React, { Fragment } from 'react'
import { ActivityIndicator, View, FlatList, TouchableOpacity, Alert } from 'react-native'
import { Text, Avatar, Badge, Icon, Button } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import Spinner from 'react-native-loading-spinner-overlay'
import { connectActionSheet } from '@expo/react-native-action-sheet'
import firebase from 'react-native-firebase'

import styles from './MessagesStyle'
import NavigationService from 'App/Services/NavigationService'
import { ChatService } from 'App/Services/ChatService'
import { Colors, Images } from 'App/Theme'
import { userService } from 'App/Services/UserService'

class SelectableItem extends React.Component {
  handleOnPress = () => {
    const { onPressItem, item } = this.props
    if (item.status !== 'active' && item.status !== 'approval') {
      Alert.alert(
        `Sorry, the profile for User ${item.userid} is suspended`,
        null,
        [
          {
            text: 'OK',
            onPress: () => {},
          },
        ],
        { cancellable: false }
      )
      return
    }
    onPressItem(item)
  }

  onDelete = () => {
    const { onDelete, item } = this.props
    onDelete(item)
  }

  onMore = () => {
    const { onMore, item } = this.props
    onMore(item)
  }

  render() {
    const {
      item: {
        firstname,
        age,
        subject,
        message,
        imageUrl,
        match_type: matchType,
        user_is_online: isOnline,
        message_unread: unread,
      },
      editing,
    } = this.props

    return (
      <TouchableOpacity onPress={this.handleOnPress} style={styles.itemContainer}>
        <View>
          <Avatar rounded source={{ uri: imageUrl }} size="large" />
          {isOnline === 'yes' && (
            <Badge status="success" containerStyle={styles.badge} badgeStyle={styles.badgeSize} />
          )}
        </View>
        <View style={styles.textSection}>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>
              {firstname}, {age}
            </Text>

            <View style={{ flex: 1 }} />
            {(matchType === 'new' || matchType === 'old') && (
              <View style={styles.newMatchContainer}>
                <Icon type="ionicon" name="md-heart" color={Colors.destructive} />
                <Text style={styles.newMatchText}>
                  {matchType === 'new' ? 'NEW MATCH' : 'MATCH'}
                </Text>
              </View>
            )}
          </View>
          {subject && subject.length !== 0 ? (
            <Text style={styles.subjectText}>{subject}</Text>
          ) : null}
          {message && message.length !== 0 ? (
            <Text style={unread === 'yes' ? styles.unreadMessageText : styles.messageText}>
              {message}
            </Text>
          ) : null}
          {matchType === 'new' && (
            <Text style={styles.notificationText}>Click to send a message</Text>
          )}
        </View>
        {editing && (
          <View style={styles.buttons}>
            <Icon
              reverse
              name="delete"
              size={15}
              color={Colors.destructive}
              onPress={this.onDelete}
            />
            <Icon
              reverse
              name="more-horiz"
              size={15}
              color={Colors.success}
              onPress={this.onMore}
            />
          </View>
        )}
      </TouchableOpacity>
    )
  }
}

SelectableItem.propTypes = {
  onPressItem: PropTypes.func,
  onDelete: PropTypes.func,
  onMore: PropTypes.func,
  item: PropTypes.object,
}

class Messages extends React.Component {
  constructor(props) {
    super(props)
    this.page = 0
    this.state = {
      data: [],
      refreshing: false,
      editing: false,
      loading: false,
      loadingMore: false,
      endReached: false,
    }
  }

  componentDidMount() {
    firebase.analytics().setCurrentScreen('Messages', 'Messages')
    this.props.navigation.setParams({
      onEdit: this.onEdit,
      editing: this.state.editing,
    })

    this.onRefresh()

    userService.resetMessagesNotification()
  }

  onEdit = () => {
    let { editing } = this.state
    editing = !editing
    this.props.navigation.setParams({
      editing,
    })
    this.setState({ editing })
  }

  onRefresh = async () => {
    if (this.state.loadingMore) return
    this.setState({ refreshing: true, endReached: false })
    this.page = 0
    const data = await ChatService.getInboxList(this.page)
    this.setState({ data, refreshing: false })
    if (data.length < 10) {
      this.setState({ endReached: true })
    }
  }

  handleOnPressItem = (item) => {
    if (item.message_unread === 'yes') {
      const { data } = this.state
      const index = data.findIndex((row) => row.userid === item.userid)
      const newData = data.slice(0)
      newData[index] = { ...newData[index], message_unread: 'no' }
      this.setState({ data: newData })
    }

    NavigationService.navigate('Message', { id: item.userid, firstName: item.firstname })
  }

  onDelete = async (item) => {
    this.setState({ loading: true })
    if (await ChatService.deleteInboxThread(item.message_id, item.userid)) {
      const { data } = this.state
      this.setState({ data: data.filter((row) => row.message_id !== item.message_id) })
    } else {
      setTimeout(() => Alert.alert('Error', 'Message thread deleting error'), 500)
    }
    this.setState({ loading: false })
  }

  onMore = (item) => {
    const options = ['Archive', `Block ${item.firstname}`, 'Cancel']
    const isMatch = item.match_type !== 'no'

    let destructiveButtonIndex = 1
    let cancelButtonIndex = 2

    if (isMatch) {
      options.splice(0, 0, `Unmatch ${item.firstname}`)
      destructiveButtonIndex++
      cancelButtonIndex++
    }

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      async (buttonIndex) => {
        // Do something here depending on the button index selected
        if (buttonIndex === cancelButtonIndex) {
          return
        }
        this.setState({ loading: true })
        if (buttonIndex === destructiveButtonIndex - 1) {
          // archive

          if (await ChatService.archiveInboxThread(item.userid)) {
            const { data } = this.state
            this.setState({ data: data.filter((row) => row.userid !== item.userid) })
          } else {
            setTimeout(() => Alert.alert('Error', 'Message thread archiving error'), 500)
          }
        } else if (buttonIndex === destructiveButtonIndex) {
          // block
          if (await ChatService.blockUser(item.userid)) {
            const { data } = this.state
            this.setState({ data: data.filter((row) => row.userid !== item.userid) })
          } else {
            setTimeout(() => Alert.alert('Error', 'Block user error'), 500)
          }
        } else {
          // unmatch
          if (await ChatService.unmatchUser(item.userid)) {
            const { data } = this.state
            const index = data.findIndex((row) => row.userid === item.userid)
            const newData = data.slice(0)
            newData[index] = { ...newData[index], match_type: 'new' }
            this.setState({ data: newData })
          } else {
            setTimeout(() => Alert.alert('Error', 'Unmatch user error'), 500)
          }
        }
        this.setState({ loading: false })
      }
    )
  }

  renderItem = ({ item }) => {
    const { editing } = this.state
    return (
      <SelectableItem
        onPressItem={this.handleOnPressItem}
        onDelete={this.onDelete}
        onMore={this.onMore}
        editing={editing}
        item={item}
      />
    )
  }

  renderFooter = () => {
    if (!this.state.loadingMore || this.state.endReached) return null
    return <ActivityIndicator style={{ color: '#000' }} />
  }

  handleLoadMore = async () => {
    if (!this.state.refreshing && !this.state.loadingMore && !this.state.endReached) {
      this.page = this.page + 1 // increase page by 1
      this.setState({ loadingMore: true })
      try {
        const data = await ChatService.getInboxList(this.page)
        this.setState({ data: this.state.data.concat(data), endReached: data.length < 10 })
      } catch {}

      this.setState({ loadingMore: false })
    }
  }

  render() {
    const { data, loading } = this.state
    return (
      <View style={styles.container}>
        <Spinner visible={loading} />
        <FlatList
          data={data}
          keyExtractor={(item) => item.userid}
          renderItem={this.renderItem}
          onRefresh={this.onRefresh}
          refreshing={this.state.refreshing}
          ListFooterComponent={this.renderFooter}
          onEndReached={this.handleLoadMore}
          extraData={this.state}
        />
      </View>
    )
  }
}

Messages.propTypes = {
  user: PropTypes.object,
  showActionSheetWithOptions: PropTypes.func,
  navigation: PropTypes.object,
}

const conn = connectActionSheet(Messages)
conn.navigationOptions = ({ navigation }) => ({
  headerRight: navigation.state.params && (
    <TouchableOpacity onPress={navigation.state.params.onEdit} style={styles.editButton}>
      <Text>{navigation.state.params.editing ? 'Done' : 'Edit'}</Text>
    </TouchableOpacity>
  ),
})
export default conn
