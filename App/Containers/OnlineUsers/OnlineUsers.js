import React from 'react'
import { View, TouchableOpacity, Alert } from 'react-native'
import { Image, Text, Icon, Button } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import Grid from 'react-native-infinite-scroll-grid'
import Dialog from 'react-native-dialog'
import styles from './OnlineUsersStyle'
import { Images, Helpers } from 'App/Theme'
import SearchActions from 'App/Stores/Search/Actions'

class OnlineUsers extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    headerRight: (
      <>
        <TouchableOpacity onPress={() => navigation.navigate('SearchFilter')}>
          <Icon name="search" size={35} underlayColor={'#64b5f6'} />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <Icon name="refresh" size={35} underlayColor={'#64b5f6'} />
        </TouchableOpacity> */}
      </>
    ),
  })

  constructor(props) {
    super(props)
    this.state = {
      users: [],
      loadingMore: false,
      refreshing: false,
      totalRecords: null,
      isCustomSearch: props.isCustomSearch,
      dialogCurrentValue: '',
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let update = {}

    if (nextProps.users !== prevState.users) {
      console.log('update users', nextProps.users.length)
      update.users = nextProps.users
    }

    if ((prevState.loadingMore || prevState.refreshing) && !nextProps.loading) {
      update.loadingMore = false
      update.refreshing = false
    }

    if (!prevState.loadingMore && !prevState.refreshing && nextProps.loading) {
      update.refreshing = true
    }

    if (nextProps.totalRecords !== prevState.totalRecords) {
      update.totalRecords = nextProps.totalRecords
    }

    if (nextProps.isCustomSearch !== prevState.isCustomSearch) {
      update.isCustomSearch = nextProps.isCustomSearch
    }

    console.log('-------')
    console.log(prevState.loadingMore, prevState.refreshing, nextProps.loading)
    console.log(update.refreshing)

    return Object.keys(update).length ? update : null
  }

  componentDidMount() {
    this.loadData(true)
  }

  onRefresh() {
    this.setState({ users: [] }, () => this.loadData(true))
  }

  async loadData(refresh) {
    const { refreshing, loadingMore } = this.state
    if (refreshing || loadingMore) return
    console.log('loadData ' + refresh)
    if (refresh) {
      this.setState({ refreshing: true })
    } else {
      this.setState({ loadingMore: true })
    }

    this.props.searchUser(refresh)
  }

  renderItem(info) {
    const {
      item: { imageUrl, firstName, age, city, countryCode },
    } = info
    return (
      <TouchableOpacity
        style={styles.profileContainer}
        activeOpacity={0.9}
        onPress={() => Alert.alert('Go to profile')}
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
          <TouchableOpacity style={styles.marginRight}>
            <Image
              source={Images.messageIcon}
              style={styles.buttonImage}
              placeholderStyle={styles.transparent}
            />
          </TouchableOpacity>
          <TouchableOpacity>
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

  async fetchProfiles(page, perPage = 20) {
    const posts = await fetch(
      `http://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=${perPage}`
    ).then((response) => response.json())
    return posts
  }

  onEndReached = (info) => {
    if (info.distanceFromEnd >= 0) {
      const { users, totalRecords } = this.state
      if (totalRecords && users.length >= parseInt(totalRecords, 10)) return
      console.log('reach end', info)
      this.loadData(false)
    }
  }

  showDialog = () => {
    this.setState({ dialogVisible: true, dialogCurrentValue: '' })
  }

  confirmDialog = () => {
    const { dialogCurrentValue } = this.state
    if (dialogCurrentValue.trim().length === 0) {
      Alert.alert('Input valid name')
      return
    }
    this.props.saveSearch(dialogCurrentValue)
    this.setState({ dialogVisible: false })
  }

  hideDialog = () => {
    this.setState({ dialogVisible: false })
  }

  render() {
    const { users, isCustomSearch, dialogCurrentValue, dialogVisible } = this.state
    return (
      <View style={styles.container}>
        <Dialog.Container visible={dialogVisible}>
          <Dialog.Title>{`Please enter a name for your saved search to view it later`}</Dialog.Title>
          <Dialog.Input
            placeholder="e.g. Girls to meet in Philippines"
            value={dialogCurrentValue}
            onChangeText={(dialogCurrentValue) => this.setState({ dialogCurrentValue })}
          />
          <Dialog.Button label="Save" onPress={this.confirmDialog} />
          <Dialog.Button label="Cancel" onPress={this.hideDialog} />
        </Dialog.Container>
        {isCustomSearch && (
          <Button
            title="Save Named Search"
            buttonStyle={styles.saveSearch}
            onPress={this.showDialog}
          />
        )}
        <Grid
          style={styles.grid}
          numColumns={2}
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={(info) => this.renderItem(info)}
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.refreshing}
          onEndReached={this.onEndReached}
          loadingMore={this.state.loadingMore}
          marginExternal={4}
          marginInternal={4}
        />
      </View>
    )
  }
}

OnlineUsers.propTypes = {
  users: PropTypes.array,
  loading: PropTypes.bool,
  userErrorMessage: PropTypes.string,
  loadMoreUrl: PropTypes.string,
  searchUser: PropTypes.func,
  totalRecords: PropTypes.string,
  isCustomSearch: PropTypes.bool,
  saveSearch: PropTypes.func,
}

const mapStateToProps = (state) => ({
  users: state.search.users,
  loading: state.search.loading,
  searchErrorMessage: state.search.searchErrorMessage,
  loadMoreUrl: state.search.loadMoreUrl,
  totalRecords: state.search.totalRecords,
  isCustomSearch: state.search.isCustomSearch,
})

const mapDispatchToProps = (dispatch) => ({
  searchUser: (firstLoad) => dispatch(SearchActions.searchUser(firstLoad)),
  saveSearch: (name) => dispatch(SearchActions.saveSearch(name)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnlineUsers)
