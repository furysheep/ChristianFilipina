import React from 'react'
import {
  Platform,
  View,
  ActivityIndicator,
  Image,
  ImageBackground,
  Linking,
  Alert,
} from 'react-native'
import { Input, CheckBox, Button, Overlay, Text, Icon } from 'react-native-elements'
import Spinner from 'react-native-loading-spinner-overlay'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import UserActions from 'App/Stores/User/Actions'
import { liveInEurope } from 'App/Stores/User/Selectors'
import Style from './LoginScreenStyle'
import OverlayPopup from 'App/Components/OverlayPopup'
import { Images, Colors } from 'App/Theme'
import NavigationService from 'App/Services/NavigationService'

class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  state = {
    checked: false,
    isForgotVisible: false,
    email: 'cf_fm08090@yahoo.com',
    password: 'Cf12345678',
  }
  componentDidMount() {}

  signUp = () => {
    NavigationService.navigate('SignupScreen')
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.user !== null) {
      NavigationService.navigate('DrawerContainer')
      return null
    }
    return null // Triggers no change in the state
  }

  login = () => {
    let { email } = this.state
    const { password } = this.state
    email = email.trim()
    if (email.length === 0 || password.length === 0) {
      Alert.alert('All fields are required')
      return
    }

    const { loginUser } = this.props
    loginUser(email, password)
  }

  render() {
    const { email, password } = this.state
    const { userIsLoading, userErrorMessage } = this.props

    return (
      <ImageBackground source={Images.background} style={Style.container}>
        <Spinner visible={userIsLoading} />
        <OverlayPopup
          isVisible={this.state.isForgotVisible}
          title={'FORGOT PASSWORD/LOGIN?'}
          onClose={() => this.setState({ isForgotVisible: false })}
        >
          <Text>
            Please provide the e-mail address used with your profile to have your username and
            password sent to you.
          </Text>
          <Input
            placeholder="Your email address"
            leftIcon={<Image source={Images.emailIcon} />}
            containerStyle={{ backgroundColor: 'white', marginVertical: 20 }}
            autoCompleteType="email"
            keyboardType="email-address"
            textContentType="emailAddress"
            shake={true}
            errorStyle={{ color: Colors.error }}
            errorMessage="This field is required."
          />
          <Text>
            After receipt of the new password you should change it immediately after login, for
            security. If you do not receive the email, check your spam/bulk box.If you still do not
            see the email,{' '}
            <Text
              style={{ color: Colors.primary }}
              onPress={() => {
                Linking.openURL('mailto:info@christianfilipina.com')
              }}
            >
              Contact Us
            </Text>
          </Text>
          <Button title="NEXT" containerStyle={{ marginTop: 10 }} />
        </OverlayPopup>
        <Image source={Images.bgTop} style={Style.bgTop} />
        <View style={{ padding: 30 }}>
          <Input
            placeholder="Email"
            leftIcon={<Image source={Images.emailIcon} />}
            inputContainerStyle={{}}
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
            errorStyle={{ color: Colors.error }}
            errorMessage={userErrorMessage}
          />
          <View style={{ flexDirection: 'row' }}>
            <CheckBox
              title="Remember me"
              checked={this.state.checked}
              textStyle={{ color: 'white' }}
              checkedColor="white"
              onPress={() => this.setState({ checked: !this.state.checked })}
            />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Button
              title="Forgot password"
              type="clear"
              titleStyle={{ color: 'white' }}
              onPress={() => this.setState({ isForgotVisible: true })}
            />
          </View>
          <Button title="LOGIN" buttonStyle={{ backgroundColor: '#e60072' }} onPress={this.login} />
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button
              title="Privacy Policy"
              type="clear"
              titleStyle={{ color: 'white' }}
              containerStyle={{ flex: 1 }}
            />
            <View style={{ height: '80%', width: 1, backgroundColor: 'white' }} />
            <Button
              title="Terms of Service"
              type="clear"
              titleStyle={{ color: 'white' }}
              containerStyle={{ flex: 1 }}
            />
          </View>
          <Button title="Contact Us" type="clear" titleStyle={{ color: 'white' }} />
          <Text style={{ alignSelf: 'center', marginTop: 20, marginBottom: 10, color: 'white' }}>
            Don't have an account?
          </Text>
          <Button title="SIGN UP" onPress={this.signUp} />
        </View>
      </ImageBackground>
    )
  }
}

LoginScreen.propTypes = {
  user: PropTypes.object,
  userIsLoading: PropTypes.bool,
  userErrorMessage: PropTypes.string,
  loginUser: PropTypes.func,
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  userIsLoading: state.user.userIsLoading,
  userErrorMessage: state.user.userErrorMessage,
})

const mapDispatchToProps = (dispatch) => ({
  loginUser: (email, password) => dispatch(UserActions.loginUser(email, password)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen)
