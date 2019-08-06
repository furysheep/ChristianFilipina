import { takeLatest, all } from 'redux-saga/effects'
import { UserTypes } from 'App/Stores/User/Actions'
import { StartupTypes } from 'App/Stores/Startup/Actions'
import { loginUser } from './UserSaga'
import { startup } from './StartupSaga'
import { SearchTypes } from 'App/Stores/Search/Actions'
import {
  searchUser,
  searchQuestions,
  setCustomSearch,
  saveSearch,
  getSavedSearches,
  setSavedSearch,
} from 'App/Sagas/SearchSaga'

export default function* root() {
  yield all([
    /**
     * @see https://redux-saga.js.org/docs/basics/UsingSagaHelpers.html
     */
    // Run the startup saga when the application starts
    takeLatest(StartupTypes.STARTUP, startup),

    takeLatest(UserTypes.LOGIN_USER, loginUser),

    takeLatest(SearchTypes.SEARCH_USER, searchUser),
    takeLatest(SearchTypes.SET_CUSTOM_SEARCH, setCustomSearch),
    takeLatest(SearchTypes.SEARCH_QUESTIONS, searchQuestions),
    takeLatest(SearchTypes.SAVE_SEARCH, saveSearch),
    takeLatest(SearchTypes.GET_SAVED_SEARCHES, getSavedSearches),
  ])
}
