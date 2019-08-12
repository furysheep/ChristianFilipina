import { Config } from 'App/Config'
import ApiClient, { buildUserObject } from './ApiClient'
import { parseString } from 'react-native-xml2js'
import { is, curryN, gte } from 'ramda'

const isWithin = curryN(3, (min, max, value) => {
  const isNumber = is(Number)
  return isNumber(min) && isNumber(max) && isNumber(value) && gte(value, min) && gte(max, value)
})
const in200s = isWithin(200, 299)

function searchUser(searchUrl) {
  return new Promise((resolve, reject) => {
    ApiClient.get(searchUrl, {
      params: {},
    })
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              const { data, load_more } = result[Object.keys(result)[0]]
              if (data) {
                const users = data.map((user) => buildUserObject(user))
                resolve({ users, loadMoreUrl: load_more ? load_more[0] : null })
              } else {
                resolve({ users: [], loadMoreUrl: null })
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

function searchUserCustom(searchUrl, params) {
  return new Promise((resolve, reject) => {
    ApiClient.get(searchUrl, {
      params,
    })
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              console.log(result)
              const { user, load_more, total_records } = result[Object.keys(result)[0]]
              if (user) {
                const users = user.map((user) => buildUserObject(user))
                resolve({
                  users,
                  loadMoreUrl: load_more ? load_more[0] : null,
                  totalRecords: total_records ? total_records[0] : null,
                })
              } else {
                resolve({ users: [], loadMoreUrl: null })
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

function searchQuestions() {
  return new Promise((resolve, reject) => {
    ApiClient.get(Config.SEARCH_API_URL, {
      params: { get_questions_and_answers: 1 },
    })
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(result.question_list.question)
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

function saveSearch(name, params) {
  return new Promise((resolve, reject) => {
    ApiClient.get(Config.SEARCH_API_URL, {
      params: { save_named_search: 1, search_name: name, ...params },
    })
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(result.save_named_search)
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

function getSavedSearches() {
  return new Promise((resolve, reject) => {
    ApiClient.get(Config.SEARCH_API_URL, {
      params: { get_saved_searches: 1 },
    })
      .then((response) => {
        if (in200s(response.status)) {
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(result.saved_searches.search_name)
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

function getSavedSearch(searchName) {
  return new Promise((resolve, reject) => {
    ApiClient.get(Config.ADVANCED_SEARCH_URL, {
      params: { get_saved_search: 1, search_name: searchName, return_format: 'xml' },
    })
      .then((response) => {
        if (in200s(response.status)) {
          console.log(response.data)
          parseString(response.data, (err, result) => {
            if (err) {
              reject(err)
            } else {
              console.log(result)
              // resolve(result.saved_searches.search_name)
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

export const searchService = {
  searchUser,
  searchUserCustom,
  searchQuestions,
  saveSearch,
  getSavedSearches,
  getSavedSearch,
}
