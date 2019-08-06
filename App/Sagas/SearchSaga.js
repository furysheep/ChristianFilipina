import { put, call, select } from 'redux-saga/effects'
import SearchActions from 'App/Stores/Search/Actions'
import { searchService } from 'App/Services/SearchService'
import { Config } from 'App/Config'

export function* setCustomSearch({ isCustomSearch }) {
  yield put(SearchActions.customSearch(isCustomSearch))

  yield call(searchUser, true)
}

export function* searchUser({ firstLoad }) {
  if (firstLoad) {
    yield put(SearchActions.searchReset())
  }

  yield put(SearchActions.loading())

  try {
    const getSearchState = (state) => state.search
    const {
      loadMoreUrl: loadMore,
      isCustomSearch,
      isBasic,
      questionValues,
      questions,
    } = yield select(getSearchState)
    const searchUrl =
      loadMore || (isCustomSearch ? Config.ADVANCED_SEARCH_URL : Config.LOAD_USERS_URL)

    const params = {}

    if (isCustomSearch) {
      params.advsearch = 'Search'
      params.return_format = 'xml'
      const questionNames = questions
        .filter(
          (question) => (isBasic && question.question_basic_advanced[0] === 'basic') || !isBasic
        )
        .map((q) => q.question_name_for_search[0])
      Object.keys(questionValues).forEach((key) => {
        if (questionNames.indexOf(key) !== -1) {
          params[key] = questionValues[key]
        }
      })
    }

    const { users, loadMoreUrl, totalRecords } = isCustomSearch
      ? yield call(searchService.searchUserCustom, searchUrl, params)
      : yield call(searchService.searchUser, searchUrl)
    if (users) {
      yield put(SearchActions.searchUserSuccess(users, loadMoreUrl, totalRecords))
    } else {
      yield put(SearchActions.searchUserFailure('There was an error while searching users.'))
    }
  } catch (e) {
    console.log(e)
    yield put(SearchActions.searchUserFailure(e))
  }
}

export function* saveSearch({ name }) {
  try {
    console.log(name)
    const getSearchState = (state) => state.search
    const params = {}
    const { isBasic, questionValues, questions } = yield select(getSearchState)
    const questionNames = questions
      .filter(
        (question) => (isBasic && question.question_basic_advanced[0] === 'basic') || !isBasic
      )
      .map((q) => q.question_name_for_search[0])
    Object.keys(questionValues).forEach((key) => {
      if (questionNames.indexOf(key) !== -1) {
        params[key] = questionValues[key]
      }
    })
    const response = yield call(searchService.saveSearch, name, params)
    if (response.success[0] === '1') {
      console.log('save success')
    }
  } catch (e) {
    console.log(e)
  }
}

export function* searchQuestions() {
  try {
    const getQuestions = (state) => state.search.questions
    const stateQuestions = yield select(getQuestions)
    if (stateQuestions.length === 0) {
      const questions = yield call(searchService.searchQuestions)
      const questionValues = {}
      questions.forEach((question) => {
        if (question.question_type[0] === 'switch')
          questionValues[question.question_name_for_search[0]] = 1
        if (question.default_value) {
          questionValues[question.question_name_for_search[0]] = question.default_value[0]
        }
      })
      yield put(SearchActions.searchQuestionsSuccess(questions, questionValues))
    }
  } catch (e) {
    console.log(e)
  }
}

export function* getSavedSearches() {
  try {
    const searchNames = yield call(searchService.getSavedSearches)

    yield put(SearchActions.getSavedSearchesSuccess(searchNames))
  } catch (e) {
    console.log(e)
  }
}
