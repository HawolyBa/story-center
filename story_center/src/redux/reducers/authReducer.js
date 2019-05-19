import types from "../types";

const initialState = {
  authError: '',
  currentUser: {},
  updateProfileError: '',
  updateProfileSuccess: '',
  isNightMode: false,
  badges: [],
  user: {},
  loading: false
}

export const authReducer = (state = initialState, action) => {
  
  switch (action.type) {

    case types.LOADING_UI:
      return {
        ...state,
        loading: true
      }
    case types.CLEANUP:
      return initialState
    case 'LOGIN_SUCCESS': 
      return {
        ...state,
        authError: ''
      }
    case 'LOGIN_ERROR': 
      return {
        ...state,
        authError: 'Login failed'
      }
    case 'LOGOUT_SUCCESS':
      return state
    case 'REGISTER_ERROR':
      return {
        ...state,
        authError: action.payload.message
      }
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        authError: ''
      }
    case 'GET_CURRENT_USER':
      return {
        ...state,
        currentUser: action.payload
      }
    case 'VERIFY_ERROR':
      return {
        ...state,
        favoriteError: action.payload
      }
    case 'UPDATE_PROFILE_ERROR':
      return {
        ...state,
        updateProfileError: action.payload
    }
    case 'UPDATE_PROFILE_SUCCESS':
      return {
        ...state,
        updateProfileSuccess: action.payload
      }
    case 'IS_NIGHTMODE':
      return {
        ...state,
        isNightMode: action.payload
      }
    case 'GET_BADGES':
      return {
        ...state,
        badges: action.payload
      }
    case 'GET_USER':
      return {
        ...state,
        user: action.payload
      }
    default:
      return state
  }

}

export default authReducer