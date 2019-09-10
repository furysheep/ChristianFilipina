import React from 'react'
import { View } from 'react-native'
import { Input } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { WebView as RNWebView } from 'react-native-webview'
import analytics from '@react-native-firebase/analytics'
import { Config } from 'App/Config'

class WebView extends React.Component {
  constructor(props) {
    super(props)
    this.state = { url: '' }
  }
  componentDidMount() {
    const { routeName } = this.props.navigation.state
    const { user } = this.props
    let url = ''
    switch (routeName) {
      case 'Testimonials':
        analytics().setCurrentScreen('Testimonials', 'Testimonials')
        url = user.testimonialsUrl
        break
      case 'AdviceArticles':
        analytics().setCurrentScreen('AdviceArticles', 'AdviceArticles')
        url = user.researchUrl
        break
      case 'PrivacyPolicy':
        analytics().setCurrentScreen('PrivacyPolicy', 'PrivacyPolicy')
        url = Config.PRIVACY_POLICY_URL
        break
      case 'TermsOfService':
        analytics().setCurrentScreen('TermsOfService', 'TermsOfService')
        url = Config.TERMS_OF_SERVICE_URL
        break
    }
    this.setState({ url })
  }

  render() {
    const { url } = this.state
    console.log(url)
    return <RNWebView source={{ uri: url }} />
  }
}

WebView.propTypes = {
  user: PropTypes.object,
  navigation: PropTypes.object,
}

const mapStateToProps = (state) => ({ user: state.user.user })

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WebView)
