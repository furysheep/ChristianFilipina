import React from 'react'
import { View } from 'react-native'
import { Button, Avatar, Image, Text } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { GiftedChat, Bubble, Time } from 'react-native-gifted-chat'
import analytics from '@react-native-firebase/analytics'

import styles from './MessageStyle'
import { ChatService } from 'App/Services/ChatService'
import { Config } from 'App/Config'
import { Images, Colors } from 'App/Theme'
import NavigationService from 'App/Services/NavigationService'

class Message extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.firstName}`,
  })

  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      remoteUsername: props.navigation.state.params.firstName,
      remoteUserId: props.navigation.state.params.id,
    }
  }

  componentWillMount() {
    this.setState({
      messages: [],
    })
  }

  async componentDidMount() {
    analytics().setCurrentScreen('Messaging', 'Messaging')
    const { remoteUserId } = this.state
    const { locked, messages } = await ChatService.getInboxMessages(remoteUserId)

    this.setState({
      locked,
      messages: messages.map((msg) => ({
        _id: msg.message_id[0],
        text: msg.message[0],
        createdAt: new Date(parseInt(msg.sendtime[0], 10) * 1000),
        user: {
          _id: msg.folder[0],
          avatar:
            msg.folder[0] === 'inbox'
              ? `${Config.BASE_URL}${Config.USER_PICTURE_BASE_URL}?id=${remoteUserId}`
              : null, //
        },
      })),
    })
  }

  onSend(messages = []) {
    const { remoteUserId } = this.state
    messages.forEach((msg) => {
      ChatService.sendInboxMessage(remoteUserId, msg.text, msg._id)
        .then((msgId) => {
          this.setState((prevState) => {
            const findIndex = prevState.messages.findIndex((oldMsg) => oldMsg._id === msg._id)
            prevState.messages[findIndex] = { ...prevState.messages[findIndex], _id: msgId }
            console.log(this.state.messages)
          })
        })
        .catch((e) => {
          console.log(e)
        })
    })

    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  upgrade = () => {
    NavigationService.navigate('Subscription')
  }

  render() {
    const { locked, remoteUserId, remoteUsername } = this.state
    if (locked) {
      return (
        <View style={styles.lockedContainer}>
          <View style={styles.avatarContainer}>
            <Avatar
              rounded
              source={{
                uri: `${Config.BASE_URL}${Config.USER_PICTURE_BASE_URL}?id=${remoteUserId}`,
              }}
              size="medium"
            />
            <Image source={Images.lockIcon} style={styles.lockIcon} />
            <Text style={styles.lockMessage}>
              {remoteUsername} has sent you a message but it{"'"}s locked. You will have to upgrade
              to view his/her messages
            </Text>
          </View>
          <View style={styles.upgradeContainer}>
            <View style={styles.row}>
              <View style={styles.benefitItem}>
                <View style={styles.iconContainer}>
                  <Image source={Images.benefCommunIcon} />
                </View>
                <View style={styles.fill}>
                  <Text style={styles.benefitTitle}>Communicate</Text>
                  <Text style={styles.benefitDesc}>
                    with any free or paid level members. Send 50 custom private messages per day
                  </Text>
                </View>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.iconContainer}>
                  <Image source={Images.benefVideoIcon} />
                </View>
                <View style={styles.fill}>
                  <Text style={styles.benefitTitle}>Unlimited Live Video</Text>
                  <Text style={styles.benefitDesc}>Unlimited live video chat with our members</Text>
                </View>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.benefitItem}>
                <View style={styles.iconContainer}>
                  <Image source={Images.benefDiscountIcon} />
                </View>

                <View style={styles.fill}>
                  <Text style={styles.benefitTitle}>Travel Discounts</Text>
                  <Text style={styles.benefitDesc}>
                    Get travel discounts in the Philippines through our partners
                  </Text>
                </View>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.iconContainer}>
                  <Image source={Images.benefContactIcon} />
                </View>
                <View style={styles.fill}>
                  <Text style={styles.benefitTitle}>Contact Details</Text>
                  <Text style={styles.benefitDesc}>
                    Safely exchange contact details with women on our site
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.benefitItem}>
                <View style={styles.iconContainer}>
                  <Image source={Images.benefConsultIcon} />
                </View>
                <View style={styles.fill}>
                  <Text style={styles.benefitTitle}>Private Consultation</Text>
                  <Text style={styles.benefitDesc}>
                    Get Private Consultation to tune-up your profile and improve your matches
                  </Text>
                </View>
              </View>
              <View style={styles.benefitItem}>
                <View style={styles.iconContainer}>
                  <Image source={Images.benefWinksIcon} />
                </View>
                <View style={styles.fill}>
                  <Text style={styles.benefitTitle}>Unlimited Winks</Text>
                  <Text style={styles.benefitDesc}>
                    Safely exchange contact details with women on our site
                  </Text>
                </View>
              </View>
            </View>
            <Button
              buttonStyle={{ backgroundColor: Colors.destructive }}
              title="UPGRADE NOW"
              onPress={this.upgrade}
            />
          </View>
        </View>
      )
    }
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={(messages) => this.onSend(messages)}
        user={{
          _id: 'sent',
        }}
        alwaysShowSend={true}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              textStyle={{
                right: {
                  color: 'white',
                },
              }}
              wrapperStyle={{
                left: {
                  backgroundColor: '#fa5891', // #ff78d7 // #f4b2b6
                },
              }}
            />
          )
        }}
        renderTime={(props) => (
          <Time
            {...props}
            textStyle={{
              left: {
                color: 'black',
              },
            }}
          />
        )}
      />
    )
  }
}

Message.propTypes = {
  navigation: PropTypes.object,
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Message)
