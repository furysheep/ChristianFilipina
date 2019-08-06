import React, { Component } from 'react'
import NavigationService from 'App/Services/NavigationService'
import AppNavigator from 'App/Navigators/AppNavigator'
import { View } from 'react-native'
import styles from './RootScreenStyle'
import { connect } from 'react-redux'
import StartupActions from 'App/Stores/Startup/Actions'
import { PropTypes } from 'prop-types'
import { ThemeProvider } from 'react-native-elements'
import { Colors, Metrics, Fonts } from 'App/Theme'

const theme = {
  colors: {
    primary: Colors.primary,
    error: Colors.destructive,
  },
  CheckBox: {
    textStyle: {
      fontSize: Fonts.size.regular,
      fontWeight: 'normal',
      color: Colors.text,
    },
    containerStyle: {
      backgroundColor: 'transparent',
      borderWidth: 0,
    },
  },
  Text: {
    style: {
      color: Colors.text,
      fontSize: Fonts.size.regular,
    },
  },
  Input: {
    inputContainerStyle: {
      borderBottomWidth: 0,
      marginBottom: Metrics.largeMargin,
      backgroundColor: 'white',
    },
    leftIconContainerStyle: {
      paddingRight: Metrics.baseMargin,
    },
  },
}

class RootScreen extends Component {
  componentDidMount() {
    // Run the startup saga when the application is starting
    this.props.startup()
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <View style={styles.container}>
          <AppNavigator
            // Initialize the NavigationService (see https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html)
            ref={(navigatorRef) => {
              NavigationService.setTopLevelNavigator(navigatorRef)
            }}
          />
        </View>
      </ThemeProvider>
    )
  }
}

RootScreen.propTypes = {
  startup: PropTypes.func,
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({
  startup: () => dispatch(StartupActions.startup()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RootScreen)
