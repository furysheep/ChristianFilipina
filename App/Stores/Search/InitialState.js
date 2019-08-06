/**
 * The initial values for the redux state.
 */
export const INITIAL_STATE = {
  users: [],
  questions: [],
  questionValues: {},
  totalRecords: null,
  loadMoreUrl: null,
  reachedEnd: false,
  loading: false,
  userErrorMessage: null,
  isCustomSearch: false,

  isBasic: true,
  savedSearches: [],
  searchName: null,
}
