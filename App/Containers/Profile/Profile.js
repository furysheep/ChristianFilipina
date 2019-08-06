import React from 'react'
import { View, TouchableOpacity, ScrollView } from 'react-native'
import { Card, Text, Image } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import styles from './ProfileStyle'
import { Images, Helpers } from 'App/Theme'

class Profile extends React.Component {
  static navigationOptions = {
    headerTitle: (
      <View style={styles.titleContainer}>
        <Text style={styles.profileName}>Newton, 36</Text>
        <Text>Denver, US</Text>
      </View>
    ),
  }
  render() {
    return (
      <View style={styles.container}>
        <Card
          image={{ uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg' }}
          imageStyle={styles.profileImage}
          containerStyle={styles.profileImageCard}
          wrapperStyle={styles.profileImageCardInner}
        >
          <View style={styles.buttons}>
            <TouchableOpacity>
              <Image source={Images.messageIcon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={Images.winkIcon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={Images.videoCallIcon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={Images.blockIcon} />
            </TouchableOpacity>
          </View>
        </Card>
        <ScrollView>
          <View>
            <Card containerStyle={Helpers.noPadding}>
              <View style={styles.header}>
                <Image source={Images.profileAboutIcon} />
                <Text style={styles.headerTextStyle}>ABOUT {'REGINA'}</Text>
              </View>
              <Text style={styles.description}>
                My name is Regina and my friends call me rheggie and i'm a filipina. I have just
                retired this april and now i'm looking for good and serious relationship.
              </Text>
            </Card>
            <Card containerStyle={Helpers.noPadding}>
              <View style={styles.header}>
                <Image source={Images.profileRecentActivityIcon} />
                <Text style={styles.headerTextStyle}>RECENT ACTIVITY</Text>
              </View>
              <Text style={styles.description}>
                My name is Regina and my friends call me rheggie and i'm a filipina. I have just
                retired this april and now i'm looking for good and serious relationship.
              </Text>
            </Card>
            <Card containerStyle={Helpers.noPadding}>
              <View style={styles.header}>
                <Image source={Images.profileProfileIcon} />
                <Text style={styles.headerTextStyle}>
                  {'REGINA'}
                  {"'"}S PROFILE
                </Text>
              </View>
              <View style={styles.specifiedSection}>
                <View style={Helpers.rowCross}>
                  <Image style={styles.specifiedIcon} source={Images.profilePreferToMeetIcon} />
                  <Text>Prefers to Meet Age</Text>
                </View>
                <Text style={styles.specifiedText}>40 to 80 (Strict age limits: no)</Text>
              </View>
              <View style={styles.specifiedSection}>
                <View style={Helpers.rowCross}>
                  <Image style={styles.specifiedIcon} source={Images.profileMartialStatusIcon} />
                  <Text>Martial Status</Text>
                </View>
                <Text style={styles.specifiedText}>Widowed</Text>
              </View>
              <View style={styles.specifiedSection}>
                <View style={Helpers.rowCross}>
                  <Image style={styles.specifiedIcon} source={Images.profileHaveChildrenIcon} />
                  <Text>Have Children</Text>
                </View>
                <Text style={styles.specifiedText}>No</Text>
              </View>
              <View style={styles.specifiedSection}>
                <View style={Helpers.rowCross}>
                  <Image style={styles.specifiedIcon} source={Images.profileWantChildrenIcon} />
                  <Text>Want Children</Text>
                </View>
                <Text style={styles.specifiedText}>Yes</Text>
              </View>
              <View style={styles.specifiedSection}>
                <View style={Helpers.rowCross}>
                  <Image style={styles.specifiedIcon} source={Images.profileEducationIcon} />
                  <Text>Education</Text>
                </View>
                <Text style={styles.specifiedText}>Some College</Text>
              </View>
              <View style={styles.specifiedSection}>
                <View style={Helpers.rowCross}>
                  <Image style={styles.specifiedIcon} source={Images.profileEthnicityIcon} />
                  <Text>Ethnicity</Text>
                </View>
                <Text style={styles.specifiedText}>Filipina / Filipino</Text>
              </View>
              <View style={styles.specifiedSection}>
                <View style={Helpers.rowCross}>
                  <Image style={styles.specifiedIcon} source={Images.profileBodyTypeIcon} />
                  <Text>Body Type</Text>
                </View>
                <Text style={styles.specifiedText}>Average</Text>
              </View>
              <View style={styles.specifiedSection}>
                <View style={Helpers.rowCross}>
                  <Image style={styles.specifiedIcon} source={Images.profileBodyTypeIcon} />
                  <Text>Weight/Height</Text>
                </View>
                <Text style={styles.specifiedText}>113 lbs (51.3 kg) / 5' 2" (157cm)</Text>
              </View>
              <View style={styles.specifiedSection}>
                <View style={Helpers.rowCross}>
                  <Image style={styles.specifiedIcon} source={Images.profileWightHeightIcon} />
                  <Text>Weight</Text>
                </View>
                <Text style={styles.specifiedText}>113 lbs (51.3kg)</Text>
              </View>
              <View style={styles.specifiedSection}>
                <View style={Helpers.rowCross}>
                  <Image style={styles.specifiedIcon} source={Images.profileWightHeightIcon} />
                  <Text>Height</Text>
                </View>
                <Text style={styles.specifiedText}>5' 2" (157 cm)</Text>
              </View>
              <View style={styles.specifiedSection}>
                <View style={Helpers.rowCross}>
                  <Image style={styles.specifiedIcon} source={Images.profileReligionIcon} />
                  <Text>Religion</Text>
                </View>
                <Text style={styles.specifiedText}>Christian / Baptist</Text>
              </View>
              <View style={styles.specifiedSection}>
                <View style={Helpers.rowCross}>
                  <Image
                    style={styles.specifiedIcon}
                    source={Images.profilePreferredBibleVersionIcon}
                  />
                  <Text>Preferred Bible Version</Text>
                </View>
                <Text style={styles.specifiedText}>King James</Text>
              </View>
              <View style={styles.specifiedSection}>
                <View style={Helpers.rowCross}>
                  <Image
                    style={styles.specifiedIcon}
                    source={Images.profileWillingToRelocateIcon}
                  />
                  <Text>Willing to Relocate</Text>
                </View>
                <Text style={styles.specifiedText}>Yes</Text>
              </View>
              <View style={styles.specifiedSection}>
                <View style={Helpers.rowCross}>
                  <Image style={styles.specifiedIcon} source={Images.profilePostsInForumIcon} />
                  <Text>Posts In Forum</Text>
                </View>
                <Text style={styles.specifiedText}>0</Text>
              </View>
            </Card>
            <View style={styles.footer}>
              <Text>Member Since: MM dd, yyyy</Text>
              <Text>Last Logged In: MM dd, yyyy</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

Profile.propTypes = {
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
)(Profile)
