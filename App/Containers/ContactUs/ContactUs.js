import React from 'react'
import { Alert } from 'react-native'
import { Input, Text, Button, Divider } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import firebase from 'react-native-firebase'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import styles from './ContactUsStyle'
import { userService } from 'App/Services/UserService'

class ContactUs extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: '', sendDisabled: false }
  }

  componentDidMount() {
    firebase.analytics().setCurrentScreen('ContactUsView', 'ContactUsView')
  }

  onSend = async () => {
    const { text } = this.state
    try {
      this.setState({ sendDisabled: true })
      await userService.sendContactUsMessage(text)
      Alert.alert('Contact Us', 'We received your request. Will review it as soon as possible!')
    } catch {
      Alert.alert(
        'Contact Us',
        "Your request wasn't sent. Please check your internet connection or try later."
      )
    } finally {
      this.setState({ sendDisabled: false })
    }
  }

  render() {
    const { text, sendDisabled } = this.state
    return (
      <KeyboardAwareScrollView style={styles.container}>
        <Input
          placeholder={`Please write your message here.${'\n'}Our support team will try to reply as soon as possible.`}
          multiline={true}
          inputStyle={styles.multilineStyle}
          value={text}
          onChangeText={(text) => this.setState({ text })}
        />
        <Button
          title="Send Message"
          buttonStyle={styles.sendButton}
          onPress={this.onSend}
          disabled={sendDisabled || text.trim().length === 0}
        />
        <Text style={styles.header}>CALL US</Text>
        <Text>(We are available 24 hours a day)</Text>
        <Divider style={styles.divider} />
        <Text>1-800-578-1469 (toll-free from USA - and usually Canada)</Text>
        <Text>415-991-6998 from inside or outside USA/Canada</Text>
        <Text>604-670-5477 in Canada</Text>
        <Text>2-8011-4102 or 2-8880-5162 in Australia</Text>
        <Text>9-887-5076 in New Zealand</Text>
        <Text>1344-231492 in United Kingdom</Text>
        <Text style={styles.header}>MAILING ADDRESS</Text>
        <Divider style={styles.divider} />
        <Text>Christian Filipina</Text>
        <Text>Box 455</Text>
        <Text>Honomu, HI 96728</Text>
        <Text>USA</Text>
      </KeyboardAwareScrollView>
    )
  }
}

ContactUs.propTypes = {
  user: PropTypes.object,
  userErrorMessage: PropTypes.string,
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactUs)
