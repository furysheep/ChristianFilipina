import React from 'react'
import { View } from 'react-native'
import { Input } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { WebView as RNWebView } from 'react-native-webview'

class WebView extends React.Component {
  render() {
    return <RNWebView source={{ uri: 'https://infinite.red' }} />
  }
}

WebView.propTypes = {
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
)(WebView)
