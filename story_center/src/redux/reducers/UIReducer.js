import types from "../types";

const initialState = {
  errors: {},
  loading: false,
  imagesLoading: false
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
      return {
        ...state,
        loading: false
      }
    case types.CLEANUP: {
      return initialState
    }
    default: 
      return state
  }
}