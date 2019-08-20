import React from 'react'
import { View, FlatList, TouchableOpacity } from 'react-native'
import { Text, Avatar, Badge, Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import styles from './MessagesStyle'
import NavigationService from 'App/Services/NavigationService'
import { ChatService } from 'App/Services/ChatService'
import { Colors } from 'App/Theme'

class SelectableItem extends React.Component {
  handleOnPress = () => {
    const { onPressItem, item } = this.props
    onPressItem(item)
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
    } = this.props

    return (
      <TouchableOpacity onPress={this.handleOnPress} style={styles.itemContainer}>
        <Avatar rounded source={{ uri: imageUrl }} size="large" />
        <View style={styles.textSection}>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>
              {firstname}, {age}
            </Text>
            {isOnline === 'yes' && <Badge status="primary" />}
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
      </TouchableOpacity>
    )
  }
}

SelectableItem.propTypes = {
  onPressItem: PropTypes.func,
  item: PropTypes.object,
}

class Messages extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      refreshing: false,
    }
  }

  componentDidMount() {
    this.onRefresh()
  }

  onRefresh = async () => {
    this.setState({ refreshing: true })
    const data = await ChatService.getInboxList()
    this.setState({ data, refreshing: false })
  }

  handleOnPressItem = (item) => {
    NavigationService.navigate('Message', { id: item.userid, firstName: item.firstname })
  }

  renderItem = ({ item }) => {
    return <SelectableItem onPressItem={this.handleOnPressItem} item={item} />
  }

  render() {
    const { data } = this.state
    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.userid}
        renderItem={this.renderItem}
        onRefresh={this.onRefresh}
        refreshing={this.state.refreshing}
      />
    )
  }
}

Messages.propTypes = {
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
)(Messages)
