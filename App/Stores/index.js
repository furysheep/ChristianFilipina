import { combineReducers } from 'redux'
import configureStore from './CreateStore'
import rootSaga from 'App/Sagas'
import { reducer as UserReducer } from './User/Reducers'
import { reducer as SearchReducer } from './Search/Reducers'
import { reducer as NotificationsReducer } from './Notifications/Reducers'

export default () => {
  const rootReducer = combineReducers({
    /**
     * Register your reducers here.
     * @see https://redux.js.org/api-reference/combinereducers
     */
    user: UserReducer,
    search: SearchReducer,
    notifications: NotificationsReducer,
  })

  return configureStore(rootReducer, rootSaga)
}
