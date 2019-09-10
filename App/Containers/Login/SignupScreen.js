import React from 'react'
import {
  Platform,
  View,
  ActivityIndicator,
  Image,
  ImageBackground,
  Linking,
  TouchableOpacity,
} from 'react-native'
import { Input, CheckBox, Button, Overlay, Text, Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import analytics from '@react-native-firebase/analytics'

import UserActions from 'App/Stores/User/Actions'
import { liveInEurope } from 'App/Stores/User/Selectors'
import Style from './SignupScreenStyle'
import OverlayPopup from 'App/Components/OverlayPopup'
import { Images, Colors } from 'App/Theme'

class SignupScreen extends React.Component {
  state = { checked: false, isForgotVisible: false }

  static navigationOptions = {
    title: 'Sign Up',
  }

  componentDidMount() {
    analytics().setCurrentScreen('Signup', 'Signup')
  }

  render() {
    const { checked } = this.state
    return (
      <View style={Style.container}>
        <OverlayPopup
          isVisible={this.state.isForgotVisible}
          title={'END USERS LICENSE AGREEMENT'}
          onClose={() => this.setState({ isForgotVisible: false })}
        >
          <View />
        </OverlayPopup>
        <View style={{ padding: 30 }}>
          <Input
            placeholder="Email"
            leftIcon={<Image source={Images.emailIcon} />}
            autoCompleteType="email"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <Input
            placeholder="Password"
            leftIcon={<Image source={Images.passwordIcon} />}
            secureTextEntry
            autoCompleteType="password"
            textContentType="password"
          />
          <Input
            placeholder="Repeat password"
            leftIcon={<Image source={Images.passwordIcon} />}
            secureTextEntry
            autoCompleteType="password"
            textContentType="password"
          />
          <Input
            placeholder="First Name"
            leftIcon={<Image source={Images.firstNameIcon} />}
            autoCompleteType="name"
            textContentType="givenName"
          />
          <View style={{ flexDirection: 'row' }}>
            <CheckBox
              title="I agree with EULA"
              checked={checked}
              onPress={() => this.setState({ checked: !checked })}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>I'm a</Text>
            <TouchableOpacity
              style={{
                borderWidth: 5,
                marginLeft: 30,
                borderRadius: 5,
                borderColor: Colors.primary,
              }}
            >
              <Image source={Images.maleSexIcon} style={{ width: 60, height: 60 }} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderWidth: 5,
                marginLeft: 30,
                borderRadius: 5,
                borderColor: Colors.primary,
              }}
            >
              <Image source={Images.femaleSexIcon} style={{ width: 60, height: 60 }} />
            </TouchableOpacity>
          </View>
          <Button title="JOIN CHRISTIAN FILIPINA" disabled={!checked} style={{ marginTop: 20 }} />
        </View>
      </View>
    )
  }
}

SignupScreen.propTypes = {}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignupScreen)
