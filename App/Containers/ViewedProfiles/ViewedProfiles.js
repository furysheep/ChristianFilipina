import React from 'react'
import { FlatList, TouchableOpacity, View, Image } from 'react-native'
import { Avatar, Text } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import styles from './ViewedProfilesStyle'
import { Images } from 'App/Theme'

class SelectableItem extends React.Component {
  handleOnPress = () => {
    const { onPressItem, item } = this.props
    onPressItem(item)
  }

  handleOnLike = () => {
    const { onLikeItem, item } = this.props
    onLikeItem(item)
  }

  render() {
    const {
      item: { id, name },
    } = this.props

    return (
      <TouchableOpacity key={id} onPress={this.handleOnPress} style={styles.itemContainer}>
        <Avatar
          rounded
          source={{ uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg' }}
          size="large"
        />
        <View style={styles.textSection}>
          <View style={styles.column}>
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.viewText}>Click to view Profile</Text>
          </View>
          <TouchableOpacity onPress={this.handleOnLike}>
            <Image source={Images.gameHeart} style={styles.like} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }
}

SelectableItem.propTypes = {
  onPressItem: PropTypes.func,
  onLikeItem: PropTypes.func,
  item: PropTypes.object,
}

class MeetPeople extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [{ name: 'Jen, 34', id: '1' }],
    }
  }

  handleOnPressItem = (item) => {
    alert(item.id)
  }

  handleOnLikeItem = (item) => {
    alert(item.name)
  }

  renderItem = ({ item }) => {
    return (
      <SelectableItem
        onPressItem={this.handleOnPressItem}
        onLikeItem={this.handleOnLikeItem}
        item={item}
      />
    )
  }

  render() {
    const { data } = this.state
    return <FlatList data={data} keyExtractor={(item) => item.id} renderItem={this.renderItem} />
  }
}

MeetPeople.propTypes = {
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
)(MeetPeople)
