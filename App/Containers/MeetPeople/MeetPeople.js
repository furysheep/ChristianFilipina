import React, { Fragment } from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { Input, Card, Text, Button, Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import firebase from 'react-native-firebase'

import UserActions from 'App/Stores/User/Actions'
import styles from './MeetPeopleStyle'
import { Images, Helpers } from 'App/Theme'
import { ScrollView } from 'react-native-gesture-handler'
import Spinner from 'react-native-loading-spinner-overlay'
import { userService } from 'App/Services/UserService'
import { Config } from 'App/Config'

class MeetPeople extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      users: [],
      index: 0,
    }
  }

  async componentDidMount() {
    firebase.analytics().setCurrentScreen('SpeedDating', 'SpeedDating')
    this.setState({ loading: true })
    const users = await userService.loadUsers()
    if (users.length > 0) {
      users.splice(0, 1, await userService.getUserData(users[0].id))
    }
    this.setState({ users, loading: false })
    this.props.getUnreadNotifications()
    this.props.getIncomingChat()
  }

  onNoAnswer = async () => {
    this.setState({ loading: true })
    const { index, users } = this.state
    const user = users[index]
    await userService.setSpeedDatingAnswer(user.id, false)
    await this.switchToNextGameUserOrExit()
    this.setState({ loading: false })
  }

  onYesAnswer = async () => {
    this.setState({ loading: true })
    const { index, users } = this.state
    const user = users[index]
    await userService.setSpeedDatingAnswer(user.id, true)
    await this.switchToNextGameUserOrExit()
    this.setState({ loading: false })
  }

  switchToNextGameUserOrExit = async () => {
    const { users, index } = this.state
    if (index + 1 < users.length) {
      users.splice(index + 1, 1, await userService.getUserData(users[index + 1].id))
    }
    this.setState({ index: index + 1 })
  }

  getIcon = (type) => {
    switch (type) {
      case 'body_type':
        return Images.profileBodyTypeIcon
      case 'education':
        return Images.profileEducationIcon
      case 'ethnicity':
        return Images.profileEthnicityIcon
      case 'have_children':
        return Images.profileHaveChildrenIcon
      case 'marital_status':
        return Images.profileMartialStatusIcon
      case 'posts_in_forum':
        return Images.profilePostsInForumIcon
      case 'preferred_bible_version':
        return Images.profilePreferredBibleVersionIcon
      case 'prefers_to_meet':
        return Images.profilePreferToMeetIcon
      case 'religion':
        return Images.profileReligionIcon
      case 'want_children':
        return Images.profileWantChildrenIcon
      case 'weight':
      case 'height':
      case 'weight_height':
        return Images.profileWightHeightIcon
      case 'willing_to_relocate':
        return Images.profileWillingToRelocateIcon
    }
    return null
  }

  render() {
    const { loading, index, users } = this.state

    const user = users.length === 0 || index < users.length ? users[index] : null

    if (!loading && (users.length === 0 || index >= users.length)) {
      return (
        <View style={[styles.container, styles.center]}>
          <Text style={styles.noUsers}>
            There are no more users to select from today. Please return again tomorrow
          </Text>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <Spinner visible={loading} />
        {user && (
          <Fragment>
            <Card
              image={{
                uri: `${Config.BASE_URL}${Config.USER_PICTURE_BASE_URL}?id=${
                  user.id
                }&width=300&height=300`,
              }}
              imageStyle={styles.profileImage}
              containerStyle={styles.profileImageCard}
            >
              <Text style={styles.topText}>{`${user.firstName}, ${user.age}`}</Text>
              <Text style={styles.topText}>{`${user.city ? `${user.city}, ` : ''}${
                user.countryCode
              }`}</Text>
              <TouchableOpacity style={styles.gameX} onPress={this.onNoAnswer}>
                <Image source={Images.gameX} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.gameHeart} onPress={this.onNoAnswer}>
                <Image source={Images.gameHeart} />
              </TouchableOpacity>
            </Card>
            <ScrollView>
              <View>
                <Card containerStyle={Helpers.noPadding}>
                  <View style={styles.header}>
                    <Image source={Images.profileAboutIcon} />
                    <Text style={styles.headerTextStyle}>ABOUT {user.firstName.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.description}>{user.about}</Text>
                </Card>
                <Card containerStyle={Helpers.noPadding}>
                  <View style={styles.header}>
                    <Image source={Images.profileRecentActivityIcon} />
                    <Text style={styles.headerTextStyle}>RECENT ACTIVITY</Text>
                  </View>
                  <View>
                    {user.recentActivityArray.map((activity, index) => (
                      <View key={index} style={styles.description}>
                        <Text style={styles.activityText}>{activity.description}</Text>
                        <Text style={styles.activityTime}>{activity.time}</Text>
                      </View>
                    ))}
                  </View>
                </Card>
                <Card containerStyle={Helpers.noPadding}>
                  <View style={styles.header}>
                    <Image source={Images.profileProfileIcon} />
                    <Text style={styles.headerTextStyle}>
                      {user.firstName.toUpperCase()}
                      {"'"}S PROFILE
                    </Text>
                  </View>
                  {user.profileDataArray.map((profileData, index) =>
                    profileData.value ? (
                      <View key={index} style={styles.specifiedSection}>
                        <View style={Helpers.rowCross}>
                          <Image
                            style={styles.specifiedIcon}
                            source={this.getIcon(profileData.type)}
                          />
                          <Text>{profileData.name}</Text>
                        </View>
                        <Text style={styles.specifiedText}>{profileData.value}</Text>
                      </View>
                    ) : (
                      <View key={index} />
                    )
                  )}
                </Card>
                <View style={styles.footer}>
                  <Text>Member Since: {user.membersince}</Text>
                  <Text>Last Logged In: {user.lastLoggedIn}</Text>
                </View>
              </View>
            </ScrollView>
          </Fragment>
        )}
      </View>
    )
  }
}

MeetPeople.propTypes = {
  user: PropTypes.object,
}

const mapStateToProps = (state) => ({ user: state.user.user })

const mapDispatchToProps = (dispatch) => ({
  getUnreadNotifications: () => dispatch(UserActions.getUnreadNotifications()),
  getIncomingChat: () => dispatch(UserActions.getIncomingChat()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MeetPeople)
