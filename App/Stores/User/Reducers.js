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

export const loginUserFailure = (state, { errorMessage }) => {
  return {
    ...state,
    user: null,
    userIsLoading: false,
    userErrorMessage: errorMessage,
  }
}

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [UserTypes.USER_LOADING]: userLoading,
  [UserTypes.LOGIN_USER_SUCCESS]: loginUserSuccess,
  [UserTypes.LOGIN_USER_FAILURE]: loginUserFailure,
})
