/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState'
import { createReducer } from 'reduxsauce'
import { SearchTypes } from './Actions'

export const loading = (state) => ({
  ...state,
  loading: true,
  searchErrorMessage: null,
})

function getUnique(arr, comp) {
  const unique = arr
    .map((e) => e[comp])

    // store the keys of the unique objects
    .map((e, i, final) => final.indexOf(e) === i && i)

    // eliminate the dead keys & store unique objects
    .filter((e) => arr[e])
    .map((e) => arr[e])

  return unique
}

export const searchUserSuccess = (state, { users, loadMoreUrl, totalRecords }) => ({
  ...state,
  users: getUnique(state.users.concat(users), 'id'),
  loading: false,
  loadMoreUrl: loadMoreUrl !== null ? loadMoreUrl : state.loadMoreUrl,
  searchErrorMessage: null,
  totalRecords,
})

export const searchQuestionsSuccess = (state, { questions, questionValues }) => ({
  ...state,
  questions,
  questionValues,
})

export const searchUserFailure = (state, { errorMessage }) => {
  return {
    ...state,
    loading: false,
    searchErrorMessage: errorMessage,
  }
}

export const searchReset = (state) => {
  return {
    ...state,
    loadMoreUrl: null,
    totalRecords: null,
    users: [],
  }
}

export const searchQuestionValuesUpdate = (state, { questionValues }) => {
  return {
    ...state,
    questionValues,
  }
}

export const searchBasicUpdate = (state, { isBasic }) => {
  return {
    ...state,
    isBasic,
  }
}

export const setCustomSearch = (state, { isCustomSearch }) => {
  return {
    ...state,
    users: [], // reset search list
    loadMoreUrl: null,
    isCustomSearch,
    totalRecords: null,
  }
}

export const getSavedSearchesSuccess = (state, { savedSearches }) => ({ ...state, savedSearches })

export const setSavedSearch = (state, { searchName }) => ({ ...state, searchName })

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [SearchTypes.LOADING]: loading,
  [SearchTypes.SEARCH_USER_SUCCESS]: searchUserSuccess,
  [SearchTypes.SEARCH_USER_FAILURE]: searchUserFailure,
  [SearchTypes.SEARCH_RESET]: searchReset,
  [SearchTypes.SEARCH_QUESTIONS_SUCCESS]: searchQuestionsSuccess,
  [SearchTypes.SEARCH_QUESTION_VALUES_UPDATE]: searchQuestionValuesUpdate,
  [SearchTypes.SEARCH_BASIC_UPDATE]: searchBasicUpdate,
  [SearchTypes.CUSTOM_SEARCH]: setCustomSearch,
  [SearchTypes.GET_SAVED_SEARCHES_SUCCESS]: getSavedSearchesSuccess,
  [SearchTypes.SET_SAVED_SEARCH]: setSavedSearch,
})
