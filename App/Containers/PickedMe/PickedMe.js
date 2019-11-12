import React from 'react'
import { View, TouchableOpacity, Alert } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import { Image, Text } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import Grid from 'react-native-infinite-scroll-grid'
import styles from './PickedMeStyle'
import { Images, Helpers } from 'App/Theme'
import { userService } from 'App/Services/UserService'
import NavigationService from 'App/Services/NavigationService'

class PickedMe extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      profiles: [],
      refreshing: false,
      loading: false,
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
      const profiles = await userService.getPickedMe()
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

  handleOnLikeItem = async ({ item }) => {
    try {
      this.setState({ loading: true })
      await userService.setSpeedDatingAnswer(item.id, true)
      let { profiles } = this.state
      profiles = profiles.slice(0)
      profiles.splice(profiles.indexOf(item), 1)
      this.setState({
        profiles,
      })
    } catch (e) {
      console.log(e)
    } finally {
      this.setState({ loading: false })
    }
  }

  handleOnDislikeItem = async ({ item }) => {
    try {
      this.setState({ loading: true })
      await userService.setSpeedDatingAnswer(item.id, false)
      let { profiles } = this.state
      profiles = profiles.slice(0)
      profiles.splice(profiles.indexOf(item), 1)
      this.setState({
        profiles,
      })
    } catch (e) {
      console.log(e)
    } finally {
      this.setState({ loading: false })
    }
  }

  renderItem = (info) => {
    const {
      item: { imageUrl, firstName, age, city, countryCode },
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
            style={styles.marginRight}
            onPress={this.handleOnDislikeItem.bind(this, info)}
          >
            <Image
              source={Images.xDislikeSmallButton}
              style={styles.buttonImage}
              placeholderStyle={styles.transparent}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleOnLikeItem.bind(this, info)}>
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

  render() {
    const { loading } = this.state
    return (
      <View style={styles.container}>
        <Spinner visible={loading} />
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
      </View>
    )
  }
}

PickedMe.propTypes = {
  user: PropTypes.object,
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PickedMe)
