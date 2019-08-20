import { Platform } from 'react-native'
import md5 from 'md5'
import { Config } from 'App/Config'
import ApiClient, { buildUserObject } from './ApiClient'
import { parseString } from 'react-native-xml2js'
import { is, curryN, gte } from 'ramda'

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
              const { loginresults } = result
              if (loginresults.errid !== undefined) {
                reject(loginresults.description[0])
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
              resolve(buildUserObject(result.userdata))
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
              resolve(
                result.response.list.map((item) => ({
                  ...buildUserObject(item),
                  imageUrl: `${Config.BASE_URL}${Config.USER_PICTURE_BASE_URL}?id=${item.id[0]}`,
                }))
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
              resolve(
                result.response.list.map((item) => ({
                  ...buildUserObject(item),
                  imageUrl: `${Config.BASE_URL}${Config.USER_PICTURE_BASE_URL}?id=${item.id[0]}`,
                }))
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

function sendBugReport(text) {
  const form = new FormData()
  form.append('message', text)
  return new Promise((resolve, reject) => {
    ApiClient.post(Config.SEND_PROBLEM_REPORT_URL, form)
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

export const userService = {
  loginUser,
  logout,
  getUserData,
  getUserPhotos,
  getViewedProfiles,
  getViewedMeProfiles,
  getWinks,
  setSpeedDatingAnswer,
  resetUnreadViews,
  resetUnreadWinks,
  sendContactUsMessage,
  sendBugReport,
  getPickedMe,
  getMyPicks,
}
