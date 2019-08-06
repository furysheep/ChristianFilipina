import React from 'react'
import { ScrollView, View, Alert, Image } from 'react-native'
import { Input, CheckBox, Button, Text, Avatar } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from './MyProfileStyle'
import { Images, Colors } from 'App/Theme'

class MyProfile extends React.Component {
  constructor() {
    super()
    this.state = {
      strictAge: false,
    }
  }

  saveProfile = () => {}

  render() {
    const { strictAge } = this.state
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.profileImageContainer}>
            <Avatar
              rounded
              source={{
                uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
              }}
              size="large"
              onPress={() => Alert.alert('profile image')}
            />
            <Text style={styles.profileImageDesc}>Add/Change a profile picture</Text>
          </View>
          <Text>Full Name</Text>
          <View style={styles.rowCross}>
            <Input
              leftIcon={<Image source={Images.firstNameIcon} />}
              autoCompleteType="name"
              textContentType="givenName"
              containerStyle={styles.fill}
            />
            <Input
              leftIcon={<Image source={Images.firstNameIcon} />}
              autoCompleteType="name"
              textContentType="familyName"
              containerStyle={styles.fill}
            />
          </View>
          <Text>Preferred Age Range</Text>
          <View style={styles.rowCross}>
            <Input
              leftIcon={<Image source={Images.preferredAgeIcon} />}
              keyboardType="number-pad"
              containerStyle={styles.fill}
            />
            <Text>to</Text>
            <Input
              leftIcon={<Image source={Images.preferredAgeIcon} />}
              keyboardType="number-pad"
              containerStyle={styles.fill}
            />
          </View>
          <CheckBox
            title="Strict age preference"
            checked={strictAge}
            checkedColor={Colors.text}
            onPress={() => this.setState({ strictAge: !strictAge })}
          />
          <Text>Birthday</Text>
          <Input leftIcon={<Image source={Images.birthdayIcon} />} />
          <Text>Timezone</Text>
          <Input leftIcon={<Image source={Images.timezoneIcon} />} />
          <Text>Mailing Address Line 1</Text>
          <Input
            leftIcon={<Image source={Images.locationIcon} />}
            textContentType="streetAddressLine1"
          />
          <Text>Mailing Address Line 2</Text>
          <Input
            leftIcon={<Image source={Images.locationIcon} />}
            textContentType="streetAddressLine2"
          />
          <Text>City</Text>
          <Input
            placeholder="e.g. Manila City"
            leftIcon={<Image source={Images.cityIcon} />}
            textContentType="addressCity"
          />
          <Text>State/Province</Text>
          <Input placeholder="e.g. Laguna" textContentType="addressState" />
          <Text>Zip/Postal Code</Text>
          <Input textContentType="postalCode" />
          <Text>Country</Text>
          <Input leftIcon={<Image source={Images.countryIcon} />} textContentType="countryName" />
          <Text>About Me</Text>
          <Input
            placeholder="Write something about yourself"
            multiline={true}
            inputStyle={styles.multilineStyle}
          />
          <Text>What is your relationship status?</Text>
          <Input placeholder="I'll tell you later" />
          <Text>Which ethnicity ddescribes you best?</Text>
          <Input placeholder="I'll tell you later" />
          <Text>How would you describe your education?</Text>
          <Input placeholder="I'll tell you later" />
          <Text>What is your Church?</Text>
          <Input placeholder="I'll tell you later" />
          <Text>Which best describes your body type?</Text>
          <Input placeholder="I'll tell you later" />
          <Text>Do you have any children?</Text>
          <Input placeholder="I'll tell you later" />
          <Text>Do you want children?</Text>
          <Input placeholder="I'll tell you later" />
          <Text>Your weight?</Text>
          <Input placeholder="I'll tell you later" />
          <Text>How tall are you?</Text>
          <Input placeholder="I'll tell you later" />
          <Text>Are you willing to relocate?</Text>
          <Input placeholder="I'll tell you later" />
          <Text>Preferred Bible Version</Text>
          <Input placeholder="I'll tell you later" />
          <Button title="SAVE CHANGES" onPress={this.saveProfile} style={styles.saveButton} />
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

MyProfile.propTypes = {
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
)(MyProfile)
