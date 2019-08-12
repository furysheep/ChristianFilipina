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

export const userService = {
  loginUser,
  logout,
  getUserData,
  getUserPhotos,
}
