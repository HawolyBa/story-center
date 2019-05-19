import types from '../types'

const initialState = {
  characterAdded: '',
  userCharacters: [],
  newId: '',
  character: {
    firstname: '',
    id: '',
    authorId: '',
    image: '',
    likedBy: [],
    likes: [],
    dislikes: [],
    public: true,
    likesCount: 0,
    relatives: [],
    stories: []
  },
  popularCharacters: [],
  charaByStory: [],
  loading: false,
  characters: [],
  notFound: false,
}

export const charactersReducer = (state = initialState, action) => {
  
  switch (action.type) {

    case types.GET_CHARACTER:
      return {
        ...state,
        character: action.payload,
        loading: false
      }
    case types.SET_ERRORS:
      return {
        ...state,
        loading: false
      }
    case types.CHARACTER_ADDED:
      return {
        ...state,
        loading: false
      }
    case types.LOADING_CHARACTER: 
      return {
        ...state,
        loading: true
      }  
    case types.NOT_FOUND: 
      return {
        loading: false,
        notFound: true
      }
    case types.LIKED:
      return {
        ...state,
        character: { ...state.character, likesCount: state.character.likesCount + 1 }
      }
    case types.UNLIKED:
      return {
        ...state,
        character: { ...state.character, likesCount: state.character.likesCount - 1 }
      }
    case types.GET_ARCHIVES_CHARACTERS:
      return {
        ...state,
        characters: action.payload
      }
    case types.CLEANUP:
      return initialState
    case 'CHARACTER_ADDED':
      return {
        ...state,
        characterAdded: action.payload.message,
        newId: action.payload.id
      }
    case types.GET_USER_CHARACTERS:
      return {
        ...state,
        userCharacters: action.payload.characters,
        charaByStory: action.payload.charaByStory
      }
    case 'GET_CHARACTER_STORIES':
      return {
        ...state,
        charaStories: action.payload
      }
    case 'GET_POPULAR_CHARACTERS':
      return {
        ...state,
        popularCharacters: action.payload
      }
    default:
      return state
  }

}

export default charactersReducer