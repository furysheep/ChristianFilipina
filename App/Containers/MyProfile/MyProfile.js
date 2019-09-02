import React from 'react'
import { View, Alert, Image } from 'react-native'
import { Input, CheckBox, Button, Text, Avatar } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker from 'react-native-image-picker'
import Spinner from 'react-native-loading-spinner-overlay'
import DatePicker from 'react-native-datepicker'
import RNPickerSelect from 'react-native-picker-select'
import moment from 'moment'
import styles from './MyProfileStyle'
import { Images, Colors, Fonts } from 'App/Theme'
import { Config } from 'App/Config'
import { userService } from 'App/Services/UserService'
import Timezones from 'App/Config/Timezones'
import Countries from 'App/Config/Countries'

class MyProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      data: null,
      firstName: '',
      lastName: '',
      strictAge: false,
      lookagestart: '',
      lookageend: '',
      birthDate: '',
      timezone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      stateProvince: '',
      zip: '',
      country: '',
      about: '',
    }
    this.timezones = Timezones.map((t) => ({ label: t, value: t }))
    this.countries = Countries.map((c) => ({ label: c[0], value: c[1] }))
    this.ageRanges = [...Array(81).keys()].map((i) => ({ label: `${i + 18}`, value: `${i + 18}` }))
  }

  async componentDidMount() {
    const { user } = this.props
    this.setState({ loading: true })
    const data = await userService.getUserData(user.id)
    const questions = await userService.getProfileQuestionsAndAnswers()
    this.setState({
      loading: false,
      data,
      firstName: data.firstName,
      lastName: data.lastName,
      strictAge: data.agePrefStrict === 'yes',
      lookagestart: data.lookagestart,
      lookageend: data.lookageend,
      birthDate: data.birthDate,
      timezone: data.timezone,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      stateProvince: data.stateProvince,
      zip: data.zip,
      country: data.countryCode,
      about: data.about,
      questions,
      profileData: data.profileDataArray
        .filter((profileData) => Object.keys(questions).includes(profileData.type))
        .reduce(
          (acc, data) =>
            data.value
              ? {
                  ...acc,
                  [data.type]: questions[data.type].options.filter(
                    (option) => option.label === data.value
                  )[0].value,
                }
              : acc,
          {}
        ),
    })
  }

  selectPhoto = () => {
    const options = {
      quality: 1.0,
      maxWidth: 768,
      maxHeight: 1024,
      storageOptions: {
        skipBackup: true,
      },
    }

    ImagePicker.showImagePicker(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled photo picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton)
      } else {
        this.setState({ loading: true })
        try {
          await userService.uploadPhoto(response.uri)
          Alert.alert(
            'Your photo has been uploaded successfully. It will be reviewed by our staff and if approved will be live on your profile within 6 hours.'
          )
        } catch {
          Alert.alert('Sorry, some error occured during uploading. Please contact support team.')
        } finally {
          this.setState({ loading: false })
        }
      }
    })
  }

  saveProfile = async () => {
    this.setState({ loading: true })
    const {
      firstName,
      lastName,
      lookagestart,
      lookageend,
      strictAge,
      birthDate,
      timezone,
      addressLine1,
      addressLine2,
      city,
      stateProvince,
      zip,
      country,
      about,
      profileData,
    } = this.state
    if (firstName.trim().length === 0) {
      Alert.alert('First name is required')
      return
    }

    if (addressLine1.trim().length === 0) {
      Alert.alert('Address Line 1 is required')
      return
    }

    try {
      if (
        !(await userService.updateUserProfileData(
          firstName,
          lastName,
          lookagestart,
          lookageend,
          strictAge,
          birthDate,
          timezone,
          addressLine1,
          addressLine2,
          city,
          stateProvince,
          zip,
          country,
          about
        ))
      ) {
        throw new Error()
      }
      if (!(await userService.doQuestionsSave(profileData))) {
        throw new Error()
      }
    } catch {
      Alert.alert('Error updating user data')
    } finally {
      this.setState({ loading: false })
    }
  }

  render() {
    const {
      strictAge,
      loading,
      data,
      firstName,
      lastName,
      lookagestart,
      lookageend,
      birthDate,
      timezone,
      addressLine1,
      addressLine2,
      city,
      stateProvince,
      zip,
      country,
      about,
      questions,
      profileData,
    } = this.state
    const { user } = this.props
    return (
      <View style={styles.container}>
        <Spinner visible={loading} />
        {data && (
          <KeyboardAwareScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.profileImageContainer}>
              <Avatar
                rounded
                source={{
                  uri: `${Config.BASE_URL}${Config.USER_PICTURE_BASE_URL}?id=${user.id}`,
                }}
                size="large"
                onPress={this.selectPhoto}
              />
              <Text style={styles.profileImageDesc}>Add/Change a profile picture</Text>
            </View>
            <Text>
              Full Name<Text style={styles.requiredField}>*</Text>
            </Text>
            <View style={styles.rowCross}>
              <Input
                leftIcon={<Image source={Images.firstNameIcon} />}
                autoCompleteType="name"
                textContentType="givenName"
                containerStyle={styles.fill}
                value={firstName}
                onChangeText={(firstName) => this.setState({ firstName })}
              />
              <Input
                leftIcon={<Image source={Images.firstNameIcon} />}
                autoCompleteType="name"
                textContentType="familyName"
                containerStyle={styles.fill}
                value={lastName}
                onChangeText={(lastName) => this.setState({ lastName })}
              />
            </View>
            <Text>Preferred Age Range</Text>
            <View style={styles.rowCross}>
              <View style={[styles.inputContainer, styles.fill]}>
                <RNPickerSelect
                  onValueChange={(lookagestart) => {
                    this.setState({
                      lookagestart,
                      lookageend: `${Math.max(lookagestart, lookageend)}`,
                    })
                  }}
                  value={lookagestart}
                  items={this.ageRanges}
                  placeholder={{}}
                  style={{
                    viewContainer: { backgroundColor: 'white', padding: 10 },
                    iconContainer: {
                      left: 0,
                    },
                    inputIOS: {
                      paddingLeft: 27,
                      color: 'black',
                      fontSize: Fonts.size.regular,
                    },
                    inputAndroid: {
                      paddingLeft: 27,
                      color: 'black',
                      fontSize: Fonts.size.regular,
                    },
                  }}
                  Icon={() => <Image source={Images.preferredAgeIcon} />}
                />
              </View>
              <Text>to</Text>
              <View style={[styles.inputContainer, styles.fill]}>
                <RNPickerSelect
                  onValueChange={(lookageend) => {
                    this.setState({
                      lookageend,
                      lookagestart: `${Math.min(lookagestart, lookageend)}`,
                    })
                  }}
                  value={lookageend}
                  items={this.ageRanges}
                  placeholder={{}}
                  style={{
                    viewContainer: { backgroundColor: 'white', padding: 10 },
                    iconContainer: {
                      left: 0,
                    },
                    inputIOS: {
                      paddingLeft: 27,
                      color: 'black',
                      fontSize: Fonts.size.regular,
                    },
                    inputAndroid: {
                      paddingLeft: 27,
                      color: 'black',
                      fontSize: Fonts.size.regular,
                    },
                  }}
                  Icon={() => <Image source={Images.preferredAgeIcon} />}
                />
              </View>
            </View>
            <CheckBox
              title="Strict age preference"
              checked={strictAge}
              checkedColor={Colors.text}
              onPress={() => this.setState({ strictAge: !strictAge })}
            />
            <Text>
              Birthday<Text style={styles.requiredField}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <DatePicker
                style={styles.datePicker}
                date={birthDate}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                minDate={moment()
                  .subtract(99, 'years')
                  .format('YYYY-MM-DD')}
                maxDate={moment()
                  .subtract(18, 'years')
                  .format('YYYY-MM-DD')}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                iconComponent={<Image style={styles.dateIcon} source={Images.birthdayIcon} />}
                customStyles={{
                  dateInput: {
                    marginLeft: 36,
                    borderWidth: 0,
                  },
                  dateText: {
                    fontSize: Fonts.size.regular,
                    color: 'black',
                  },
                  btnTextConfirm: {
                    color: Colors.primary,
                  },
                }}
                onDateChange={(birthDate) => {
                  this.setState({ birthDate })
                }}
              />
            </View>
            {/* <Input leftIcon={<Image source={Images.birthdayIcon} />} /> */}
            <Text>Timezone</Text>
            <View style={styles.inputContainer}>
              <RNPickerSelect
                onValueChange={(timezone) => {
                  this.setState({ timezone })
                }}
                value={timezone}
                items={this.timezones}
                style={{
                  viewContainer: { backgroundColor: 'white', padding: 10 },
                  iconContainer: {
                    left: 0,
                  },
                  inputIOS: {
                    paddingLeft: 27,
                    color: 'black',
                    fontSize: Fonts.size.regular,
                  },
                  inputAndroid: {
                    paddingLeft: 27,
                    color: 'black',
                    fontSize: Fonts.size.regular,
                  },
                }}
                Icon={() => <Image source={Images.timezoneIcon} />}
              />
            </View>
            <Text>
              Mailing Address Line 1<Text style={styles.requiredField}>*</Text>
            </Text>
            <Input
              leftIcon={<Image source={Images.locationIcon} />}
              textContentType="streetAddressLine1"
              value={addressLine1}
              onChangeText={(addressLine1) => this.setState({ addressLine1 })}
            />
            <Text>Mailing Address Line 2</Text>
            <Input
              leftIcon={<Image source={Images.locationIcon} />}
              textContentType="streetAddressLine2"
              value={addressLine2}
              onChangeText={(addressLine2) => this.setState({ addressLine2 })}
            />
            <Text>City</Text>
            <Input
              placeholder="e.g. Manila City"
              leftIcon={<Image source={Images.cityIcon} />}
              textContentType="addressCity"
              value={city}
              onChangeText={(city) => this.setState({ city })}
            />
            <Text>State/Province</Text>
            <Input
              placeholder="e.g. Laguna"
              textContentType="addressState"
              inputStyle={styles.input}
              value={stateProvince}
              onChangeText={(stateProvince) => this.setState({ stateProvince })}
            />
            <Text>Zip/Postal Code</Text>
            <Input
              textContentType="postalCode"
              inputStyle={styles.input}
              value={zip}
              onChangeText={(zip) => this.setState({ zip })}
            />
            <Text>Country</Text>
            <View style={styles.inputContainer}>
              <RNPickerSelect
                onValueChange={(country) => {
                  this.setState({ country })
                }}
                value={country}
                items={this.countries}
                style={{
                  viewContainer: { backgroundColor: 'white', padding: 10 },
                  iconContainer: {
                    left: 0,
                  },
                  inputIOS: {
                    paddingLeft: 27,
                    color: 'black',
                    fontSize: Fonts.size.regular,
                  },
                  inputAndroid: {
                    paddingLeft: 27,
                    color: 'black',
                    fontSize: Fonts.size.regular,
                  },
                }}
                Icon={() => <Image source={Images.countryIcon} />}
              />
            </View>
            <Text>About Me</Text>
            <Input
              placeholder="Write something about yourself"
              multiline={true}
              inputStyle={styles.multilineStyle}
              value={about}
              onChangeText={(about) => this.setState({ about })}
            />
            {Object.keys(questions).map((type) => (
              <View key={type} style={styles.inputContainer}>
                <Text>{questions[type].label}</Text>
                <RNPickerSelect
                  onValueChange={(value) => {
                    this.setState({
                      profileData: Object.assign({}, profileData, { [type]: value }),
                    })
                  }}
                  placeholder={questions[type].options[0]}
                  value={profileData[type]}
                  items={questions[type].options.filter((value, index) => index > 0)}
                  style={{
                    viewContainer: { backgroundColor: 'white', padding: 10 },
                    inputIOS: {
                      color: 'black',
                      fontSize: Fonts.size.regular,
                    },
                    inputAndroid: {
                      color: 'black',
                      fontSize: Fonts.size.regular,
                    },
                  }}
                />
              </View>
            ))}
            <Button title="SAVE CHANGES" onPress={this.saveProfile} style={styles.saveButton} />
          </KeyboardAwareScrollView>
        )}
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

const mapStateToProps = (state) => ({ user: state.user.user })

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyProfile)
