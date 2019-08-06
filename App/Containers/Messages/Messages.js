import React from 'react'
import { View, FlatList, TouchableOpacity } from 'react-native'
import { Text, Avatar } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import styles from './MessagesStyle'
import NavigationService from 'App/Services/NavigationService'

class SelectableItem extends React.Component {
  handleOnPress = () => {
    const { onPressItem, item } = this.props
    onPressItem(item)
  }

  render() {
    const {
      item: { id, name, subject, message },
    } = this.props

    return (
      <TouchableOpacity key={id} onPress={this.handleOnPress} style={styles.itemContainer}>
        <Avatar
          rounded
          source={{ uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg' }}
          size="large"
        />
        <View style={styles.textSection}>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.subjectText}>{subject}</Text>
          <Text style={styles.messageText}>{message}</Text>
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
      data: [{ name: 'Alvie, 34', subject: 'Subject: Welcome', message: 'Hello', id: '1' }],
    }
  }

  handleOnPressItem = (item) => {
    NavigationService.navigate('Message', { title: item.name })
  }

  renderItem = ({ item }) => {
    return <SelectableItem onPressItem={this.handleOnPressItem} item={item} />
  }

  render() {
    const { data } = this.state
    return <FlatList data={data} keyExtractor={(item) => item.id} renderItem={this.renderItem} />
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
