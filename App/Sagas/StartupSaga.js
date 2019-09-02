import { Platform } from 'react-native'
import { put, delay, call } from 'redux-saga/effects'
import NavigationService from 'App/Services/NavigationService'
import * as RNIap from 'react-native-iap'

/**
 * The startup saga is the place to define behavior to execute when the application starts.
 */

export function* startup() {
  // Dispatch a redux action using `put()`
  // @see https://redux-saga.js.org/docs/basics/DispatchingActions.html
  // yield put(ExampleActions.fetchUser())

  // Add more operations you need to do at startup here
  // ...
  // yield delay(1000)

  // When those operations are finished we redirect to the main screen
  NavigationService.navigateAndReset('LoginScreen')

  // const products = yield call(RNIap.getProducts, items)
  // console.log(products)
}
