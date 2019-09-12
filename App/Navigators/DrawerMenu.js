import React from 'react'
import { ScrollView, StyleSheet, Text, View, ImageBackground } from 'react-native'
import { DrawerItems, SafeAreaView, NavigationActions, StackActions } from 'react-navigation'
import { Button, Avatar } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import UserActions from 'App/Stores/User/Actions'
import { Images, Colors, Fonts, Helpers } from 'App/Theme'
import { Config } from 'App/Config'
import NavigationService from 'App/Services/NavigationService'

const CustomDrawerContentComponent = (props) => {
  const { user, logout } = props

  return (
    <ImageBackground source={Images.background} style={{ flex: 1 }}>
      <ScrollView style={styles.scrollView}>
        <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
          {user && (
            <View style={styles.profile}>
              <Avatar
                rounded
                source={{
                  uri: `${Config.BASE_URL}${Config.USER_PICTURE_BASE_URL}?id=${user.id}`,
                }}
                size="large"
              />
              <Text style={styles.profileName}>{user.firstName}</Text>
            </View>
          )}
          <DrawerItems {...props} />
          <Button
            title="Log out"
            buttonStyle={styles.logout}
            onPress={() => {
              logout()
              const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'LoginScreen' })],
              })
              props.navigation.dispatch(resetAction)
            }}
          />
        </SafeAreaView>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    ...Helpers.fill,
  },
  logout: {
    alignSelf: 'center',
    backgroundColor: Colors.destructive,
    marginTop: 20,
    marginBottom: 20,
    width: '50%',
  },
  profile: {
    ...Helpers.rowCross,
    padding: 20,
  },
  profileName: { ...Helpers.fill, marginLeft: 20, fontWeight: 'bold', ...Fonts.style.large },
  scrollView: {
    backgroundColor: Colors.drawerOverlay,
  },
})

CustomDrawerContentComponent.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func,
}

const mapStateToProps = (state) => ({
  user: state.user.user,
})

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(UserActions.logout()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomDrawerContentComponent)
