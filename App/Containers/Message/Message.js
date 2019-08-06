import React from 'react'
import { View } from 'react-native'
import { Input } from 'react-native-elements'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { GiftedChat, Bubble, Time } from 'react-native-gifted-chat'
import styles from './MessageStyle'

class Message extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
  })

  constructor() {
    super()
    this.state = { messages: [] }
  }
  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text:
            'How are you? My name is Alvie, I noticed you joined us a few minutes ago... so I just wanted to say hello',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })
  }

  onSend(messages = []) {
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
          _id: 1,
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
