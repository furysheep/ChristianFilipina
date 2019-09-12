import React, { Component } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, TextInput, ListView } from 'react-native'
import { NavigationEvents } from 'react-navigation'
import { Button, Icon } from 'react-native-elements'
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  mediaDevices,
} from 'react-native-webrtc'
import { GiftedChat, Bubble, Time } from 'react-native-gifted-chat'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import Snackbar from 'react-native-snackbar'
import PropTypes from 'prop-types'
import analytics from '@react-native-firebase/analytics'

import { ChatService } from 'App/Services/ChatService'
import styles from './VideoChatStyle'
import { Colors } from 'App/Theme'
import NavigationService from 'App/Services/NavigationService'

let socket = null
const room = 'd0cec4e6392fd9b3a22af2f41be9ec76'

const configuration = {}
// const configuration = {
//   iceServers:
// };

function randomString(length) {
  var rand = Math.random()
    .toString(36)
    .slice(2)
    .substring(0, length)

  return rand
}

class VideoChat extends Component {
  static navigationOptions = ({ navigation }) => {
    const headerRight = (
      <View style={{ flexDirection: 'row', marginRight: 10 }}>
        <TouchableOpacity onPress={navigation.state.params.handleAudio} style={{ marginRight: 20 }}>
          <Icon size={30} type="antdesign" name="phone" color={Colors.defaultBlue} />
        </TouchableOpacity>
        <TouchableOpacity onPress={navigation.state.params.handleVideo}>
          <Icon size={30} type="antdesign" name="videocamera" color={Colors.defaultBlue} />
        </TouchableOpacity>
      </View>
    )

    return {
      gesturesEnabled: !navigation.state.params.terminateEnabled,
      headerRight,
      ...(navigation.state.params.terminateEnabled ? { header: null } : {}),
      headerTitle: (
        <View style={styles.titleContainer}>
          <Text style={styles.profileName}>
            {navigation.state.params && navigation.state.params.title
              ? navigation.state.params.title
              : ''}
          </Text>
          <Text>
            {navigation.state.params.title
              ? navigation.state.params.remoteStatusOnline
                ? 'Online'
                : 'Offline'
              : ''}
          </Text>
        </View>
      ),
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      status: 'init',
      roomID: '',
      isFront: true,
      selfViewSrc: null,
      remoteSrc: null,
      messages: [],
      audioEnabled: true,
      videoEnabled: true,
      terminateEnabled: false,

      callerModal: false,
      endCallEnabled: false,

      calleeModal: false,
      modalRedText: false,
      typingInfo: '',
      remoteStatusOnline: true,
      remoteUsername: props.navigation.state.params.firstName,
      remoteUserId: props.navigation.state.params.id,

      loadingMore: false,
    }
    this.lastMessageId = 0
    // configuration.iceServers = props.navigation.state.params.creds
    socket = new WebSocket('wss://dev.christianfilipina.com/wss2/comm')
    // console.log(configuration)
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data)
      console.log(data)

