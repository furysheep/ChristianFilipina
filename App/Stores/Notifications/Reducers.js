/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState'
import { createReducer } from 'reduxsauce'
import { NotificationsTypes } from './Actions'

export const loading = (state) => ({
  ...state,
  loading: true,
  errorMessage: null,
  notifications: [],
})

export const getNotificationsSuccess = (state, { notifications }) => ({
  ...state,
  notifications,
  loading: false,
  errorMessage: null,
})

export const getNotificationsFailure = (state, { errorMessage }) => {
  return {
    ...state,
    loading: false,
    errorMessage,
  }
}

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [NotificationsTypes.NOTIFICATIONS_LOADING]: loading,
  [NotificationsTypes.GET_NOTIFICATIONS_SUCCESS]: getNotificationsSuccess,
  [NotificationsTypes.GET_NOTIFICATIONS_FAILURE]: getNotificationsFailure,
})
