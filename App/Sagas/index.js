import { takeLatest, all } from 'redux-saga/effects'
import { UserTypes } from 'App/Stores/User/Actions'
import { StartupTypes } from 'App/Stores/Startup/Actions'
import { loginUser, logout, getUnreadNotifications, getIncomingChat } from './UserSaga'
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
import { NotificationsTypes } from 'App/Stores/Notifications/Actions'
import { getNotifications } from 'App/Sagas/NotificationsSaga'

export default function* root() {
  yield all([
    /**
     * @see https://redux-saga.js.org/docs/basics/UsingSagaHelpers.html
     */
    // Run the startup saga when the application starts
    takeLatest(StartupTypes.STARTUP, startup),

    takeLatest(UserTypes.LOGIN_USER, loginUser),
    takeLatest(UserTypes.LOGOUT, logout),
    takeLatest(UserTypes.GET_UNREAD_NOTIFICATIONS, getUnreadNotifications),
    takeLatest(UserTypes.GET_INCOMING_CHAT, getIncomingChat),

    takeLatest(SearchTypes.SEARCH_USER, searchUser),
    takeLatest(SearchTypes.SET_CUSTOM_SEARCH, setCustomSearch),
    takeLatest(SearchTypes.SEARCH_QUESTIONS, searchQuestions),
    takeLatest(SearchTypes.SAVE_SEARCH, saveSearch),
    takeLatest(SearchTypes.GET_SAVED_SEARCHES, getSavedSearches),
    takeLatest(SearchTypes.SET_SAVED_SEARCH, setSavedSearch),

    takeLatest(NotificationsTypes.GET_NOTIFICATIONS, getNotifications),
  ])
}
