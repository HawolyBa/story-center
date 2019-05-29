import types from "../types";

const initialState = {
  errors: {},
  loading: false,
  imagesLoading: false,
  progressBarStatus: 'OPEN'
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SET_ERRORS:
      return {
        ...state,
        loading: false,
        errors: action.payload
      }
    case types.CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: {}
      }
    case types.LOADING_UI:
      return {
        ...state,
        loading: true
      }
    case types.LOADING_IMAGE:
      return {
        ...state,
        imagesLoading: true
      }
    case types.GET_IMAGES:
      return {
        ...state,
        imagesLoading: false
      }
    case types.LOCATION_ADDED:
    case types.CHAPTER_DELETED:
    case types.IMAGE_CHANGED:
    case types.STORY_ADDED:
    case types.SET_ALERTS:
      return {
        ...state,
        loading: false
      }
    case types.CLEANUP: {
      return initialState
    }
    case types.SET_PROGRESS_BAR:
      return Object.assign({}, state, { progressBarStatus: action.payload });
    default: 
      return state
  }
}