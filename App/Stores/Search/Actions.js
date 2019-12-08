import { createActions } from 'reduxsauce'

/**
 * We use reduxsauce's `createActions()` helper to easily create redux actions.
 *
 * Keys are action names and values are the list of parameters for the given action.
 *
 * Action names are turned to SNAKE_CASE into the `Types` variable. This can be used
 * to listen to actions:
 *
 * - to trigger reducers to update the state, for example in App/Stores/Example/Reducers.js
 * - to trigger sagas, for example in App/Sagas/index.js
 *
 * Actions can be dispatched:
 *
 * - in React components using `dispatch(...)`, for example in App/App.js
 * - in sagas using `yield put(...)`, for example in App/Sagas/ExampleSaga.js
 *
 * @see https://github.com/infinitered/reduxsauce#createactions
 */
const { Types, Creators } = createActions({
  // Search
  searchUser: ['firstLoad'],
  searchLoading: null,
  searchReset: null,
  searchUserSuccess: ['users', 'loadMoreUrl', 'totalRecords'],
  searchUserFailure: ['errorMessage'],

  // Filter
  searchQuestions: null,
  searchQuestionsSuccess: ['questions', 'questionValues'],
  searchQuestionValuesUpdate: ['questionValues'],
  searchBasicUpdate: ['isBasic'],
  setCustomSearch: ['isCustomSearch'],
  customSearch: ['isCustomSearch'], // result

  // Saved search
  saveSearch: ['name'],
  getSavedSearches: null,
  getSavedSearchesSuccess: ['savedSearches'],
  setSavedSearch: ['searchName'],
  savedSearch: ['searchName'],
})

export const SearchTypes = Types
export default Creators
