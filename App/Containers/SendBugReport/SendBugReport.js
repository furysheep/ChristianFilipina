import React from 'react'
import { View, Alert, Keyboard } from 'react-native'
import { Input, Text, Button } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import firebase from 'react-native-firebase'

import styles from './SendBugReportStyle'
import { userService } from 'App/Services/UserService'

class SendBugReport extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: '', sendDisabled: false }
  }

  componentDidMount() {
    firebase.analytics().setCurrentScreen('SendReport', 'SendReport')
  }

  onSend = async () => {
    const { text } = this.state
    Keyboard.dismiss()
    const {
      user: { id },
    } = this.props
    try {
      this.setState({ sendDisabled: true })
      const response = await userService.sendBugReport(id, text)
      console.log(response)
      Alert.alert('Contact Us', 'We received your request. Will review it as soon as possible!')
    } catch (e) {
      console.log(e)
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
      <View style={styles.container}>
        <Text>
          Please enter your description of the problem here, to be sent directly to the development
          team
        </Text>
        <Input
          placeholder=""
          multiline={true}
          inputContainerStyle={styles.problem}
          inputStyle={styles.multilineStyle}
          value={text}
          onChangeText={(text) => this.setState({ text })}
        />
        <Button
          title="Send report to support team"
          disabled={sendDisabled || text.trim().length === 0}
          onPress={this.onSend}
        />
      </View>
    )
  }
}

SendBugReport.propTypes = {
  user: PropTypes.object,
}

const mapStateToProps = (state) => ({ user: state.user.user })

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendBugReport)
