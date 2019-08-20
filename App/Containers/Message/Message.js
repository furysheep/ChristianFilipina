import React from 'react'
import { View } from 'react-native'
import { Input } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { GiftedChat, Bubble, Time } from 'react-native-gifted-chat'
import styles from './MessageStyle'
import { ChatService } from 'App/Services/ChatService'
import { Config } from 'App/Config'

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
    const { remoteUserId } = this.state
    const { locked, messages } = await ChatService.getInboxMessages(remoteUserId)

    this.setState({
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

  render() {
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
)(Message)
