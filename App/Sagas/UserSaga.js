import { put, call } from 'redux-saga/effects'
import * as Keychain from 'react-native-keychain'
import UserActions from 'App/Stores/User/Actions'
import { userService } from 'App/Services/UserService'

export function* loginUser({ email, password }) {
  yield put(UserActions.userLoading())

  try {
    const user = yield call(userService.loginUser, email, password)
    if (user) {
      yield put(UserActions.loginUserSuccess(user))
    } else {
      yield put(
        UserActions.loginUserFailure('There was an error while fetching user informations.')
      )
    }
  } catch (e) {
    yield put(UserActions.loginUserFailure(e.message))
  }
}

export function* logout() {
  try {
    yield put(UserActions.userLoading())
    yield Keychain.resetGenericPassword()
    yield call(userService.logout)
    yield put(UserActions.loginUserSuccess(null))
  } catch (e) {
    console.log(e)
  }
}
