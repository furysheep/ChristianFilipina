import React from 'react'
import { View } from 'react-native'
import { Input, Text, Button, Divider } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import styles from './ContactUsStyle'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

class ContactUs extends React.Component {
  render() {
    return (
      <KeyboardAwareScrollView style={styles.container}>
        <Input
          placeholder={`Please write your message here.${'\n'}Our support team will try to reply as soon as possible.`}
          multiline={true}
          inputStyle={styles.multilineStyle}
        />
        <Button title="Send Message" buttonStyle={styles.sendButton} />
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
)(ContactUs)
