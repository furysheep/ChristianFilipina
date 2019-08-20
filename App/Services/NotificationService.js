import { Platform } from 'react-native'
import { Config } from 'App/Config'
import ApiClient, { buildUserObject } from './ApiClient'
import { parseString } from 'react-native-xml2js'
import { is, curryN, gte } from 'ramda'

const isWithin = curryN(3, (min, max, value) => {
  const isNumber = is(Number)
  return isNumber(min) && isNumber(max) && isNumber(value) && gte(value, min) && gte(max, value)
})
const in200s = isWithin(200, 299)

function getRecentPushNotifications() {
  return new Promise((resolve, reject) => {
    ApiClient.get(Config.GET_PUSH_NOTIFICATIONS_URL, {
      params: {
        format: 'json',
        retrieve: 10,
      },
    })
      .then((response) => {
        if (in200s(response.status)) {
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

function updateOnServerPushNotificationsAllRead() {
  return new Promise((resolve, reject) => {
    ApiClient.get(Config.VARIOUS_OPS_URL, {
      params: {
        operation: 'read_all_pn',
      },
    })
      .then((response) => {
        if (in200s(response.status)) {
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

function updateOnServerPushNotificationRead(id) {
  return new Promise((resolve, reject) => {
    ApiClient.get(Config.VARIOUS_OPS_URL, {
      params: {
        operation: 'read_pn',
        pn_id: id,
      },
    })
      .then((response) => {
        if (in200s(response.status)) {
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

export const notificationService = {
  getRecentPushNotifications,
  updateOnServerPushNotificationsAllRead,
  updateOnServerPushNotificationRead,
}
