import { Config } from 'App/Config'
import ApiClient from './ApiClient'
import { parseString } from 'react-native-xml2js'
import { is, curryN, gte } from 'ramda'

const isWithin = curryN(3, (min, max, value) => {
  const isNumber = is(Number)
  return isNumber(min) && isNumber(max) && isNumber(value) && gte(value, min) && gte(max, value)
})
const in200s = isWithin(200, 299)

function getTurnCredentials() {
  const form = new FormData()
  form.append('operation', 'get_turn_credentials')
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.TURN_URL, form)
      .then((response) => {
        if (in200s(response.status)) {
          if (response.data.success === 1) {
            resolve(response.data.iceServersCredentials)
          } else {
            reject(new Error('Fail'))
          }
        } else {
          reject(new Error('Unknown reason'))
        }
      })
      .catch((e) => {
        reject(e)
      })
  })
}

function getChat(id, lastMessageId) {
  const form = new FormData()
  form.append('operation', 'get_user_chats')
  form.append('ref_userid', id)
  form.append('last_message_id', lastMessageId)
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.GET_CHAT, form)
      .then((response) => {
        if (in200s(response.status)) {
          if (response.data.success === 1) {
            resolve(response.data.data)
          } else {
            reject(new Error('Fail'))
          }
        } else {
          reject(new Error('Unknown reason'))
        }
      })
      .catch((e) => {
        reject(e)
      })
  })
}

function sendVideoChatRequest(id, type = 'V') {
  return new Promise((resolve, reject) => {
    ApiClient.get(Config.SEND_REQUEST_URL, {
      params: { action: 'startchat', recipient: id, type },
    })
      .then((response) => {
        if (in200s(response.status)) {
          if (response.data.split('=')[1] === 'success') {
            resolve('success')
          } else {
            reject(new Error(response.data))
          }
        } else {
          reject(new Error('Unknown reason'))
        }
      })
      .catch((e) => {
        reject(e)
      })
  })
}

function sendWink(id) {
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.SHOW_PROFILE_URL, null, {
      params: { operation: 'sendwink', ref_id: id },
    })
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              console.log(result)
            }
          })
        } else {
          reject(new Error('Unknown reason'))
        }
      })
      .catch((e) => {
        reject(e)
      })
  })
}

function blockUser(id) {
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.SHOW_PROFILE_URL, null, {
      params: { operation: 'banbuddy', ref_id: id },
    })
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              console.log(result)
            }
          })
        } else {
          reject(new Error('Unknown reason'))
        }
      })
      .catch((e) => {
        reject(e)
      })
  })
}

function unblockUser(id) {
  return new Promise((resolve, reject) => {
    ApiClient.get(Config.VARIOUS_OPS_URL, {
      params: { operation: 'unblock_user', ref_userid: id },
    })
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              console.log(result)
            }
          })
        } else {
          reject(new Error('Unknown reason'))
        }
      })
      .catch((e) => {
        reject(e)
      })
  })
}

export const ChatService = {
  sendVideoChatRequest,
  getTurnCredentials,
  getChat,
  sendWink,
  blockUser,
  unblockUser,
}
