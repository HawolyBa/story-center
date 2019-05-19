import types from '../types'

const initialState = {
  imageError: '',
  message: '',
  alert: ''
}

export default function(state = initialState, action) {
  switch(action.type) {
    case types.IMAGE_ERROR:
      return {
        imageError: action.payload.message
      }
    case types.CHARACTER_ADDED:
    case types.LIKED:
    case types.UNLIKED:
    case types.LIKE_ERROR:
    case types.LOCATION_ADDED:
    case types.STORY_ADDED:
    case types.COMMENT_POSTED:
    case types.VERIFY_EMAIL:
    case types.CHAPTER_RATED:
    case types.SET_ALERTS:
    case types.LOCATION_DELETED:
    case types.PASSWORD_RESET:
    case types.PASSWORD_RESET_ERROR:
    case types.REPORT_SENT:
      return {
        message: action.payload.message,
        alert: action.payload.alert
      }
    case types.CLEANUP:
      return initialState
    default:
      return state
  }
}