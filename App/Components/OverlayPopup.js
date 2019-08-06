import React from 'react'
import { View } from 'react-native'
import { Overlay, Text, Icon } from 'react-native-elements'
import { Colors } from 'App/Theme'

export default class OverlayPopup extends React.Component {
  render() {
    const { children, title, isVisible, onClose } = this.props
    return (
      <Overlay
        isVisible={isVisible}
        width="90%"
        height="auto"
        overlayStyle={{ padding: 0, overflow: 'hidden' }}
      >
        <View>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary }}
          >
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 18,
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              {title}
            </Text>
            <Icon raised size={15} name="close" type="EvilIcons" color="#333" onPress={onClose} />
          </View>
          <View style={{ padding: 20 }}>{children}</View>
        </View>
      </Overlay>
    )
  }
}
