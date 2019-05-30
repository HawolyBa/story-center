import types from "../types";

const initialState = {
  loading: false,
  chapterLoading: false,
  latest: [],
  locations: [],
  charaByStory: [],
  locationDeleted: '',
  userCharacters: [],
  story: {
    title: '',
    locationsCount: 0,
    public: false,
    likesCount: 0,
    createdAt: '',
    authorName: '',
    authorId: '',
    summary: '',
    id: '',
    chapters: [],
    note: 0,
    tags: []
  },
  storyCharacters: [],
  chapter: {
    authorId: '',
    storyId: '',
    title: '',
    createdAt: '',
    body: '',
    number: '',
    note: 0,
    status: '',
    voters: [],
    votersCount: 0,
    locations: [],
    characters: []
  },
  verifyError: '',
  commentDeleted: '',
  storyId: '',
  storyEdited: '',
  storyLocations: [],
  chapterId:'',
  chapterEdited: '',
  userVote: {},
  newInfo: {},
  chapters: [],
  popularStories: [],
  popularTags: [],
  notFound: false,
  chapterNotFound: false,
  archives: [],
  banners: {
    photos: []
  },
  featuredStories: [],
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.LOADING_STORY:
      return {
        ...state,
        loading: true
      }
    case types.STORY_ADDED:
      return {
        ...state,
        loading: false
      }
    case types.GET_STORY:
      return {
        ...state,
        story: action.payload,
        loading: false,
        notFound: false
      }
    case types.GET_STORY_BANNER:
      return {
        ...state, 
        storyBanner: action.payload
      }
    case types.NOT_FOUND: 
      return {
        ...state,
        loading: false,
        notFound: true
      }
    case types.CHAPTER_NOT_FOUND:
      return {
        ...state,
        loading: false,
        chapterNotFound: true,
        chapterLoading: false,
      }
    case types.CHAPTER_DELETED:
      return {
        ...state,
        story: {
          ...state.story, chapters: state.story.chapters.filter(chap => chap.id !== action.payload)
        }
      }
    case types.CHAPTER_RATED:
      return {
        ...state,
        userVote: { note: action.payload.newRating, userId: action.payload.userId }
      }
    case types.LATEST_STORIES:
      return {
        ...state,
        latest: action.payload,
        loading: false
      }
    case types.LOADING_HOME:
      return {
        ...state,
        loading: true
      }
    case types.GET_ARCHIVES:
      return {
        ...state,
        archives: action.payload,
        loading: false
      }
    case types.GET_IMAGES:
      return {
        ...state,
        banners: action.payload
      }
    case types.CLEANUP:
      return initialState
    case 'ADD_STORY':
      return {
        ...state,
        storyId: action.payload
      }
    case types.GET_FEATURED_STORIES:
      return {
        ...state,
        featuredStories: action.payload
      }
    case 'ADD_CHAPTER':
      return {
        ...state,
        chapterId: action.payload
      }
    case 'EDIT_CHAPTER':
      return {
        ...state,
        chapterEdited: action.payload
      }
    case 'STORY_EDITED':
      return {
        ...state,
        storyEdited: action.payload
      }
    case types.CHAPTER_LOADING:
      return {
        ...state,
        chapterLoading: true
      }
    case types.GET_CHAPTER:
      return {
        ...state,
        chapter: action.payload,
        chapterLoading: false
      }
    case 'GET_CHARACTERS_IN_CHAPTER':
      return {
        ...state,
        charactersInChapter: action.payload
      }
    case 'GET_LOCATIONS_IN_CHAPTER':
      return {
        ...state,
        locationsInChapter: action.payload
      }
    case 'GET_USER_STORIES':
      return {
        ...state,
        userStories: action.payload,
        loaded: action.loaded
      }
    case 'GET_USER_CHARACTERS':
      return {
        ...state,
        userCharacters: action.payload.characters,
        charaByStory: action.payload.charaByStory
      }
    case 'GET_STORY_LOCATIONS':
      return {
        ...state,
        storyLocations: action.payload
      }
    case 'GET_CHARACTERS_FROM_STORY':
      return {
        ...state,
        storyCharacters: action.payload
      }
    case 'GET_CHAPTERS_FROM_STORY':
      return {
        ...state,
        chapters: action.payload
      }
    case 'LOCATION_DELETED':
      return {
        ...state,
        locationDeleted: action.payload
      }
    case 'VERIFY_ERROR':
      return {
        ...state,
        verifyError: action.payload
      }
    case 'COMMENT_DELETED':
      return {
        ...state,
        commentDeleted: action.payload
      }
    case 'GET_USER_VOTE':
      return {
        ...state,
        userVote: action.payload
      }
    case 'RATE_CHAPTER':
      return {
        ...state,
        newInfo: action.payload
      }
    case 'GET_STORY_RATING':
      return {
        ...state,
        storyRate: action.payload
      }
    case types.GET_POPULAR_STORIES:
      return {
        ...state,
        popularStories: action.payload
      }
    case 'GET_POPULAR_TAGS':
      return {
        ...state,
        popularTags: action.payload
      }
    
    default:
      return state
  }

}