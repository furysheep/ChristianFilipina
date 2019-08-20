import React from 'react'
import { View } from 'react-native'
import { Input } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { WebView as RNWebView } from 'react-native-webview'

class WebView extends React.Component {
  constructor(props) {
    super(props)
    this.state = { url: '' }
  }
  componentDidMount() {
    const { routeName } = this.props.navigation.state
    const { user } = this.props
    console.log(this.props.user)
    let url = ''
    switch (routeName) {
      case 'Testimonials':
        url = user.testimonialsUrl
        break
      case 'AdviceArticles':
        url = user.researchUrl
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
