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
  const form = new FormData()
  form.append('operation', 'sendwink')
  form.append('ref_id', id)
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.SHOW_PROFILE_URL, form)
      .then((response) => {
        if (in200s(response.status)) {
          if (response.data.success) {
            resolve(response.data.description)
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

function blockUser(id) {
  const form = new FormData()
  form.append('operation', 'banbuddy')
  form.append('ref_id', id)
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.SHOW_PROFILE_URL, form)
      .then((response) => {
        if (in200s(response.status)) {
          if (response.data.success) {
            resolve(response.data.description)
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

function unblockUser(id) {
  return new Promise((resolve, reject) => {
    ApiClient.get(Config.VARIOUS_OPS_URL, {
      params: {
        operation: 'unblock_user',
        ref_userid: id,
      },
    })
      .then((response) => {
        if (in200s(response.status)) {
          if (response.data.success === 1) {
            resolve('Unblocked successfully')
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

function getInboxList(page = 0) {
  const form = new FormData()
  form.append('folder', 'inbox')
  form.append('limit', 10)
  form.append('offset', page * 10)
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.MESSAGES_URL, form)
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              if (result.response)
                resolve(
                  result.response.userdata_list[0].userdata.map((item) => ({
                    ...Object.keys(item).reduce(
                      (acc, key) => ({ ...acc, [key]: item[key][0] }),
                      {}
                    ),
                    imageUrl: `${Config.BASE_URL}${Config.USER_PICTURE_BASE_URL}?id=${
                      item.userid[0]
                    }`,
                  }))
                )
              else resolve([])
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

function deleteInboxThread(messageId, userId) {
  const form = new FormData()
  form.append('last_message_id', messageId)
  form.append('ref_userid', userId)
  form.append('action', 'delete-thread')
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.MESSAGES_CHAT_ACTIONS_URL, form)
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(result.response.success[0] === '1')
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

function unmatchUser(userId) {
  const form = new FormData()
  form.append('ref_userid', userId)
  form.append('action', 'unmatch-user')
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.MESSAGES_CHAT_ACTIONS_URL, form)
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(result.response.success[0] === '1')
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

function archiveInboxThread(userId) {
  const form = new FormData()
  form.append('ref_userid', userId)
  form.append('action', 'archive-thread')
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.MESSAGES_CHAT_ACTIONS_URL, form)
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(result.response.success[0] === '1')
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

function getInboxMessages(userId, offset = 0) {
  const form = new FormData()
  form.append('ref_userid', userId)
  form.append('folder', 'inbox')
  form.append('limit', 10)
  form.append('offset', offset)
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.MESSAGES_CHAT_URL, form)
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve({
                locked: result.response.is_locked[0] === 'yes',
                messages: result.response.messages_list
                  ? result.response.messages_list[0].message
                  : [],
              })
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

function sendInboxMessage(userId, message, messageId) {
  const form = new FormData()
  form.append('last_message_id', messageId)
  form.append('ref_userid', userId)
  form.append('action', 'send-message')
  form.append('msg_body', message)
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.MESSAGES_CHAT_ACTIONS_URL, form)
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            console.log('chat result', result)
            if (err) {
              reject(err)
            } else if (result.response.success[0] === '1') {
              resolve(result.response.message_id[0])
            } else {
              reject(result.response.description[0])
              // resolve(result.response.success[0] === '1')
            }
          })
        } else {
          reject(new Error('Message could not be sent, please try again later'))
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
  getInboxList,
  deleteInboxThread,
  unmatchUser,
  archiveInboxThread,
  getInboxMessages,
  sendInboxMessage,
}
