import { Platform } from 'react-native'
import md5 from 'md5'
import { parseString } from 'react-native-xml2js'
import { is, curryN, gte } from 'ramda'
import RNFS from 'react-native-fs'
import { Config } from 'App/Config'
import ApiClient, { buildUserObject } from './ApiClient'

const isWithin = curryN(3, (min, max, value) => {
  const isNumber = is(Number)
  return isNumber(min) && isNumber(max) && isNumber(value) && gte(value, min) && gte(max, value)
})
const in200s = isWithin(200, 299)

function loginUser(email, password) {
  return new Promise((resolve, reject) => {
    ApiClient.post(
      Config.LOGIN_URL,
      {},
      {
        params: {
          mobilelogin: true,
          deviceid: null,
          network: Platform.OS,
          txtusername: email,
          txtpassword: md5(password),
          password_md5: true,
        },
      }
    )
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              console.log(result)
              const { loginresults } = result
              if (loginresults.errid !== undefined) {
                reject(new Error(loginresults.description[0]))
              } else {
                resolve(buildUserObject(loginresults))
              }
            }
          })

          return response.data
        } else {
          reject(new Error('Unknown reason'))
        }
      })
      .catch((e) => {
        reject(e)
      })
  })
}

function logout() {
  return new Promise((resolve, reject) => {
    ApiClient.post(
      Config.LOGOUT_URL,
      {},
      {
        params: {
          return_format: 'xml',
        },
      }
    )
      .then((response) => {
        if (in200s(response.status)) {
          resolve()
        } else {
          reject(new Error('Unknown reason'))
        }
      })
      .catch((e) => {
        console.log(e)
        reject(e)
      })
  })
}

function getUserPhotos(id) {
  return new Promise((resolve, reject) => {
    ApiClient.get(Config.GET_USER_RECENT_ACTIVITY_URL, {
      params: {
        userid: id,
        data: 'photos',
      },
    })
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(result.photos.photo)
            }
          })
        } else {
          reject(new Error('Unknown reason'))
        }
      })
      .catch((e) => {
        console.log(e)
        reject(e)
      })
  })
}

function getUserData(id) {
  return new Promise((resolve, reject) => {
    ApiClient.get(Config.GET_USER_DATA_URL, {
      params: {
        userid: id,
        data: 'userdata',
        network: Platform.OS,
        page_name: 'view_profile',
      },
    })
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve({ ...buildUserObject(result.userdata), id })
            }
          })
        } else {
          reject(new Error('Unknown reason'))
        }
      })
      .catch((e) => {
        console.log(e)
        reject(e)
      })
  })
}

function uploadPhoto(uri) {
  const form = new FormData()
  form.append('txtimage', { uri, name: 'upload.jpg', type: 'image/jpg' })
  form.append('mobile_key', '99e241e35e5e284ada802c63440d6ef8')
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.PICTURE_UPLOAD_URL, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        if (in200s(response.status)) {
          resolve()
        } else {
          reject(new Error('Unknown reason'))
        }
      })
      .catch((e) => {
        console.log(e)
        reject(e)
      })
  })
}

function getProfileQuestionsAndAnswers() {
  return new Promise((resolve, reject) => {
    ApiClient.get(Config.PROFILE_QUESTIONS_AND_ANSWERS_URL, {})
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(
                result.question_list.question.reduce(
                  (acc, question) => ({
                    ...acc,
                    [question.type]: {
                      label: question.question_label[0],
                      options: question.question_options[0].question_option.map((option) => ({
                        label: option.option_label[0],
                        value: option.option_id[0],
                      })),
                    },
                  }),
                  {}
                )
              )
            }
          })
        } else {
          reject(new Error('Unknown reason'))
        }
      })
      .catch((e) => {
        console.log(e)
        reject(e)
      })
  })
}

function updateUserProfileData(
  firstname,
  lastname,
  lookagestart,
  lookageend,
  agePrefStrict,
  birthday,
  timezone,
  addressLine1,
  addressLine2,
  city,
  state,
  zip,
  country,
  about
) {
  const form = new FormData()
  form.append('firstname', firstname)
  form.append('lastname', lastname)
  form.append('lookagestart', lookagestart)
  form.append('lookageend', lookageend)
  form.append('age_pref_strict', agePrefStrict ? 'yes' : 'no')
  const dateComponents = birthday.split('-')
  form.append('birthday_month', dateComponents[1])
  form.append('birthday_day', dateComponents[2])
  form.append('birthday_year', dateComponents[0])
  form.append('timezone', timezone)
  form.append('address_line1', addressLine1)
  form.append('address_line2', addressLine2)
  form.append('city', city)
  form.append('state_province', state)
  form.append('zip', zip)
  form.append('country', country)
  form.append('about_me', about)
  form.append('return_format', 'xml')

  return new Promise((resolve, reject) => {
    ApiClient.post(Config.UPDATE_USER_PROFILE_URL, form)
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
        console.log(e)
        reject(e)
      })
  })
}

