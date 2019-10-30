import React from 'react'
import {
  Platform,
  View,
  ActivityIndicator,
  Image,
  ImageBackground,
  Alert,
  TouchableOpacity,
} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import * as Keychain from 'react-native-keychain'
import { Input, CheckBox, Button, Overlay, Text, Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import firebase from 'react-native-firebase'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import UserActions from 'App/Stores/User/Actions'
import Style from './SignupScreenStyle'
import OverlayPopup from 'App/Components/OverlayPopup'
import { Images, Colors } from 'App/Theme'
import { userService } from 'App/Services/UserService'

class SignupScreen extends React.Component {
  state = {
    checked: false,
    isForgotVisible: false,
    email: '',
    password: '',
    confirm: '',
    firstName: '',
    gender: true,
    loading: false,
  }

  static navigationOptions = {
    title: 'Sign Up',
  }

  componentDidMount() {
    firebase.analytics().setCurrentScreen('Signup', 'Signup')
  }

  signUp = async () => {
    let { email, password, confirm, firstName, gender } = this.state
    email = email.trim()
    firstName = firstName.trim()
    if (
      email.length === 0 ||
      password.length === 0 ||
      confirm.length === 0 ||
      firstName.length === 0
    ) {
      Alert.alert('Please fill all the fields')
      return
    }

    if (password !== confirm) {
      Alert.alert('Passwords do not match')
      return
    }

    try {
      this.setState({ loading: true })
      const result = await userService.signupUser(email, password, firstName, gender)
      this.setState({ loading: false })
      if (result.success[0] === '1') {
        Keychain.setGenericPassword(email, password)
        await this.props.loginUser(email, password)
      } else {
        setTimeout(() => Alert.alert(result.description[0]), 500)
      }
    } catch (e) {
      this.setState({ loading: false })
      setTimeout(() => Alert.alert(e.message), 500)
    }
  }

  render() {
    const { checked, email, password, confirm, firstName, gender, loading } = this.state
    return (
      <View style={Style.container}>
        <Spinner visible={loading} />
        <OverlayPopup
          isVisible={this.state.isForgotVisible}
          title={'END USERS LICENSE AGREEMENT'}
          onClose={() => this.setState({ isForgotVisible: false })}
        >
          <View />
        </OverlayPopup>
        <KeyboardAwareScrollView>
          <View style={{ padding: 30 }}>
            <Input
              placeholder="Email"
              leftIcon={<Image source={Images.emailIcon} />}
              autoCompleteType="email"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCapitalize="none"
              value={email}
              onChangeText={(email) => this.setState({ email })}
            />
            <Input
              placeholder="Password"
              leftIcon={<Image source={Images.passwordIcon} />}
              secureTextEntry
              autoCompleteType="password"
              textContentType="password"
              value={password}
              onChangeText={(password) => this.setState({ password })}
            />
            <Input
              placeholder="Repeat password"
              leftIcon={<Image source={Images.passwordIcon} />}
              secureTextEntry
              autoCompleteType="password"
              textContentType="password"
              value={confirm}
              onChangeText={(confirm) => this.setState({ confirm })}
            />
            <Input
              placeholder="First Name"
              leftIcon={<Image source={Images.firstNameIcon} />}
              autoCompleteType="name"
              textContentType="givenName"
              value={firstName}
              onChangeText={(firstName) => this.setState({ firstName })}
            />
            <View style={{ flexDirection: 'row' }}>
              <CheckBox
                title="I agree with EULA"
                checked={checked}
                onPress={() => this.setState({ checked: !checked })}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <Text>I'm a</Text>
              <TouchableOpacity
                style={{
                  borderWidth: 5,
                  marginLeft: 30,
                  borderRadius: 5,
                  borderColor: gender ? Colors.primary : Colors.separator,
                }}
                onPress={() => this.setState({ gender: true })}
              >
                <Image source={Images.maleSexIcon} style={{ width: 60, height: 60 }} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderWidth: 5,
                  marginLeft: 30,
                  borderRadius: 5,
                  borderColor: !gender ? Colors.primary : Colors.separator,
                }}
                onPress={() => this.setState({ gender: false })}
              >
                <Image source={Images.femaleSexIcon} style={{ width: 60, height: 60 }} />
              </TouchableOpacity>
            </View>
            <Button title="JOIN CHRISTIAN FILIPINA" disabled={!checked} onPress={this.signUp} />
          </View>
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

SignupScreen.propTypes = {
  loginUser: PropTypes.func,
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({
  loginUser: (email, password) => dispatch(UserActions.loginUser(email, password, true)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupScreen)
