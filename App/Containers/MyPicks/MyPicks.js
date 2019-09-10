import React from 'react'
import { View, TouchableOpacity, Alert } from 'react-native'
import { Image, Text } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import Grid from 'react-native-infinite-scroll-grid'
import styles from './MyPicksStyle'
import { Images, Helpers } from 'App/Theme'
import { userService } from 'App/Services/UserService'
import NavigationService from 'App/Services/NavigationService'
import { ChatService } from 'App/Services/ChatService'

class MyPicks extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      profiles: [],
      refreshing: false,
    }
  }

  componentDidMount() {
    this.loadData()
  }

  onRefresh() {
    this.setState({ profiles: [] }, () => this.loadData())
  }

  async loadData() {
    if (this.isLoading) return

    this.setState({ refreshing: true })

    try {
      this.isLoading = true
      const profiles = await userService.getMyPicks()
      this.setState({ profiles })
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
      this.setState({ refreshing: false })
    }
  }

  navigateProfile = (info) => {
    NavigationService.navigate('Profile', { id: info.item.id })
  }

  onMessage = (id, firstName) => {
    NavigationService.navigate('Message', { id, firstName })
  }

  startVideoChat = async (id, firstName) => {
    if (this.props.user.canUserStartChat()) {
      const result = await ChatService.sendVideoChatRequest(id)

      if (result === 'success') {
        NavigationService.navigate('VideoChat', { id, firstName })
      } else {
      }
    } else {
      // Go to subscription
      NavigationService.navigate('Subscription')
    }
  }

  renderItem(info) {
    const {
      item: { id, imageUrl, firstName, age, city, countryCode },
    } = info
    return (
      <TouchableOpacity
        style={styles.profileContainer}
        activeOpacity={0.9}
        onPress={this.navigateProfile.bind(this, info)}
      >
        <View style={Helpers.row}>
          <Image source={{ uri: imageUrl }} style={styles.profileSmallImage} />
          <View style={styles.infoContainer}>
            <Text style={styles.nameText}>{`${firstName}, ${age}`}</Text>
            <Text>{`${city ? `${city}, ` : ''}${countryCode}`}</Text>
          </View>
        </View>
        <Image source={{ uri: `${imageUrl}&width=300&height=300` }} style={styles.profileImage} />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={this.onMessage.bind(this, id, firstName)}
            style={styles.marginRight}
          >
            <Image
              source={Images.messageIcon}
              style={styles.buttonImage}
              placeholderStyle={styles.transparent}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.startVideoChat.bind(this, id, firstName)}>
            <Image
              source={Images.videoCallIcon}
              style={styles.buttonImage}
              placeholderStyle={styles.transparent}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Grid
        style={styles.container}
        numColumns={2}
        data={this.state.profiles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={(info) => this.renderItem(info)}
        onRefresh={() => this.onRefresh()}
        refreshing={this.state.refreshing}
        marginExternal={4}
        marginInternal={4}
      />
    )
  }
}

MyPicks.propTypes = {
  user: PropTypes.object,
  userIsLoading: PropTypes.bool,
  userErrorMessage: PropTypes.string,
  fetchUser: PropTypes.func,
  liveInEurope: PropTypes.bool,
}

const mapStateToProps = (state) => ({ user: state.user.user })

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyPicks)
