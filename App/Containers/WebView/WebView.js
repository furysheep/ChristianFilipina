import React from 'react'
import { TouchableOpacity, Platform, ActivityIndicator, SafeAreaView } from 'react-native'
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { WebView as RNWebView } from 'react-native-webview'
import firebase from 'react-native-firebase'
import { Config } from 'App/Config'

const ActivityIndicatorElement = () => {
  return (
    <ActivityIndicator
      color="#009688"
      size="large"
      style={{
        flex: 1,
        position: 'absolute',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
      }}
    />
  )
}

class WebView extends React.Component {
  static navigationOptions = ({ navigation, screenProps }) => ({
    headerRight: (
      <>
        <TouchableOpacity onPress={() => navigation.state.params.goBack()}>
          <Icon name="navigate-before" size={35} underlayColor={'#64b5f6'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.state.params.goForth()}>
          <Icon name="navigate-next" size={35} underlayColor={'#64b5f6'} />
        </TouchableOpacity>
      </>
    ),
  })

  constructor(props) {
    super(props)
    const { routeName } = props.navigation.state
    const { user } = props
    let url = ''
    switch (routeName) {
      case 'Testimonials':
        firebase.analytics().setCurrentScreen('Testimonials', 'Testimonials')
        url = user.testimonialsUrl
        break
      case 'AdviceArticles':
        firebase.analytics().setCurrentScreen('AdviceArticles', 'AdviceArticles')
        url = user.researchUrl
        break
      case 'PrivacyPolicy':
        firebase.analytics().setCurrentScreen('PrivacyPolicy', 'PrivacyPolicy')
        url = 'privacy'
        break
      case 'TermsOfService':
        firebase.analytics().setCurrentScreen('TermsOfService', 'TermsOfService')
        url = 'terms'
        break
    }
    this.state = { url, visible: false }
    props.navigation.setParams({
      goBack: this.goBack,
      goForth: this.goForth,
    })
  }

  goBack = () => {
    this.webView.goBack()
  }

  goForth = () => {
    this.webView.goForward()
  }

  render() {
    const { url, visible } = this.state
    console.log(visible)
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <RNWebView
          originWhitelist={['*']}
          ref={(ref) => (this.webView = ref)}
          source={
            url === 'terms' || url === 'privacy'
              ? Platform.OS === 'ios'
                ? url === 'terms'
                  ? require('../../Assets/terms.html')
                  : require('../../Assets/privacy.html')
                : { uri: `file:///android_asset/${url}.html` }
              : { uri: url }
          }
          onLoadStart={() => this.setState({ visible: true })}
          onLoad={() => this.setState({ visible: false })}
        />
        {visible ? <ActivityIndicatorElement /> : null}
      </SafeAreaView>
    )
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
