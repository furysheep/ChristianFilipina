import { Platform } from 'react-native'
import md5 from 'md5'
import { Config } from 'App/Config'
import ApiClient from './ApiClient'
import { parseString } from 'react-native-xml2js'
import { is, curryN, gte } from 'ramda'

const isWithin = curryN(3, (min, max, value) => {
  const isNumber = is(Number)
  return isNumber(min) && isNumber(max) && isNumber(value) && gte(value, min) && gte(max, value)
})
const in200s = isWithin(200, 299)

function loginUser(email, password) {
  return new Promise((resolve, reject) => {
    ApiClient.get(Config.LOGIN_URL, {
      params: {
        mobilelogin: true,
        deviceid: null,
        network: Platform.OS,
        txtusername: email,
        txtpassword: md5(password),
        password_md5: true,
      },
    })
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
                resolve({
                  id: loginresults.id[0],
                  firstName: loginresults.firstname[0],
                  city: loginresults.city ? loginresults.city[0] : '',
                  country: loginresults.country ? loginresults.country[0] : '',
                  profileUrl: loginresults.profile_url ? loginresults.profile_url[0] : '',
                  imageUrl: loginresults.profile_picture ? loginresults.profile_picture[0] : '',
                  userLevel: loginresults.user_level[0],
                  subscribeUrl: loginresults.subscribe_url[0],
                  age: loginresults.age ? loginresults.age[0] : '',
                  stateProvince: loginresults.state_province ? loginresults.state_province : '',
                  countryCode: loginresults.country_code[0],
                  modifyProfileUrl: loginresults.modify_profile_url[0],
                  winksUrl: loginresults.winks_url[0],
                  messagesUrl: loginresults.messages_url[0],
                  forumUrl: loginresults.forum_url[0],
                  researchUrl: loginresults.research_url[0],
                  testimonialsUrl: loginresults.testimonials_url[0],
                  hasChatPermission: !!loginresults.chatbutton[0],
                })
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

export const userService = {
  loginUser,
}
