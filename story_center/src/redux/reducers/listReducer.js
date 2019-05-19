import types from "../types";

const initialState = {
  favorites: {
    stories: [],
    followings: [],
    characters: []
  },
  randomUsers: [],
  popularUsers: [],
}

export const listReducer = (state = initialState, action) => {
  
  switch (action.type) {

    case types.GET_RANDOM_USERS:
      return {
        ...state,
        randomUsers: action.payload
      }
    case types.GET_POPULAR_USERS:
      return {
        ...state,
        popularUsers: action.payload
      }
    case types.CLEANUP:
      return initialState
    default:
      return state
  }

}

export default listReducer