      if (data.room === room) {
        // above check is not necessary since all messages coming to this user are for the user's current room
        // but just to be on the safe side
        switch (data.action) {
          case 'initCall':
            // launch modal to show that user has a call with options to accept or deny and start ringtone
            // start ringtone here
            // Audio call from xxx, Audio Call, Video Call, Reject Call
            // show popup: data.msg
            this.setState({ modalText: data.msg, modalRedText: false })
            this.toggleCalleeModal()

            // minimise chat pane if it is maximised to prevent it from covering the page on small screens

            if (data.servers !== undefined) {
              this.servers = data.servers
            }

            break

          case 'callRejected':
            // get response to call initiation (if user is the initiator)
            // show received message (i.e. reason for rejection) and end call

            this.setState({ modalText: data.msg, modalRedText: true })
            setTimeout(() => {
              this.setState({ callerModal: false })
            }, 3000)

            // stop tone

            // enable call buttons
            this.enableCallBtns()

            break

          case 'endCall':
            // i.e. when the caller ends the call from his end (after dialing and before recipient respond)
            // End call

            this.setState({ modalText: data.msg, modalRedText: true })

            setTimeout(() => {
              this.setState({ calleeModal: false })
            }, 3000)

            // stop tone

            break

          case 'startCall':
            this.disableCallBtns() // this is moved from
            this.startCall(false) // to start call when callee gives the go ahead (i.e. answers call)

            clearTimeout(this.awaitingResponse)
            this.toggleCallerModal()

            // stop tone

            break

          case 'candidate':
            // message is iceCandidate
            if (this.myPC) this.myPC.addIceCandidate(new RTCIceCandidate(data.candidate))

            break

          case 'sdp':
            // message is signal description
            if (this.myPC) this.myPC.setRemoteDescription(new RTCSessionDescription(data.sdp))

            break

          case 'txt':
            // it is a text chat
            this.addRemoteChat(data.msg, data.date, data.from_id)

            // play msg tone

            break

          case 'typingStatus':
            if (data.status) {
              this.setState({ typingInfo: `${this.state.remoteUsername} is typing` })
            } else {
              this.setState({ typingInfo: '' })
            }

            break

          case 'terminateCall': // when remote terminates call (while call is ongoing)
            this.handleCallTermination()
            // play termination tone
            break

          case 'newSub':
            this.setState({ remoteStatusOnline: true })
            this.props.navigation.setParams({
              remoteStatusOnline: true,
            })

            // once the other user joined and current user has been notified, current user should also send a signal
            // that he is online
            socket.send(
              JSON.stringify({
                action: 'imOnline',
                room: room,
              })
            )

            this.showSnackBar(`${this.state.remoteUsername} entered room`, false)

            break

          case 'imOnline':
            this.setState({ remoteStatusOnline: true })
            this.props.navigation.setParams({
              remoteStatusOnline: true,
            })
            break

          case 'imOffline':
            this.setState({ remoteStatusOnline: false })
            this.props.navigation.setParams({
              remoteStatusOnline: false,
            })

            this.showSnackBar(`${this.state.remoteUsername} left room`, false)
            this.enableCallBtns()
            break
        }
      } else if (data.action === 'subRejected') {
        // subscription on this device rejected cos user has subscribed on another device/browser
        this.showSnackBar('Maximum of two users allowed in room. Communication disallowed', true)
      }
    }

    socket.onopen = (data) => {
      console.log('connect')
      // subscribe to room
      socket.send(
        JSON.stringify({
          action: 'subscribe',
          room: room,
        })
      )
      this.connected = true

      this.showSnackBar('Connected to the chat server!', false)
    }
  }

  async loadMessages() {
    try {
      const data = await ChatService.getChat(this.state.remoteUserId, this.lastMessageId)
      const {
        user: { firstName },
      } = this.props
      console.log(data)
      if (data.length > 0) {
        this.lastMessageId = data[0].message_id
      } else {
        this.noMoreMessages = true
        return
      }
      const messages = data.reduce(
        (acc, { message_id, message_body, message_from, message_time }) => {
          // if (message_body.startsWith('<font ')) return acc
          acc.push({
            _id: message_id,
            text: message_body,
            createdAt: new Date(parseInt(message_time, 10) * 1000),
            user: {
              _id: parseInt(message_from, 10),
              name:
                parseInt(message_from, 10) === this.state.remoteUserId
                  ? this.state.remoteUsername
                  : firstName,
            },
          })
          return acc
        },
        []
      )
      this.setState((previousState) => ({
        messages: GiftedChat.append(messages.reverse(), previousState.messages),
        loadingMore: false,
      }))
    } catch {}
  }

  componentDidMount() {
    analytics().setCurrentScreen('VideoChat', 'VideoChat')

    this.props.navigation.setParams({
      handleAudio: this.initCall.bind(this, false),
      handleVideo: this.initCall.bind(this, true),
      terminateEnabled: false,
      title: this.state.remoteUsername,
      remoteStatusOnline: this.state.remoteStatusOnline,
    })

    this.loadMessages()
  }

  showSnackBar = (title, long) => {
    Snackbar.show({
      title,
      duration: long ? 8000 : 4000,
    })
  }

  initCall = async (isVideo) => {
    const callType = isVideo ? 'Video' : 'Audio'

    // launch calling modal and await receiver's response by sending initCall to him (i.e. receiver)
    // set media constraints based on the button clicked. Audio only should be initiated by default
    // streamConstraints = callType === 'Video' ? { video: { facingMode: 'user', frameRate: { ideal: 10, max: 15 }}, audio:true} : {audio:true};
    this.streamConstraints =
      callType === 'Video' ? { video: { facingMode: 'user' }, audio: true } : { audio: true }

    // set message to display on the call dialog
    const { remoteUsername } = this.state
    this.setState({
      modalText:
        callType === 'Video'
          ? `Video call to ${remoteUsername}`
          : `Audio call to ${remoteUsername}`,
    })

    // start calling tone

    this.setState({ endCallEnabled: false })

    const {
      user: { firstName },
    } = this.props

    // first fetch the turn credentials from server, then send the request to the user
    try {
      this.servers = await ChatService.getTurnCredentials()
    } catch (e) {
      console.log(e)
      // if turn.php API returns error, then use only STUN
      this.servers = [{ urls: 'stun:bturn1.xirsys.com' }]
    }

    socket.send(
      JSON.stringify({
        action: 'initCall',
        msg: callType === 'Video' ? `Video call from ${firstName}` : `Audio call from ${firstName}`,
        room: room,
        servers: this.servers,
      })
    )
    this.setState({ endCallEnabled: true })

    // disable call buttons
    // this.disableCallBtns()

    // wait for response for 30secs
    this.awaitingResponse = setTimeout(() => {
      this.endCall('Call ended due to lack of response', true)
    }, 30000)

    this.toggleCallerModal()
  }

  endCall = (msg, setTimeOut) => {
    socket.send(
      JSON.stringify({
        action: 'endCall',
        msg: msg,
        room: room,
      })
    )

    if (setTimeOut) {
      // display message
      this.setState({ modalText: 'No response', modalRedText: true })

      setTimeout(() => {
        this.setState({ callerModal: false })
      }, 3000)

      this.enableCallBtns()
    } else {
      this.toggleCallerModal()
    }

    clearTimeout(this.awaitingResponse)
  }

  startCall = (isCaller) => {
    console.log(this.servers)
    this.myPC = new RTCPeerConnection({ iceServers: this.servers }) // RTCPeerconnection obj

    // When my ice candidates become available
    this.myPC.onicecandidate = (e) => {
      if (e.candidate) {
        // send my candidate to peer
        socket.send(
          JSON.stringify({
            action: 'candidate',
            candidate: e.candidate,
            room: room,
          })
        )
      }
    }

    // When remote stream becomes available
    // this.myPC.ontrack = (e) => {
    //   console.log('-------')
    //   console.log(e)
    //   this.setState({ remoteSrc: e.streams[0].toURL() })
    // }

    this.myPC.onaddstream = (e) => {
      console.log('onaddstream', e.stream)
      this.setState({ remoteSrc: e.stream.toURL() })
    }

    // when remote connection state and ice agent is closed
    this.myPC.oniceconnectionstatechange = () => {
      switch (this.myPC.iceConnectionState) {
        case 'disconnected':
        case 'failed':
          console.log('Ice connection state is failed/disconnected')
          this.showSnackBar('Call connection problem', true)
          break

        case 'closed':
          console.log("Ice connection state is 'closed'")
          this.showSnackBar('Call connection closed', true)
          break
      }
    }

    // WHEN REMOTE CLOSES CONNECTION
    this.myPC.onsignalingstatechange = () => {
      switch (this.myPC.signalingState) {
        case 'closed':
          this.showSnackBar('Signal lost', true)
          break
      }
    }

    // set local media
    this.setLocalMedia(isCaller)
  }

  description = (desc) => {
    this.myPC.setLocalDescription(desc)

    // send sdp
    socket.send(
      JSON.stringify({
        action: 'sdp',
        sdp: desc,
        room: room,
      })
    )
  }

  getLocalStream = (callback) => {
    mediaDevices.enumerateDevices().then((sourceInfos) => {
      console.log(sourceInfos)
      // let videoSourceId
      // for (let i = 0; i < sourceInfos.length; i++) {
      //   const sourceInfo = sourceInfos[i]
      //   if (sourceInfo.kind == 'videoinput' && sourceInfo.facing == (isFront ? 'front' : 'back')) {
      //     videoSourceId = sourceInfo.deviceId
      //   }
      // }

      // if (this.streamConstraints.video) {
      //   this.streamConstraints = {
      //     ...this.streamConstraints,
      //     video: {
      //       mandatory: {
      //         minWidth: 500, // Provide your own width, height and frame rate here
      //         minHeight: 300,
      //         minFrameRate: 30,
      //       },
      //       ...this.streamConstraints.video,
      //       optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
      //     },
      //   }
      // }
      mediaDevices
        .getUserMedia(this.streamConstraints)
        .then((stream) => {
          // Got stream!
          callback(stream)
        })
        .catch((error) => {
          console.log(error)
        })
    })
  }

  setLocalMedia = (isCaller) => {
    this.getLocalStream((stream) => {
      this.setState({ selfViewSrc: stream.toURL() })

      this.myPC.addStream(stream) // add my stream to RTCPeerConnection

      // set var myMediaStream as the stream gotten. Will be used to remove stream later on
      this.myMediaStream = stream

      if (isCaller) {
        this.myPC.createOffer().then(this.description, (e) => {
          console.log('Error creating offer', e.message)

          this.showSnackBar('Call connection failed', true)
        })

        // then notify callee to start call on his end
        socket.send(
          JSON.stringify({
            action: 'startCall',
            room: room,
          })
        )
      } else {
        // myPC.createAnswer(description);
        this.myPC
          .createAnswer()
          .then(this.description)
          .catch((e) => {
            console.log('Error creating answer', e)

            this.showSnackBar('Call connection failed', false)
          })
      }
    })
  }

  addRemoteChat = (msg, date, fromId) => {
    console.log(date)
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, {
        _id: randomString(5),
        text: msg,
        createdAt: new Date(),
        user: {
          _id: fromId,
          name: previousState.remoteUsername,
        },
      }),
    }))
  }

  addLocalChat = (msg) => {
    const date = new Date().toLocaleTimeString()
    const { remoteUserId } = this.state
    const {
      user: { id },
    } = this.props
    socket.send(
      JSON.stringify({
        action: 'txt',
        msg: msg.text,
        date: date,
        room: room,
        from_id: id,
        to_id: remoteUserId,
      })
    )

    // change the sent status to indicate it has been sent
    if (socket.readyState == 3) {
      // not sent
    } else {
      // sent
    }
  }

  handleCallTermination = () => {
    if (this.myPC) this.myPC.close() // close connection as well

    // tell user that remote terminated call
    this.showSnackBar(`Call terminated by ${this.state.remoteUsername}`, false)

    // remove streams and free media devices
    this.stopMediaStream()

    // remove video playback src

    // enable 'call' button and disable 'terminate call' btn
    this.enableCallBtns()
  }

  stopMediaStream = () => {
    if (this.myMediaStream) {
      //        myMediaStream.getTracks()[0].stop();
      //
      //        myMediaStream.getTracks()[1] ? myMediaStream.getTracks()[1].stop() : "";

      const totalTracks = this.myMediaStream.getTracks().length

      for (let i = 0; i < totalTracks; i++) {
        this.myMediaStream.getTracks()[i].stop()
      }
    }
  }

  enableCallBtns = () => {
    this.setState({ audioEnabled: true, videoEnabled: true, terminateEnabled: false })
    this.props.navigation.setParams({ terminateEnabled: false })
  }

  disableCallBtns = () => {
    this.setState({ audioEnabled: false, videoEnabled: false, terminateEnabled: true })
    this.props.navigation.setParams({ terminateEnabled: true })
  }

  _switchVideoType = () => {
    if (this.streamConstraints.video) {
      const isFront = !this.state.isFront
      this.setState({ isFront })

      this.streamConstraints = {
        ...this.streamConstraints,
        video: {
          ...this.streamConstraints.video,
          facingMode: this.streamConstraints.video.facingMode === 'user' ? 'environment' : 'user',
        },
      }

      this.getLocalStream((stream) => {
        if (this.myMediaStream) {
          if (this.myPC) this.myPC.removeStream(this.myMediaStream)
          this.myMediaStream.release()
        }
        this.myMediaStream = stream
        this.setState({ selfViewSrc: stream.toURL() })

        if (this.myPC) this.myPC.addStream(this.myMediaStream)
      })
    }
  }

  toggleCallerModal = () => {
    this.setState({ callerModal: !this.state.callerModal })
  }

  toggleCalleeModal = () => {
    this.setState({ calleeModal: !this.state.calleeModal })
  }

  terminateCall = () => {
    // close the connection
    if (this.myPC) this.myPC.close()

    // stop media stream
    this.stopMediaStream()

    // remove video playback src

    // inform peer to also end the connection
    socket.send(
      JSON.stringify({
        action: 'terminateCall',
        room: room,
      })
    )

    // enable call buttons
    this.enableCallBtns()
  }

  answerCall = (video) => {
    // set media constraints based on the button clicked. Audio only should be initiated by default
    this.streamConstraints = video
      ? { video: { facingMode: 'user' }, audio: true }
      : { audio: true }

    // show msg that we're setting up call (i.e. locating servers)
    this.setState({ modalText: 'Setting up call' })

    // uncomment the lines below if you comment out the get request above
    this.startCall(true)

    // dismiss modal
    this.toggleCalleeModal()

    // enable the terminateCall btn
    this.disableCallBtns()
  }

  onSend(messages = []) {
    messages.forEach((msg) => this.addLocalChat(msg))

    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  renderFooter = (props) => {
    if (this.state.typingInfo.length > 0) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>{this.state.typingInfo}</Text>
        </View>
      )
    }
    return null
  }

  onInputTextChanged = (text) => {
    if (!this.connected) return
    var msg = text.trim()

    // if user is typing
    if (msg) {
      socket.send(
        JSON.stringify({
          action: 'typingStatus',
          status: true,
          room: room,
        })
      )
    }
    // if no text in input
    else {
      socket.send(
        JSON.stringify({
          action: 'typingStatus',
          status: false,
          room: room,
        })
      )
    }
  }

  isCloseToTop({ layoutMeasurement, contentOffset, contentSize }) {
    const paddingToTop = 0 //80
    return contentSize.height - layoutMeasurement.height - paddingToTop <= contentOffset.y
  }

  componentWillUnmount() {
    if (this.state.terminateEnabled) this.terminateCall()
    socket.close()
  }

  render() {
    const {
      user: { firstName, id },
    } = this.props
    const {
      modalText,
      typingInfo,
      callerModal,
      calleeModal,
      endCallEnabled,
      terminateEnabled,
      remoteUserId,
    } = this.state
    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillBlur={(event) => {
            // add your code here :)
            console.log('going back?', event.action.type === 'Navigation/BACK')
          }}
        />
        <Modal isVisible={callerModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalText}</Text>
            <Button
              titleStyle={styles.buttonTitleStyle}
              disabled={!endCallEnabled}
              onPress={() => {
                this.endCall(`Call ended by ${firstName}`, false)

                // enable call buttons
                this.enableCallBtns()
              }}
              buttonStyle={styles.endCallButton}
              title="End call"
              icon={<Icon name="call-end" color="white" />}
            />
          </View>
        </Modal>
        <Modal isVisible={calleeModal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalText}</Text>
            <View style={styles.buttons}>
              <Button
                buttonStyle={styles.callButton}
                onPress={this.answerCall.bind(this, false)}
                icon={<Icon type="antdesign" name="phone" color="white" />}
              />
              <Button
                buttonStyle={styles.videoButton}
                onPress={this.answerCall.bind(this, true)}
                icon={<Icon type="antdesign" name="videocamera" color="white" />}
              />
              <Button
                buttonStyle={styles.hangupButton}
                onPress={() => {
                  socket.send(
                    JSON.stringify({
                      action: 'callRejected',
                      msg: `Call rejected by ${firstName}`,
                      room: room,
                    })
                  )

                  this.toggleCalleeModal()
                }}
                icon={<Icon name="call-end" color="white" />}
              />
            </View>
          </View>
        </Modal>

        {terminateEnabled ? (
          <>
            <RTCView objectFit="cover" streamURL={this.state.remoteSrc} style={styles.remoteView} />
            <RTCView streamURL={this.state.selfViewSrc} style={styles.selfView} />
            <View style={styles.bottomButtons}>
              <Button
                buttonStyle={styles.hangupButton}
                onPress={this.terminateCall}
                disabled={!terminateEnabled}
                icon={<Icon name="call-end" color="white" />}
              />
              {this.streamConstraints && this.streamConstraints.video && (
                <Button
                  buttonStyle={styles.reverseCamButton}
                  onPress={this._switchVideoType}
                  icon={<Icon type="ionicon" name="ios-reverse-camera" color="white" />}
                  disabled={!terminateEnabled}
                />
              )}
            </View>
          </>
        ) : (
          <GiftedChat
            messages={this.state.messages}
            onSend={(messages) => this.onSend(messages)}
            user={{
              _id: id,
              name: firstName,
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
            renderChatFooter={this.renderFooter}
            extraData={{ typingInfo }}
            onInputTextChanged={this.onInputTextChanged}
            listViewProps={{
              scrollEventThrottle: 400,
              onScroll: ({ nativeEvent }) => {
                if (
                  !this.state.loadingMore &&
                  !this.noMoreMessages &&
                  this.isCloseToTop(nativeEvent)
                ) {
                  this.setState({ loadingMore: true })
                  this.loadMessages()
                }
              },
            }}
            onPressAvatar={(user) => {
              NavigationService.navigate('Profile', { id: remoteUserId })
            }}
          />
        )}

        {/* 
        <View style={{ flexDirection: 'row' }}>
          <Text>{remoteStatusOnline ? 'Online' : 'Offline'}</Text>

          <Text>{typingInfo}</Text>

        </View> */}
      </View>
    )
  }
}

VideoChat.propTypes = {
  user: PropTypes.object,
  navigation: PropTypes.object,
}

const mapStateToProps = (state) => ({
  user: state.user.user,
})

export default connect(mapStateToProps)(VideoChat)
