import axios from 'axios'
import { Config } from 'App/Config'

export default axios.create({
  baseURL: Config.BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

class User {
  //1,5,7,8 level user has ability to start text/video chat

  canUserStartChat = () => {
    const { userLevel } = this

    switch (userLevel) {
      case User.GOLD:
      case User.UNLIMITED_LIFETIME:
      case User.DIAMOND:
      case User.PLATINUM:
      case User.FEATURED_SILVER:
      case User.FEATURED_PLATINUM:
      case User.FEATURED_UNLIMITED:
      case User.FEATURED_GOLD:
        return true

      default:
        return false
    }
  }
}

User.FREE = '4'
User.SILVER = '2'
User.GOLD = '1'
User.PLATINUM = '8'
User.UNLIMITED_LIFETIME = '5'
User.BRONZE = '6'
User.DIAMOND = '7'
User.FEATURED_SILVER = '9'
User.FEATURED_PLATINUM = '10'
User.FEATURED_UNLIMITED = '11'
User.FEATURED_GOLD = '16'

export function buildUserObject(obj) {
  const user = new User()
  // userdata api
  user.about = obj.about ? obj.about[0].replace(/<\s*\/?br\s*[\/]?>/gi, '\n') : null
  user.addressLine1 = obj.address_line1 ? obj.address_line1[0] : null
  user.addressLine2 = obj.address_line2 ? obj.address_line2[0] : null

  user.isBlocked = obj.is_blocked ? obj.is_blocked[0] === '1' : null
  user.isOnline = obj.is_online ? obj.is_online[0] === '1' : null
  user.lastLoggedIn = obj.last_logged_in ? obj.last_logged_in[0] : null
  user.membersince = obj.membersince ? obj.membersince[0] : null

  user.birthDate = obj.birth_date ? obj.birth_date[0] : null

  // pref
  user.agePrefStrict = obj.age_pref_strict ? obj.age_pref_strict[0] : null
  user.lookageend = obj.lookageend ? obj.lookageend[0] : null
  user.lookagestart = obj.lookagestart ? obj.lookagestart[0] : null
  user.profileDataArray = obj.profile_data_array
    ? obj.profile_data_array[0].profile_data_item.map((item) => {
        const result = {}
        Object.keys(item).forEach((key) => {
          result[key] = item[key][0]
        })
        return result
      })
    : null
  user.recentActivityArray = obj.recent_activity_array
    ? obj.recent_activity_array[0].recent_activity_item.map((item) => {
        const result = {}
        Object.keys(item).forEach((key) => {
          result[key] = item[key][0]
        })
        return result
      })
    : null

  user.sendMessageUrl = obj.send_message_url ? obj.send_message_url[0] : null
  user.timezone = obj.timezone ? obj.timezone[0] : null
  user.zip = obj.zip ? obj.zip[0] : null

  user.id = obj.id ? parseInt(obj.id[0], 10) : null
  user.firstName = obj.firstname ? obj.firstname[0] : null
  user.lastName = obj.lastname ? obj.lastname[0] : null

  user.city = obj.city ? obj.city[0] : null

  user.country = obj.country ? obj.country[0] : null
  user.profile_url = obj.profile_url ? obj.profile_url[0] : null
  user.imageUrl = obj.profile_picture ? obj.profile_picture[0] : null

  // it presents only for free users
  user.userLevel = obj.user_level ? obj.user_level[0] : null
  user.subscribeUrl = obj.subscribe_url ? obj.subscribe_url[0] : null
  user.age = obj.age ? obj.age[0] : null

  user.stateProvince = obj.state_province ? obj.state_province[0] : null
  user.countryCode = obj.country_code ? obj.country_code[0] : null

  // only for myself
  user.modifyProfileUrl = obj.modify_profile_url ? obj.modify_profile_url[0] : null
  user.winksUrl = obj.winks_url ? obj.winks_url[0] : null
  user.messagesUrl = obj.messages_url ? obj.messages_url[0] : null
  user.forumUrl = obj.forum_url ? obj.forum_url[0] : null
  user.researchUrl = obj.research_url ? obj.research_url[0] : null
  user.testimonialsUrl = obj.testimonials_url ? obj.testimonials_url[0] : null

  return user
}