function doQuestionsSave(questions) {
  const form = new FormData()
  form.append('operation', 'update_question_answers')
  Object.keys(questions).forEach((type) => {
    form.append(type, questions[type])
  })
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.PROFILE_QUESTIONS_AND_ANSWERS_URL, form)
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            console.log(result)
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
        console.log(e)
        reject(e)
      })
  })
}

function getViewedProfiles(id) {
  const form = new FormData()
  form.append('operation', 'get_viewed_by_me')
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.LIST_VIEWS_AND_WINKS_URL, form)
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(result.listviewwinks.list)
            }
          })
        } else {
          reject(new Error('Unknown reason'))
        }
      })
      .catch((e) => {
        console.log(e)
        reject(e)
      })
  })
}

function getViewedMeProfiles(id) {
  const form = new FormData()
  form.append('operation', 'get_views')
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.LIST_VIEWS_AND_WINKS_URL, form)
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(result.listviewwinks.list)
            }
          })
        } else {
          reject(new Error('Unknown reason'))
        }
      })
      .catch((e) => {
        console.log(e)
        reject(e)
      })
  })
}

function getWinks(id) {
  const form = new FormData()
  form.append('operation', 'get_winks')
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.LIST_VIEWS_AND_WINKS_URL, form)
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(result.listviewwinks.list)
            }
          })
        } else {
          reject(new Error('Unknown reason'))
        }
      })
      .catch((e) => {
        console.log(e)
        reject(e)
      })
  })
}

function getPickedMe() {
  const form = new FormData()
  form.append('operation', 'who_picked_me')
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.SPEED_DATING_GAME_API_URL, form)
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              if (result.response.list)
                resolve(
                  result.response.list.map((item) => ({
                    ...buildUserObject(item),
                    imageUrl: `${Config.BASE_URL}${Config.USER_PICTURE_BASE_URL}?id=${item.id[0]}`,
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
        console.log(e)
        reject(e)
      })
  })
}

function getMyPicks() {
  const form = new FormData()
  form.append('operation', 'my_picks')
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.SPEED_DATING_GAME_API_URL, form)
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              if (result.response.list)
                resolve(
                  result.response.list.map((item) => ({
                    ...buildUserObject(item),
                    imageUrl: `${Config.BASE_URL}${Config.USER_PICTURE_BASE_URL}?id=${item.id[0]}`,
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
        console.log(e)
        reject(e)
      })
  })
}

function loadUsers() {
  return new Promise((resolve, reject) => {
    ApiClient.get(Config.LOAD_USERS_URL)
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(result.onlineuserlist.data.map((user) => buildUserObject(user)))
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

function setSpeedDatingAnswer(id, interested) {
  const form = new FormData()
  form.append('ref_userid', id)
  form.append('interested', interested ? 'yes' : 'no')
  form.append('operation', 'add')
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.SPEED_DATING_GAME_API_URL, form)
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              if (result.response.success[0] === '1') {
                resolve()
              } else {
                reject(new Error(result.response.description[0]))
              }
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

function resetUnreadViews() {
  const form = new FormData()
  form.append('operation', 'read_view_notification')
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.NOTIFICATIONS_REQUEST_URL, form)
      .then((response) => {
        if (in200s(response.status)) {
          resolve(response.data.success)
        } else {
          reject(new Error('Unknown reason'))
        }
      })
      .catch((e) => {
        console.log(e)
        reject(e)
      })
  })
}

function resetUnreadWinks() {
  const form = new FormData()
  form.append('operation', 'read_winks_notification')
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.NOTIFICATIONS_REQUEST_URL, form)
      .then((response) => {
        if (in200s(response.status)) {
          resolve(response.data.success)
        } else {
          reject(new Error('Unknown reason'))
        }
      })
      .catch((e) => {
        console.log(e)
        reject(e)
      })
  })
}

function sendContactUsMessage(text) {
  const form = new FormData()
  form.append('message', text)
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.CONTACT_US_URL, form)
      .then((response) => {
        if (in200s(response.status)) {
          resolve()
        } else {
          reject(new Error('Unknown reason'))
        }
      })
      .catch((e) => {
        console.log(e)
        reject(e)
      })
  })
}

