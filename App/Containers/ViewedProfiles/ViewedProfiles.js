import React from 'react'
import { FlatList, TouchableOpacity, View, Image } from 'react-native'
import { Avatar, Text } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import styles from './ViewedProfilesStyle'
import { Images } from 'App/Theme'
import { userService } from 'App/Services/UserService'
import NavigationService from 'App/Services/NavigationService'

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
      item: {
        id: [id],
        profile_picture: [profile_picture],
        firstname: [name],
        act_time: [act_time],
        liked,
      },
    } = this.props

    return (
      <TouchableOpacity onPress={this.handleOnPress} style={styles.itemContainer}>
        <Avatar rounded source={{ uri: `${profile_picture}${id}` }} size="large" />
        <View style={styles.textSection}>
          <View style={styles.column}>
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.viewText}>Click to view Profile</Text>
          </View>
          {!liked && (
            <TouchableOpacity onPress={this.handleOnLike}>
              <Image source={Images.gameHeart} style={styles.like} />
            </TouchableOpacity>
          )}
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

class ViewedProfiles extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      profiles: [],
      refreshing: false,
    }
  }

  componentDidMount() {
    this.onRefresh()
  }

  onRefresh = async () => {
    this.setState({ refreshing: true })
    try {
      const profiles = await userService.getViewedProfiles()
      this.setState({ profiles: profiles.map((profile) => ({ ...profile, liked: false })) })
    } catch {}
    this.setState({ refreshing: false })
  }

  handleOnPressItem = (item) => {
    NavigationService.navigate('Profile', { id: item.id[0] })
  }

  handleOnLikeItem = async (item) => {
    try {
      await userService.setSpeedDatingAnswer(item.id[0], true)
      let { profiles } = this.state
      profiles = profiles.slice(0)
      profiles.splice(profiles.indexOf(item), 1, { ...item, liked: true })
      this.setState({
        profiles,
      })
    } catch (e) {
      console.log(e)
    }
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
    const { profiles, refreshing } = this.state
    return profiles.length === 0 ? (
      <View style={styles.container}>
        <Text>No viewed Profiles</Text>
      </View>
    ) : (
      <FlatList
        data={profiles}
        keyExtractor={(item) => `${item.id[0]}${item.act_time[0]}`}
        renderItem={this.renderItem}
        onRefresh={this.onRefresh}
        refreshing={refreshing}
      />
    )
  }
}

ViewedProfiles.propTypes = {
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
)(ViewedProfiles)
