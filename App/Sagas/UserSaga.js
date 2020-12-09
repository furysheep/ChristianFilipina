import { put, call, delay, select } from 'redux-saga/effects'
import AsyncStorage from '@react-native-community/async-storage'
import * as Keychain from 'react-native-keychain'
import UserActions from 'App/Stores/User/Actions'
import NotificationsActions from 'App/Stores/Notifications/Actions'
import { userService } from 'App/Services/UserService'

export function* loginUser({ email, password, signUp }) {
  yield put(UserActions.userLoading())

  try {
    const user = yield call(userService.loginUser, email, password)
    if (user) {
      yield put(UserActions.updateFirstLogin(signUp))
      yield put(UserActions.loginUserSuccess(user))

      // token
      const token = yield call(AsyncStorage.getItem, 'FCM_TOKEN')
      console.log(token)
      if (token) {
        const success = yield call(userService.updateUserDeviceToken, token)
        console.log('success', success)
      }

      yield put(UserActions.getUnreadNotifications())
      yield put(UserActions.getIncomingChat())
      yield put(NotificationsActions.getNotifications())
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
  } catch (e) {
    console.log(e)
  } finally {
    yield put({ type: 'RESET' })
  }
}

export function* getUnreadNotifications() {
  while (true) {
    try {
      const user = yield select((state) => state.user.user)
      if (user) {
        const notifications = yield call(userService.getUnreadNotifications)
        if (notifications.success) {
          yield put(UserActions.updateNotification(notifications))
        }
      }

      // if (user) {
      //   yield put(UserActions.loginUserSuccess(user))
      // } else {
      //   yield put(
      //     UserActions.loginUserFailure('There was an error while fetching user informations.')
      //   )
      // }
    } catch (e) {
      // yield put(UserActions.loginUserFailure(e.message))
    }
    yield delay(6000)
  }
}

export function* getIncomingChat() {
  while (true) {
    try {
      const user = yield select((state) => state.user.user)
      if (user) {
        const response = yield call(userService.checkIncomingChat, user.id)
        if (response.fromuserid) {
          const data = yield call(userService.getUserData, response.fromuserid)
          yield put(UserActions.setIncomingUserId(response.fromuserid, data))
        }
        // if (notifications.success) {
        //   console.log(notifications)
        //   yield put(UserActions.updateNotification(notifications))
        // }
      }

      // if (user) {
      //   yield put(UserActions.loginUserSuccess(user))
      // } else {
      //   yield put(
      //     UserActions.loginUserFailure('There was an error while fetching user informations.')
      //   )
      // }
    } catch (e) {
      // yield put(UserActions.loginUserFailure(e.message))
    }
    yield delay(6000)
  }
}
