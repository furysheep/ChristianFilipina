import { put, call } from 'redux-saga/effects'
import NotificationsActions from 'App/Stores/Notifications/Actions'
import { notificationService } from 'App/Services/NotificationService'

export function* getNotifications() {
  yield put(NotificationsActions.notificationsLoading())

  try {
    const notifications = yield call(notificationService.getRecentPushNotifications)
    if (notifications) {
      yield put(
        NotificationsActions.getNotificationsSuccess(
          notifications.map((notification) => notification.pushnotification)
        )
      )
    } else {
      yield put(
        NotificationsActions.getNotificationsFailure(
          'There was an error while getting notifications.'
        )
      )
    }
  } catch (e) {
    console.log(e)
    yield put(NotificationsActions.getNotificationsFailure(e.message))
  }
}