async function sendBugReport(userId, text) {
  const form = new FormData()
  form.append('ouid', userId)
  const path = `${RNFS.TemporaryDirectoryPath}/logs.txt`
  await RNFS.writeFile(path, text, 'utf8')
  console.log(path)
  form.append('txtlogs', {
    uri: `file:///${path}`,
    type: 'text/plain',
    name: 'logs.txt',
  })
  // form.append('txtlogs', new Blob([text, { type: 'text/plain' }]), 'logs.txt')
  // form.append('txtlogs', text)
  return new Promise((resolve, reject) => {
    fetch(`${Config.BASE_URL}${Config.SEND_PROBLEM_REPORT_URL}`, {
      method: 'POST',
      body: form,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((res) => {
        res.status === 200 ? resolve(res.text()) : reject(res.text())
      })
      .catch((e) => {
        reject(e)
      })

    // ApiClient.post(Config.SEND_PROBLEM_REPORT_URL, form, {
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    // })
    //   .then((response) => {
    //     console.log(response)
    //     if (in200s(response.status)) {
    //       resolve()
    //     } else {
    //       reject(new Error('Unknown reason'))
    //     }
    //   })
    //   .catch((e) => {
    //     console.log(e)
    //     reject(e)
    //   })
  })
}

function mobileUpgrade(
  productId,
  signature,
  transactionId,
  transactionDate,
  originalMessage,
  receiptId
) {
  const form = new FormData()
  form.append('productId', productId)
  form.append('signature', signature)
  form.append('transactionId', transactionId)
  form.append('transactionDate', transactionDate)
  form.append('originalMessage', originalMessage)
  form.append('receipt_id', receiptId)
  form.append('platform', Platform.OS)
  if (Platform.OS === 'ios') {
    form.append('ios_password', 'dcd937df41634d13883e054c64bda425')
  }
  console.log('---form----', form)
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.PROCESS_MOBILE_UPGRADE_URL, form)
      .then((response) => {
        console.log(response)
        try {
          if (in200s(response.status)) {
            resolve(response.data.user_level)
            return
          }
        } catch {}
        reject(new Error('Unknown reason'))
      })
      .catch((e) => {
        console.log(e)
        reject(e)
      })
  })
}

function getUnreadNotifications() {
  const form = new FormData()
  form.append('operation', 'get_unread_notifications')
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.NOTIFICATIONS_REQUEST_URL, form)
      .then((response) => {
        if (in200s(response.status) && response.data) {
          // {"success":true,"new_messages":4,"new_viewwinks":15,"unread_winks":13,"unread_views":2,"unread_messages":4}
          resolve(response.data)
        } else {
          reject(new Error('Unknown reason'))
        }
      })
      .catch((e) => {
        console.log(e)
        reject(e)
      })
  })
}

function checkIncomingChat(userId) {
  const form = new FormData()
  form.append('mobile_app', true)
  form.append('user', userId)
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.INCOMING_CHAT_REQUEST_URL, form)
      .then((response) => {
        if (in200s(response.status) && response.data) {
          resolve(response.data)
        } else {
          reject(new Error('Unknown reason'))
        }
      })
      .catch((e) => {
        console.log(e)
        reject(e)
      })
  })
}

function sendForgotPasswordEmail(email) {
  const form = new FormData()
  form.append('txtemail', email)
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.FORGOT_PASSWORD_API_URL, form)
      .then((response) => {
        console.log(response.data)
        if (in200s(response.status)) {
          // {"success":true,"new_messages":4,"new_viewwinks":15,"unread_winks":13,"unread_views":2,"unread_messages":4}
          resolve(response.data.success)
        } else {
          reject(new Error('Unknown reason'))
        }
      })
      .catch((e) => {
        console.log(e)
        reject(e)
      })
  })
}

function signupUser(email, password, firstName, gender) {
  const form = new FormData()
  form.append('first_name', firstName)
  form.append('email', email)
  form.append('password', password)
  form.append('gender', gender ? 'M' : 'F')
  form.append('tzoffset', new Date().getTimezoneOffset())
  form.append('return_format', 'xml')
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.SIGNUP_URL, form)
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            console.log(result)
            if (err) {
              reject(err)
            } else {
              resolve(result.response)
            }
          })
        } else {
          reject(new Error('Unknown reason'))
        }
      })
      .catch((e) => {
        console.log(e)
        reject(e)
      })
  })
}

function updateUserDeviceToken(deviceId) {
  const form = new FormData()
  form.append('device_token', deviceId)
  form.append('network', Platform.OS === 'ios' ? 'itunes' : 'android')
  form.append('is_fcm', true)
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.UPDATE_USER_DEVICE_TOKEN_URL, form)
      .then((response) => {
        if (in200s(response.status)) {
          resolve(response.data.success)
        } else {
          reject(new Error('Unknown reason'))
        }
      })
      .catch((e) => {
        console.log(e)
        reject(e)
      })
  })
}

export const userService = {
  loginUser,
  logout,
  getUserData,
  getUserPhotos,
  updateUserProfileData,
  doQuestionsSave,
  getViewedProfiles,
  getViewedMeProfiles,
  getWinks,
  loadUsers,
  setSpeedDatingAnswer,
  resetUnreadViews,
  resetUnreadWinks,
  sendContactUsMessage,
  sendBugReport,
  getPickedMe,
  getMyPicks,
  uploadPhoto,
  getProfileQuestionsAndAnswers,
  mobileUpgrade,
  getUnreadNotifications,
  sendForgotPasswordEmail,
  checkIncomingChat,
  signupUser,
  updateUserDeviceToken,
}
