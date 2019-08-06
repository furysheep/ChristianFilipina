import React from 'react'
import { ScrollView, StyleSheet, Text, View, ImageBackground } from 'react-native'
import { DrawerItems, SafeAreaView } from 'react-navigation'
import { Button, Avatar } from 'react-native-elements'
import { Images, Colors, Fonts, Helpers } from 'App/Theme'

const CustomDrawerContentComponent = (props) => (
  <ImageBackground source={Images.background} style={{ flex: 1 }}>
    <ScrollView style={styles.scrollView}>
      <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
        <View style={styles.profile}>
          <Avatar
            rounded
            source={{ uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg' }}
            size="large"
          />
          <Text style={styles.profileName}>Andrew Kazancev</Text>
        </View>
        <DrawerItems {...props} />
        <Button title="Log out" buttonStyle={styles.logout} onPress={() => {}} />
      </SafeAreaView>
    </ScrollView>
  </ImageBackground>
)

const styles = StyleSheet.create({
  container: {
    ...Helpers.fill,
  },
  logout: { alignSelf: 'center', backgroundColor: Colors.destructive, marginTop: 20, width: '50%' },
  profile: {
    ...Helpers.rowCross,
    padding: 20,
  },
  profileName: { ...Helpers.fill, marginLeft: 20, fontWeight: 'bold', ...Fonts.style.large },
  scrollView: {
    backgroundColor: Colors.drawerOverlay,
  },
})

export default CustomDrawerContentComponent
