import React from 'react'
import { View, TouchableOpacity, Alert } from 'react-native'
import { Image, Text } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import Grid from 'react-native-infinite-scroll-grid'
import styles from './PickedMeStyle'
import { Images, Helpers } from 'App/Theme'
import { NavigationActions } from 'react-navigation'

class PickedMe extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      profiles: [],
      loadingMore: false,
      refreshing: false,
      nextPage: 1,
    }
  }

  componentDidMount() {
    this.loadData(true)
  }

  onRefresh() {
    this.setState({ nextPage: 1, profiles: [] }, () => this.loadData(true))
  }

  async loadData(refresh) {
    if (this.isLoading) return
    console.log('loadData ' + this.isLoading + ',' + this.state.nextPage)
    if (refresh) {
      this.setState({ refreshing: true })
    } else {
      this.setState({ loadingMore: true })
    }

    try {
      this.isLoading = true
      const profiles = await this.fetchProfiles(this.state.nextPage)
      this.setState((previousState) => {
        return {
          loadingMore: false,
          profiles: refresh ? profiles : previousState.profiles.concat(profiles),
          nextPage: previousState.nextPage + 1,
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
      this.setState({ loadingMore: false, refreshing: false })
    }
  }

  navigateProfile = (info) => {
    console.log(info)
    this.props.navigation.navigate('Profile')
  }

  renderItem = (info) => {
    return (
      <TouchableOpacity
        style={styles.profileContainer}
        activeOpacity={0.9}
        onPress={this.navigateProfile.bind(this, info)}
      >
        <View style={Helpers.row}>
          <Image source={{ uri: info.item.thumbnailUrl }} style={styles.profileSmallImage} />
          <View style={styles.infoContainer}>
            <Text>{'Michelle, 33'}</Text>
            <Text>{'HK'}</Text>
          </View>
        </View>
        <Image source={{ uri: info.item.thumbnailUrl }} style={styles.profileImage} />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.marginRight}>
            <Image
              source={Images.xDislikeSmallButton}
              style={styles.buttonImage}
              placeholderStyle={styles.transparent}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={Images.heartLikeSmallButton}
              style={styles.buttonImage}
              placeholderStyle={styles.transparent}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

  async fetchProfiles(page, perPage = 20) {
    const posts = await fetch(
      `http://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=${perPage}`
    ).then((response) => response.json())
    return posts
  }

  onEndReached() {
    this.loadData(false)
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
        onEndReached={() => this.onEndReached()}
        loadingMore={this.state.loadingMore}
        marginExternal={4}
        marginInternal={4}
      />
    )
  }
}

PickedMe.propTypes = {
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
)(PickedMe)
