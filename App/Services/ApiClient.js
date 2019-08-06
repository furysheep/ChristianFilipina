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

export function buildUserObject(obj) {
  const user = {}
  user.id = parseInt(obj.id[0], 10)
  user.firstName = obj.firstname ? obj.firstname[0] : null

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
