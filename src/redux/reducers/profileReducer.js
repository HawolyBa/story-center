import types from '../types'

const initialState = {
  loading: false,
  user: {
    stories: [],
    characters: {
      charaByStory: [],
      allCharacters: []
    },
    locations: {
      allLocations: [],
      locByStory: []
    },
    favorites: {
      characters: [],
      followings: [],
      stories: []
    },
    followers: [],
  },
  notifications: [],
  users: [],
  followers: [],
  newImage: {}
}

export default function(state = initialState, action) {
  switch(action.type) {
    // case types.GET_USER:
    //   return {
    //     ...state,
    //     user: action.payload,
    //     loading: false
    //   }
    case types.IMAGE_CHANGED:
      return {
        ...state,
        newImage: action.payload
      }
    case types.LOADING_USER: 
      return {
        ...state,
        loading: true
      }
    case types.GET_STORIES:
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          stories: action.payload
        }
      }
    case types.GET_CHARACTERS:
      return {
        ...state,
        user: {
          ...state.user,
          characters: action.payload
        }
      }
    case types.GET_LOCATIONS:
      return {
        ...state,
        user: {
          ...state.user,
          locations: action.payload
        }
      }
    case types.LIKED:
      return {
        ...state,
        user: {
          ...state.user,
          followers: [...state.user.followers, action.payload.newFollower]
        }
      }
    case types.UNLIKED:
      return {
        ...state,
        user: {
          ...state.user,
          followers: state.user.followers.filter(f => f.id !== action.payload.id)
        }
      }
    case types.LOCATION_DELETED:
      return {
        ...state,
        user: {
          ...state.user,
          locations: {
            ...state.user.locations,
            allLocations: state.user.locations.allLocations.filter(loc => loc.id !== action.payload.id),
            locByStory: state.user.locations.locByStory.map(loc => {
              const newLocations = loc.locations.filter(loca => loca.id !== action.payload.id)
              return { ...loc, locations: newLocations }
            })
          }
        }
      }
    case types.GET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload
      }
    case types.GET_ARCHIVES_USERS:
      return {
        ...state,
        users: action.payload
      }
    case types.GET_FOLLOWERS:
      return {
        ...state,
        user: {
          ...state.user,
          followers: action.payload
        }
      }
    case types.GET_FOLLOWINGS:
      return {
        ...state,
        user: {
          ...state.user,
          favorites: {
            ...state.user.favorites,
            followings: action.payload
          }
        }
      }
    case types.GET_FAV_CHARACTERS:
      return {
        ...state,
        user: {
          ...state.user,
          favorites: {
            ...state.user.favorites,
            characters: action.payload
          }
        }
      }
    case types.GET_FAV_STORIES:
      return {
        ...state,
        user: {
          ...state.user,
          favorites: {
            ...state.user.favorites,
            stories: action.payload
          }
        }
      }
    case types.CLEANUP:
      return initialState
    default:
      return state
  }
}