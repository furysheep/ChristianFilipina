import React from 'react'
import { View } from 'react-native'
import { Input, Text, Button } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import styles from './SendBugReportStyle'

class SendBugReport extends React.Component {
  render() {
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
        />
        <Button title="Send report to support team" />
      </View>
    )
  }
}

SendBugReport.propTypes = {
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
)(SendBugReport)
