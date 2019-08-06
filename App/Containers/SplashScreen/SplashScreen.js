import React from 'react'
import { Image, View } from 'react-native'
import styles from './SplashScreenStyle'
import { Images } from 'App/Theme'

export default class SplashScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={Images.background} style={styles.splash} />
        <View style={styles.bgTopContainer}>
          <Image source={Images.bgTop} style={styles.bgTop} />
        </View>
      </View>
    )
  }
}
