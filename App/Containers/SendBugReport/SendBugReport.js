import React from 'react'
import { View, Alert } from 'react-native'
import { Input, Text, Button } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import analytics from '@react-native-firebase/analytics'

import styles from './SendBugReportStyle'
import { userService } from 'App/Services/UserService'

class SendBugReport extends React.Component {
  constructor(props) {
    super(props)
    this.state = { text: '', sendDisabled: false }
  }

  componentDidMount() {
    analytics().setCurrentScreen('SendReport', 'SendReport')
  }

  onSend = async () => {
    const { text } = this.state
    try {
      this.setState({ sendDisabled: true })
      await userService.sendBugReport(text)
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
        />
      </View>
    )
  }
}

SendBugReport.propTypes = {
  user: PropTypes.object,
  userIsLoading: PropTypes.bool,
  userErrorMessage: PropTypes.string,
  fetchUser: PropTypes.func,
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SendBugReport)
