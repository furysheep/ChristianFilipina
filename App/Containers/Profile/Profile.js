import React from 'react'
import { View, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native'
import { Card, Text, Image } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import Spinner from 'react-native-loading-spinner-overlay'
import { SafeAreaView } from 'react-navigation'
import ImageViewer from 'react-native-image-zoom-viewer'
import firebase from 'react-native-firebase'

import styles from './ProfileStyle'
import { userService } from 'App/Services/UserService'
import { Images, Helpers } from 'App/Theme'
import { Config } from 'App/Config'
import { ChatService } from 'App/Services/ChatService'
import NavigationService from 'App/Services/NavigationService'

class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: props.navigation.state.params.id,
      loading: false,
      photos: [],
      largePhotos: [],
      showImageViewer: false,
    }
  }

  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <View style={styles.titleContainer}>
        <Text style={styles.profileName}>
          {navigation.state.params && navigation.state.params.title
            ? navigation.state.params.title
            : ''}
        </Text>
        <Text>
          {navigation.state.params && navigation.state.params.subtitle
            ? navigation.state.params.subtitle
            : ''}
        </Text>
      </View>
    ),
  })

  async componentDidMount() {
    firebase.analytics().setCurrentScreen('Profile', 'Profile')

    const { id } = this.state
    this.setState({ loading: true })
    const data = await userService.getUserData(id)

    this.props.navigation.setParams({
      title: `${data.firstName}, ${data.age}`,
      subtitle: `${data.city ? `${data.city}, ` : ''}${data.countryCode}`,
    })
    this.setState({ loading: false, data })
    const photos = await userService.getUserPhotos(id)
    this.setState({
      photos,
      largePhotos: photos.map((photo) => ({
        url: `${photo}&width=600&height=600`,
      })),
    })

    if (data.isBlocked) {
      Alert.alert(
        'You have blocked this user',
        null,
        [
          { text: 'Unblock', onPress: this.unblockUser },
          {
            text: 'Dismiss',
            onPress: () => {
              this.props.navigation.goBack()
            },
          },
        ],
        { cancellable: false }
      )
    }
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

  showImageViewer = (imageIndex) => {
    firebase.analytics().setCurrentScreen('FullScreenPhotos', 'FullScreenPhotos')
    this.setState({ showImageViewer: true, imageIndex })
  }

  hideImageViewer = () => {
    this.setState({ showImageViewer: false })
  }

  wink = async () => {
    const { id } = this.state
    try {
      const result = await ChatService.sendWink(id)
      Alert.alert(result)
    } catch (e) {
      Alert.alert(e.message)
    }
  }

  onMessage = () => {
    const {
      id,
      data: { firstName },
    } = this.state
    NavigationService.navigate('Message', { id, firstName })
  }

  blockUser = async () => {
    const { id } = this.state
    try {
      const result = await ChatService.blockUser(id)
      Alert.alert(result)
      this.props.navigation.goBack()
    } catch (e) {
      Alert.alert(e.message)
    }
  }

  unblockUser = async () => {
    const { id } = this.state
    try {
      const result = await ChatService.unblockUser(id)
      Alert.alert(result)
    } catch (e) {
      Alert.alert(e.message)
    }
  }

  startVideoChat = async () => {
    if (this.props.user.canUserStartChat()) {
      const {
        id,
        data: { firstName },
      } = this.state
      const result = await ChatService.sendVideoChatRequest(id)

      if (result === 'success') {
        // const creds = await ChatService.getTurnCredentials()
        NavigationService.navigate('VideoChat', { id, firstName, caller: true })
        // console.log(creds)
      }
    } else {
      // Go to subscription
      NavigationService.navigate('Subscription')
    }
  }

  render() {
    const { loading, data, id, photos, largePhotos, showImageViewer, imageIndex } = this.state
    return (
      <View style={styles.container}>
        <Modal visible={showImageViewer} transparent={true}>
          <ImageViewer
            imageUrls={largePhotos}
            onCancel={() => {
              this.hideImageViewer()
            }}
            onClick={() => {
              this.hideImageViewer()
            }}
            enableSwipeDown
            index={imageIndex}
          />
        </Modal>
        <Spinner visible={loading} />
        {data && (
          <>
            <Card
              image={{
                uri: `${Config.BASE_URL}${
                  Config.USER_PICTURE_BASE_URL
                }?id=${id}&width=600&height=600`,
              }}
              imageStyle={styles.profileImage}
              containerStyle={styles.profileImageCard}
              wrapperStyle={styles.profileImageCardInner}
            >
              <View style={styles.buttons}>
                <TouchableOpacity onPress={this.onMessage}>
                  <Image source={Images.messageIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.wink}>
                  <Image source={Images.winkIcon} />
                </TouchableOpacity>
                {data.isOnline && (
                  <TouchableOpacity onPress={this.startVideoChat}>
                    <Image source={Images.videoCallIcon} />
                  </TouchableOpacity>
                )}

                <TouchableOpacity onPress={this.blockUser}>
                  <Image source={Images.blockIcon} />
                </TouchableOpacity>
              </View>
            </Card>
            <View style={styles.photosView}>
              <ScrollView horizontal>
                {photos.map((photo, index) => (
                  <TouchableOpacity
                    key={photo}
                    activeOpacity={0.8}
                    onPress={this.showImageViewer.bind(this, index)}
                  >
                    <Image source={{ uri: photo }} style={styles.photo} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <ScrollView>
              <SafeAreaView>
                <Card containerStyle={Helpers.noPadding}>
                  <View style={styles.header}>
                    <Image source={Images.profileAboutIcon} />
                    <Text style={styles.headerTextStyle}>ABOUT {data.firstName.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.description}>{data.about}</Text>
                </Card>
                <Card containerStyle={Helpers.noPadding}>
                  <View style={styles.header}>
                    <Image source={Images.profileRecentActivityIcon} />
                    <Text style={styles.headerTextStyle}>RECENT ACTIVITY</Text>
                  </View>
                  <View>
                    {data.recentActivityArray.map((activity, index) => (
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
                      {data.firstName.toUpperCase()}
                      {"'"}S PROFILE
                    </Text>
                  </View>
                  {data.profileDataArray.map((profileData, index) =>
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
                  <Text>Member Since: {data.membersince}</Text>
                  <Text>Last Logged In: {data.lastLoggedIn}</Text>
                </View>
              </SafeAreaView>
            </ScrollView>
          </>
        )}
      </View>
    )
  }
}

Profile.propTypes = {
  navigation: PropTypes.object,
  user: PropTypes.object,
}

const mapStateToProps = (state) => ({
  user: state.user.user,
})

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile)
