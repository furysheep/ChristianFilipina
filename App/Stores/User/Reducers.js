/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { INITIAL_STATE } from './InitialState'
import { createReducer } from 'reduxsauce'
import { UserTypes } from './Actions'

export const userLoading = (state) => ({
  ...state,
  userIsLoading: true,
  userErrorMessage: null,
})

export const loginUserSuccess = (state, { user }) => ({
  ...state,
  user: user,
  userIsLoading: false,
  userErrorMessage: null,
})

export const updateNotification = (state, { notification }) => ({
  ...state,
  notification,
})

export const loginUserFailure = (state, { errorMessage }) => {
  return {
    ...state,
    user: null,
    userIsLoading: false,
    userErrorMessage: errorMessage,
  }
}

export const updateUserLevel = (state, { userLevel }) => {
  if (state.user) {
    const user = state.user
    user.userLevel = userLevel
    return {
      ...state,
      user,
    }
  }
  return state
}

export const updateFirstLogin = (state, { firstLogin }) => {
  return {
    ...state,
    firstLogin,
  }
}

export const setIncomingUserId = (state, { userId, user }) => {
  console.log('userId', userId)
  return {
    ...state,
    incomingUserId: userId,
    incomingUser: user,
  }
}

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [UserTypes.USER_LOADING]: userLoading,
  [UserTypes.LOGIN_USER_SUCCESS]: loginUserSuccess,
  [UserTypes.LOGIN_USER_FAILURE]: loginUserFailure,
  [UserTypes.UPDATE_NOTIFICATION]: updateNotification,
  [UserTypes.UPDATE_USER_LEVEL]: updateUserLevel,
  [UserTypes.UPDATE_FIRST_LOGIN]: updateFirstLogin,
  [UserTypes.SET_INCOMING_USER_ID]: setIncomingUserId,
})
