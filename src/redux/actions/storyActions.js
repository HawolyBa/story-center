import { tagsTimes, onlyUnique, getOneFromCollection, getAllChapters, uniqueElementsBy, getOneChapter, reduceLocByStories } from './actionHelpers'
import { storage } from '../../config/fbConfig'
import { isPostValid } from '../validators'
import types from '../types'
import axios from 'axios'
import { pexelsAPI } from '../../config/keys'


export const addStory = (info, storyTitles, history) => (dispatch, getState, { getFirebase, getFirestore }) => {

  dispatch({ type: types.LOADING_UI })
  const imageName = info.title.toLowerCase().split(' ').join('_')
  const userId = getFirebase().auth().currentUser.uid
  const username = getState().firebase.profile.username

  const {valid, errors} = isPostValid(info, storyTitles)
  if (!valid) return dispatch({ type: types.SET_ERRORS, payload: errors })

  if (typeof info.banner === 'object') {
    storage
      .ref(`${userId}/${imageName}`)
      .put(info.banner)
      .then(() => {
        return storage.ref(userId).child(imageName).getDownloadURL()
      })
      .then(url => {
        return getFirestore().collection('stories').add({
          ...info,
          authorId: userId,
          authorName: username,
          status: 'In progress',
          banner: url,
          createdAt: new Date().toISOString(),
          likesCount: 0,
          chaptersCount: 0,
          locationsCount: 0,
          featured: false,
          note: 0
        })
      })
      .then(doc => { 
        dispatch({type: types.CLEAR_ERRORS })
        history.push(`/story/${doc.id}`)
      })
      .catch(err => dispatch({ type: types.STORY_ADDED, payload: {message: err.response.message, alert: 'danger'} }))
  } else {
    getFirestore()
      .collection('stories')
      .add({
        ...info,
        authorId: userId,
        authorName: username,
        status: 'In progress',
        createdAt: new Date().toISOString(),
        likesCount: 0,
        chaptersCount: 0,
        locationsCount: 0,
        featured: false,
        note: 0
      })
      .then(doc => { 
        dispatch({type: types.CLEAR_ERRORS })
        history.push(`/story/${doc.id}`)
      })
      .catch(err => dispatch({ type: types.STORY_ADDED, payload: {message: err.response.message, alert: 'danger'} }))
  }
  
}

export const editStory = (storyId, newInfo, storyTitles) => async (dispatch, getState, { getFirebase, getFirestore }) => {

  const {banner,...remain} = newInfo
  const imageName = remain.title.toLowerCase().split(' ').map(c => c.replace(/[^a-zA-Z ]/g, "")).join('_')
  const userId = getFirebase().auth().currentUser.uid
  const errors = {}

  if (!newInfo.title) errors.title = 'Must not be empty'
  if (newInfo.title && storyTitles.includes(newInfo.title)) errors.title = `You already have a story titled ${newInfo.title}`
  if (errors.title) return dispatch({ type: types.SET_ERRORS, payload: errors })

  if (typeof banner === 'object') {
    storage
      .ref(`${userId}/${imageName}`)
      .put(banner)
      .then(() => storage.ref(userId).child(imageName).getDownloadURL())
      .then(url => {
        return getFirestore().collection('stories').doc(storyId).update({
          ...remain,
          banner: url,
        })
      })
      .then(() => { 
        dispatch({type: types.CLEAR_ERRORS })
        dispatch({type: types.STORY_ADDED, payload: {message: 'Story edited successefully', alert: 'success'} })
      })
      .catch(err => dispatch({ type: types.STORY_ADDED, payload: {message: err.response.message, alert: 'danger'} }))
  } else {
    getFirestore().collection('stories').doc(storyId).update({
      ...newInfo,
    })
    .then(() => { 
      dispatch({ type: types.CLEAR_ERRORS })
      dispatch({type: types.STORY_ADDED, payload: {message: 'Story edited successefully', alert: 'success'} })
    })
    .catch(err => dispatch({ type: types.STORY_ADDED, payload: {message: err.response.message, alert: 'danger'} }))
  }
}

export const deleteStory = (storyId, history) => async (dispatch, getState, { getFirebase, getFirestore }) => {

  getFirestore().collection('stories').doc(storyId).delete()
    .then(() => history.push('/profile'))
    .catch(err => console.log(err))

}

export const getStory = id => (dispatch, getState, { getFirebase, getFirestore }) => {
  
  dispatch({ type: types.LOADING_STORY })

  let result = {}

  getFirestore().collection('stories').doc(id)
    .onSnapshot(doc => {
    if (!doc.exists) {
      return dispatch({ type: types.NOT_FOUND })
    }
    result = doc.data()
    result = {...result, id: doc.id}
    getFirestore().collection('chapters').where('storyId', '==', id).orderBy('number', 'asc')
      .onSnapshot(data => {
        let allCharacters = []
        result.chapters = []
        result.charactersCount = 0
        if (data.docs.length > 0) {
          data.forEach(doc => {
            allCharacters.push(doc.data().characters)
            result.chapters.push({
              id: doc.id,
              title: doc.data().title,
              number: doc.data().number,
              status: doc.data().status
            })
          })
        }
        
        allCharacters = [...new Set(allCharacters.flat())]
        result.charactersCount = allCharacters.length
        return dispatch({ type: types.GET_STORY, payload: result })
      })
  })
  
}

export const addChapter = (info, chapNumbers, titles, history) => async (dispatch, getState, { getFirebase, getFirestore }) => {

  const errors = {}
  if (!info.title) errors.title = "Must not be empty" 
  if (!info.number) errors.number = "Must not be empty" 
  if (info.number && Number(info.number) < 1) errors.number = "Number cannot be less than 1"
  if (info.number && chapNumbers.includes(info.number)) errors.number = `You already have a chapter number ${info.number}`
  if (info.title && titles.includes(info.title)) errors.title = `You already have a chapter titled ${info.title} for this story`

  if (errors.title || errors.number) return dispatch({ type: types.SET_ERRORS, payload: errors })

  getFirestore().collection('chapters').add({
    ...info,
    authorId: getFirebase().auth().currentUser.uid,
    authorName: getState().firebase.profile.username,
    note: 0,
    voters: [],
    votesCount: 0,
    commentsCount: 0,
    createdAt: new Date().toISOString()
  })
  .then(doc => {
    history.push(`/story/${info.storyId}/chapter/${doc.id}`)
  })
  .catch(err => console.log(err))

}

export const editChapter = (chapId, info, chapNumbers, titles) => (dispatch, getState, { getFirebase, getFirestore }) => {
  
  const errors = {}
  if (!info.title) errors.title = "Must not be empty"
  if (!info.number) errors.number = "Must not be empty"
  if (info.number && Number(info.number) < 1) errors.number = "Number cannot be less than 1"
  if (info.number && chapNumbers.includes(info.number)) errors.number = `You already have a chapter number ${info.number}`
  if (info.title && titles.includes(info.title)) errors.title = `You already have a chapter titled ${info.title} for this story`

  if (errors.title || errors.number) return dispatch({ type: types.SET_ERRORS, payload: errors })

  getFirestore()
    .collection('chapters')
    .doc(chapId)
    .update({ ...info })
    .then(() => {
      dispatch({ type: types.STORY_ADDED, payload: { message: 'Chapter edited successfully', alert: 'success' } })
      dispatch({ type: types.CLEAR_ERRORS })
    })
    .catch(err => console.log(err))
}

export const deleteChapter = (storyId, id, history) => async (dispatch, getState, { getFirebase, getFirestore }) => {
  dispatch({ type: types.LOADING_UI })
  getFirestore().collection('chapters').doc(id).delete()
    .then(() => dispatch({ type: types.CHAPTER_DELETED, payload: id }))
}

export const getChapter = (storyId, chapid) => async (dispatch, getState, { getFirebase, getFirestore }) => {

  dispatch({ type: types.CHAPTER_LOADING })
  const doc = await getOneFromCollection(getFirestore, 'chapters', chapid)
  if (!doc.exists) return dispatch({ type: types.CHAPTER_NOT_FOUND })

  let result = doc.data()
  result.id = doc.id

  let charaPromises = []
  let locPromises = []
  result.characters.forEach(chara => {
    charaPromises.push(getOneFromCollection(getFirestore, 'characters', chara))
  })
  result.locations.forEach(loc => {
    locPromises.push(getOneFromCollection(getFirestore, 'locations', loc))
  })

  const data = await Promise.all(charaPromises)
  result.characters = []
  data.forEach(doc => {
    result.characters.push({
      id: doc.id,
      firstname: doc.data().firstname,
      lastname: doc.data().lastname,
      image: doc.data().image,
      public: doc.data().public,
      authorId: doc.data().authorId,
    })
  })

  const locData = await Promise.all(locPromises)
  result.locations = []
  locData.forEach(doc => {
    result.locations.push({
      id: doc.id,
      name: doc.data().name,
      description: doc.data().description,
      image: doc.data().image,
      imageCopyright: doc.data().imageCopyright
    })
  })

  return dispatch({ type: types.GET_CHAPTER, payload: result })
}

export const getUserStories = id => async (dispatch, getState, { getFirebase, getFirestore }) => {

  const storiesQuery = await getFirestore().collection('stories').where('authorId', '==', id).get()

  const stories = storiesQuery.docs.map(async story => {

    const storyChapters = await getFirestore().collection('chapters').where('storyId', '==', story.id).get()
    const notedChapters = storyChapters.docs.filter(chap => chap.data().voters.length > 0)
    const note = storyChapters.docs.map(chap => chap.data().note).reduce((a, b) => a + b, 0) / notedChapters.length

    return {
      id: story.id,
      details: story.data(),
      chaptersNum: storyChapters.docs.length,
      characters: storyChapters.docs.map(chap => chap.data().characters).flat().filter(onlyUnique).length,
      note: !isNaN(note) ? note: 0
    }
  })

  Promise.all(stories).then(res => dispatch({ type: 'GET_USER_STORIES', payload: res, loaded: true }))
  
} 

export const getStoryLocations = (storyId) => async (dispatch, getState, { getFirebase, getFirestore }) => {

  let locations = []

  const userLocations = await getFirestore().collection('locations').where('storyId', '==', storyId).get()
  userLocations.docs.forEach(loc => locations = [...locations, {...loc.data(), id: loc.id}])
  return dispatch({ type: 'GET_STORY_LOCATIONS', payload: locations })
}

export const deleteLocation = id => async (dispatch, getState, { getFirebase, getFirestore }) => {

  getFirestore().collection('locations').doc(id).delete()
    .then(() => dispatch({type: types.LOCATION_DELETED, payload: {message: 'Location deleted successfully', alert: 'success', id: id}}))
}

export const getCharactersFromStory = id => async (dispatch, getState, { getFirebase, getFirestore }) => {

  const chaptersQuery = await getAllChapters(getFirestore, id)
  let characters = []
  
  chaptersQuery.docs.forEach(chap => {
    chap.data().characters.forEach(async chara => {
      const characterQuery = await getOneFromCollection(getFirestore, 'characters', chara)
      characters = [...characters, {id: chara, ...characterQuery.data()}]
      characters = uniqueElementsBy(characters, (a, b) => a.id === b.id)

      return dispatch({ type: 'GET_CHARACTERS_FROM_STORY', payload: characters })
    })
  })
}

export const getCharactersInChapter = (storyId, chapid) => async (dispatch, getState, { getFirebase, getFirestore }) => {

  let charactersInChapter = []
  const chapterQuery = await getOneChapter(getFirestore, storyId, chapid)
  const { characters } = chapterQuery.data() 

  characters.forEach(async chara => {
    const characterQuery = await getOneFromCollection(getFirestore, 'characters', chara)
    charactersInChapter = [...charactersInChapter, {
      image: characterQuery.data().image,
      id: chara,
      firstname: characterQuery.data().firstname,
      lastname: characterQuery.data().lastname,
      public: characterQuery.data().public
    }]

    return dispatch({ type: 'GET_CHARACTERS_IN_CHAPTER', payload: charactersInChapter })
  })
}

export const getLocationsInChapter = (storyId, chapid) => async (dispatch, getState, { getFirebase, getFirestore }) => {

  let locationsInChapter = []
  const locQuery = await getOneChapter(getFirestore, storyId, chapid)
  const { locations } = locQuery.data() || []

  locations.forEach(async loc => {
    const location = await getOneFromCollection(getFirestore, 'locations', loc)
    locationsInChapter = [...locationsInChapter, {...location.data(), id: loc }]
    return dispatch({ type: 'GET_LOCATIONS_IN_CHAPTER', payload: locationsInChapter })
  })

}

export const addLocation = (info, image) => async (dispatch, getState, { getFirebase, getFirestore }) => {

  dispatch({ type: types.LOADING_UI })
  const userId = getFirebase().auth().currentUser.uid
  const imageName = info.name.toLowerCase().split(' ').map(c => c.replace(/[^a-zA-Z ]/g, "")).join('_')

  if (!image) {

    getFirestore().collection('locations').add({
      ...info,
      image,
      authorId: userId,
      authorName: getState().firebase.profile.username,
      createdAt: new Date().toISOString()
    })
    .then(() => dispatch({type: types.LOCATION_ADDED, payload: { message: 'Location added successefully', alert: 'success'} }))
    .catch(err => console.log(err.code))
  } else {
    storage
      .ref(`${userId}/${imageName}`)
      .put(image)
      .then(() => storage.ref(userId).child(imageName).getDownloadURL())
      .then(url => {
        getFirestore().collection('locations').add({
          ...info,
          image: url,
          authorId: userId,
          authorName: getState().firebase.profile.username,
          createdAt: new Date().toISOString() 
        })
      })
      .then(() => dispatch({type: types.LOCATION_ADDED, payload: { message: 'Location added successefully', alert: 'success'} }))
      .catch(err => console.log(err))
  }
}

export const submitComment = info => async (dispatch, getState, { getFirebase, getFirestore }) => {

  if (!getFirebase().auth().currentUser.emailVerified) return dispatch({ type: types.COMMENT_POSTED , payload: {message: 'You need to verify your email first', alert: 'danger'} })

  if (!info.content) return dispatch({ type: types.COMMENT_POSTED , payload: {message: 'Content must not be empty', alert: 'danger'} })

    getFirestore().collection('comments').add({
      content: info.content,
      storyId: info.storyId,
      chapterId: info.chapterId,
      userId: getFirebase().auth().currentUser.uid,
      username: getState().firebase.profile.username,
      answer: false,
      authorId: info.authorId,
      createdAt: new Date().toISOString()
    })
    .then(() => dispatch({ type: types.COMMENT_POSTED, payload: { message: 'Comment posted successfully', alert: 'success' } }))
    .catch(err => dispatch({ type: types.COMMENT_POSTED, payload: { message: 'There was a problem', alert: 'danger' } }))
  
}

export const submitAnswer = info => async (dispatch, getState, { getFirebase, getFirestore }) => {

  if (!getFirebase().auth().currentUser.emailVerified) return dispatch({ type: types.COMMENT_POSTED , payload: {message: 'You need to verify your email first', alert: 'danger'} })

  if (!info.content) return dispatch({ type: types.COMMENT_POSTED , payload: {message: 'Content must not be empty', alert: 'danger'} })

  getFirestore().collection('comments')
    .add({ 
      commentAnsweredId: info.commentAnsweredId,
      content: info.content,
      storyId: info.storyId,
      chapterId: info.chapterId,
      userId: getFirebase().auth().currentUser.uid,
      username: getState().firebase.profile.username,
      answer: true,
      authorId: info.authorId,
      answeredTo: info.answeredTo,
      answeredToId: info.answeredToId,
      createdAt: new Date().toISOString()
    })
    .then(() => dispatch({ type: types.COMMENT_POSTED, payload: { message: 'Answer posted successfully', alert: 'success' } }))
    .catch(err => dispatch({ type: types.COMMENT_POSTED, payload: { message: 'There was a problem', alert: 'danger' } }))
  
}

export const deleteComment = id => async (dispatch, getState, { getFirebase, getFirestore }) => {

  await getFirestore().collection('comments').doc(id).delete()
  return dispatch({ type: 'COMMENT_DELETED', payload: 'Comment deleted' })
}

export const getUserVote = (id, chapid) => (dispatch, getState, { getFirebase, getFirestore }) => {

  getFirestore().collection('chapters').doc(chapid)
    .onSnapshot(doc => {
      if (doc.exists) {
        const userVote = doc.data().voters.find(vote => vote.userId === getFirebase().auth().currentUser.uid)
        return dispatch({ type: 'GET_USER_VOTE', payload: userVote })
      }
    })
}

export const rateChapter = (chapid, newRating) => async (dispatch, getState, { getFirebase, getFirestore }) => {

  if (getFirebase().auth().currentUser.emailVerified){

    const userId = getFirebase().auth().currentUser.uid

    getFirestore().collection('chapters').doc(chapid).get()
      .then(doc => {
        const authorId = doc.data().authorId
        const userVote = doc.data().voters.some(voter => voter.userId === userId)
        if (!userVote && authorId !== userId) {
          const voters = doc.data().voters
          const allIds = voters.map(vote => vote.userId)
          if (allIds.includes(userId)) return dispatch({ type: types.CHAPTER_RATED, payload: { message: 'You already voted for this chapter', alert: 'danger'} })
          const total = voters.reduce((a, b) => a + b.note, newRating)
          const newNote = voters.length > 0 ? total / (voters.length + 1) : newRating
          return getFirestore().collection('chapters').doc(chapid).update({ voters: [...voters, { userId: userId, note: newRating }], note: newNote, votesCount: doc.data().votesCount + 1 })
        }
      })
      .then(() => dispatch({ type: types.CHAPTER_RATED, payload: { message: 'Chapter rated successfully', alert: 'success', userId, newRating } }))
      .catch(err => dispatch({ type: types.CHAPTER_RATED, payload: { message: 'There was a problem', alert: 'danger' } }))

  } else {
    dispatch({ type: types.VERIFY_EMAIL, payload: { message: 'You need to verify your email first', alert: 'danger' } })
  }
}

export const getStoryRating = storyId => async (dispatch, getState, { getFirebase, getFirestore }) => {

  let notes = []
  let note = 0
  let allNotes = 0
  const chaptersQuery = await getAllChapters(getFirestore, storyId)
  
  chaptersQuery.docs.forEach(chap => {
    notes = [...notes, chap.data().note]
    if (chap.data().voters.length > 0) allNotes++
    note = allNotes > 1 ? notes.reduce((a, b) => a + b, 0) / allNotes: 0
    return dispatch({ type: 'GET_STORY_RATING', payload: note })
  })
}

export const getPopularStories = () => async (dispatch, getState, { getFirebase, getFirestore }) => {

  dispatch({ type: types.LOADING_HOME })

  getFirestore()
    .collection('stories')
    .where('public', '==', true)
    .orderBy('note', 'desc')
    .get()
    .then(data => {
      let result = []
      data.forEach(doc => {
        result.push({
          title: doc.data().title,
          banner: doc.data().banner,
          authorName: doc.data().authorName,
          likesCount: doc.data().likesCount,
          id: doc.id,
          chaptersCount: doc.data().chaptersCount,
          note: doc.data().note
        })
      })
      return dispatch({ type: types.GET_POPULAR_STORIES, payload: result })
    })

  // const publicStories = await getFirestore().collection('stories').where('public', '==', true).get()

  // const storiesArr = publicStories && publicStories.docs.map(async story => {
    
  //   const storyChapters = await getFirestore().collection('chapters').where('storyId', '==', story.id).get()
  //   const notedChapters = storyChapters.docs.filter(chap => chap.data().voters.length > 0)
  //   const note = storyChapters.docs.map(chap => chap.data().note).reduce((a, b) => a + b, 0) / notedChapters.length

  //   return  {
  //     title: story.data().title,
  //     banner: story.data().banner,
  //     authorName: story.data().authorName,
  //     likesCount: story.data().likesCount,
  //     id: story.id,
  //     chapertsNum: storyChapters.docs.length,
  //     characters: storyChapters.docs.map(chap => chap.data().characters).flat().filter(onlyUnique).length,
  //     note: !isNaN(note) ? note: 0
  //   }

  // })

  // Promise.all(storiesArr).then(res =>  dispatch({ type: types.GET_POPULAR_STORIES, payload: res.sort((a, b) => b.note - a.note).slice(0, 10) }))
}

export const getPopularTags = () => async (dispatch, getState, { getFirebase, getFirestore }) => {

  const storiesQuery = await getFirestore().collection('stories').where('public', '==', true).get()
  const popularTags = storiesQuery.docs.map(story => story.data().tags).flat()
  const tab = tagsTimes(popularTags).sort((a, b) => b.times - a.times ).slice(0, 10)
  return dispatch({ type:'GET_POPULAR_TAGS', payload: tab })
}

export const getUserLocations = id => async (dispatch, getState, { getFirebase, getFirestore }) => {
  
  const storiesQuery = await getFirestore().collection('stories').where('authorId', '==', id).get()
  const locationsQuery = await getFirestore().collection('locations').where('authorId', '==', id).get()
  const locations = locationsQuery.docs.map(loc => ({...loc.data(), id: loc.id}))

  const locByStory = storiesQuery.docs.map(async story => {
    const storyChapters = await getFirestore().collection('chapters').where('storyId', '==', story.id).get()
    const locationsId = storyChapters.docs.map(chap => chap.data().locations).flat()
    const locations = locationsId.map(async loc => {
      const location = await getOneFromCollection(getFirestore, 'locations', loc)
      return { ...location.data(), id: location.id }
    })

    return Promise.all(locations).then(res => ({
      id: story.id,
      title: story.data().title,
      locations: res
    }))
  })

  Promise.all(locByStory).then(res => dispatch({ type: 'GET_USER_LOCATIONS', payload: {locations, locByStory: res}, }))

} 

export const getLatestStories = () => (dispatch, getState, { getFirebase, getFirestore }) => {
  let result = []

  getFirestore().collection('stories').where('public', '==', true).orderBy('createdAt', 'desc').limit(10).get()
    .then(data => {
      data.forEach(doc => {
        result.push({
          id: doc.id,
          banner: doc.data().banner,
          likesCount: doc.data().likesCount,
          title: doc.data().title,
          note: doc.data().note,
          authorName: doc.data().authorName
        })
      })
      return dispatch({ type: types.LATEST_STORIES, payload: result })
    })
}

export const getArchiveStories = () => (dispatch, getState, { getFirebase, getFirestore }) => {

  dispatch({ type: types.LOADING_STORY })

  let result = []
  getFirestore().collection('stories').where('public', '==', true).get()
    .then(data => {
      let storyPromises = []
      data.forEach(doc => {
        result.push({...doc.data(), id: doc.id})
      })
      result.forEach(story => {
        storyPromises.push(getFirestore().collection('chapters').where('storyId', '==', story.id).get())
      })
      return Promise.all(storyPromises)
    })
    .then(docs => {
      docs.forEach((doc, i) => {
        result[i].charactersCount = 0
        let allCharacters = []
        const notedChapters = doc.docs.filter(chap => chap.data().voters.length > 0)
        result[i].note = doc.docs.map(chap => chap.data().note).reduce((a, b) => a + b, 0) / notedChapters.length || 0
        doc.forEach((a, j) => {
          allCharacters.push(a.data().characters)
        })
        
        allCharacters = [...new Set(allCharacters.flat())]
        result[i].charactersCount = allCharacters.length
      })
      return dispatch({ type: types.GET_ARCHIVES, payload: result })
    })
}

export const getStoriesByCategory = cat => (dispatch, getState, { getFirebase, getFirestore }) => {

  dispatch({ type: types.LOADING_STORY })

  let result = []
  getFirestore().collection('stories').where('public', '==', true).where('category', '==', cat).get()
    .then(data => {
      let storyPromises = []
      data.forEach(doc => {
        result.push({...doc.data(), id: doc.id})
      })
      result.forEach(story => {
        storyPromises.push(getFirestore().collection('chapters').where('storyId', '==', story.id).get())
      })
      return Promise.all(storyPromises)
    })
    .then(docs => {
      docs.forEach((doc, i) => {
        result[i].charactersCount = 0
        let allCharacters = []
        const notedChapters = doc.docs.filter(chap => chap.data().voters.length > 0)
        result[i].note = doc.docs.map(chap => chap.data().note).reduce((a, b) => a + b, 0) / notedChapters.length || 0
        doc.forEach((a, j) => {
          allCharacters.push(a.data().characters)
        })
        allCharacters = [...new Set(allCharacters.flat())]
        result.charactersCount = allCharacters.length
      })
      return dispatch({ type: types.GET_ARCHIVES, payload: result })
    })
}

export const getStoriesByTag = tag => (dispatch, getState, { getFirebase, getFirestore }) => {

    dispatch({ type: types.LOADING_STORY })
  
    let result = []
    getFirestore().collection('stories').where('public', '==', true).where('tags', 'array-contains', tag).get()
      .then(data => {
        let storyPromises = []
        data.forEach(doc => {
          result.push({...doc.data(), id: doc.id})
        })
        result.forEach(story => {
          storyPromises.push(getFirestore().collection('chapters').where('storyId', '==', story.id).get())
        })
        return Promise.all(storyPromises)
      })
      .then(docs => {
        docs.forEach((doc, i) => {
          result[i].charactersCount = 0
          let allCharacters = []
          const notedChapters = doc.docs.filter(chap => chap.data().voters.length > 0)
          result[i].note = doc.docs.map(chap => chap.data().note).reduce((a, b) => a + b, 0) / notedChapters.length || 0
          doc.forEach((a, j) => {
            allCharacters.push(a.data().characters)
          })
          allCharacters = [...new Set(allCharacters.flat())]
          result.charactersCount = allCharacters.length
        })
        return dispatch({ type: types.GET_ARCHIVES, payload: result })
      })
}

export const getStoriesBySearch = search => (dispatch, getState, { getFirebase, getFirestore }) => {

  dispatch({ type: types.LOADING_STORY })

  let result = []
  getFirestore().collection('stories').where('public', '==', true).get()
    .then(data => {
      let storyPromises = []
      data.forEach(doc => {
        const title = doc.data().title.toLowerCase().split(' ')
        const authorName = doc.data().authorName.toLowerCase().split(' ')
        const searchTerm = search.split('-')
        const isIncluded = searchTerm.every(word => title.includes(word))
        const orIncluded = searchTerm.some(word => doc.data().title.toLowerCase().indexOf(word) !== -1)
        const authorIncluded = searchTerm.every(word => authorName.includes(word))
        const orAuthorIncluded = searchTerm.some(word => doc.data().authorName.toLowerCase().indexOf(word) !== -1)
        if (isIncluded || orIncluded || authorIncluded || orAuthorIncluded) {
          result.push({...doc.data(), id: doc.id})
        }
      })
      result.forEach(story => {
        storyPromises.push(getFirestore().collection('chapters').where('storyId', '==', story.id).get())
      })
      return Promise.all(storyPromises)
    })
    .then(docs => {
      docs.forEach((doc, i) => {
        result[i].charactersCount = 0
        let allCharacters = []
        const notedChapters = doc.docs.filter(chap => chap.data().voters.length > 0)
        result[i].note = doc.docs.map(chap => chap.data().note).reduce((a, b) => a + b, 0) / notedChapters.length || 0
        doc.forEach((a, j) => {
          allCharacters.push(a.data().characters)
        })
        allCharacters = [...new Set(allCharacters.flat())]
        result.charactersCount = allCharacters.length
      })
      return dispatch({ type: types.GET_ARCHIVES, payload: result })
    })
}

export const searchImages = image => dispatch => {
  dispatch({ type: types.LOADING_IMAGE })
  axios.get(`https://api.pexels.com/v1/search?query=${image}&per_page=12&page=1`, {
    headers: {
      Authorization: pexelsAPI
    }
  })
    .then(res => dispatch({ type: types.GET_IMAGES, payload: res.data }))
    .catch(err => console.log(err))
}

export const nextpage = url => dispatch => {
  dispatch({ type: types.LOADING_IMAGE })
  axios.get(url, {
    headers: {
      Authorization: pexelsAPI
    }
  })
    .then(res => dispatch({ type: types.GET_IMAGES, payload: res.data }))
    .catch(err => console.log(err))
}

export const cleanup = () => dispatch => {
  return dispatch({ type: types.CLEANUP })
}

export const getFeaturedStories = () => (dispatch, getState, { getFirebase, getFirestore }) => {

  let result = []

  getFirestore().collection('stories').where('featured', '==', true).where('public', '==', true).orderBy('createdAt', 'desc').limit(5).get()
    .then(data => {
      data.forEach(doc => {
        result.push({
          id: doc.id,
          title: doc.data().title,
          banner: doc.data().banner,
        })
      })
      return dispatch({ type: types.GET_FEATURED_STORIES, payload: result })
    })
}

export const getPrivateStories = () => (dispatch, getState, { getFirebase, getFirestore }) => {
  dispatch({ type: types.LOADING_USER })
  let result = []

  getFirestore().collection('stories').where('authorId', '==', getFirebase().auth().currentUser.uid).orderBy('createdAt', 'desc').get()
    .then(data => {
      data.forEach(doc => {
        result.push({
          id: doc.id,
          banner: doc.data().banner,
          title: doc.data().title,
          likesCount: doc.data().likesCount,
          public: doc.data().public,
          note: doc.data().note,
          authorId: doc.data().authorId
        })
      })
      return dispatch({ type: types.GET_STORIES, payload: result })
    })
}

export const getPublicStories = (id) => (dispatch, getState, { getFirebase, getFirestore }) => {

  dispatch({ type: types.LOADING_USER })
  let result = []

  getFirestore().collection('stories').where('authorId', '==', id).where('public', '==', true).orderBy('createdAt', 'desc').get()
    .then(data => {
      data.forEach(doc => {
        result.push({
          id: doc.id,
          banner: doc.data().banner,
          title: doc.data().title,
          likesCount: doc.data().likesCount,
          note: doc.data().note
        })
      })
      return dispatch({ type: types.GET_STORIES, payload: result })
    })
}

export const getPrivateLocations = () => (dispatch, getState, { getFirebase, getFirestore }) => {
  let result = {}
  let locFromChapters = []
  const userId = getFirebase().auth().currentUser.uid

  getFirestore().collection('chapters').where('authorId', '==', userId).get()
    .then(data => {
      let storiesPromises = []
      data.forEach(doc => {
        locFromChapters.push({ locations: doc.data().locations, id: doc.data().storyId })
      })
      locFromChapters = reduceLocByStories(locFromChapters.filter(doc => doc.locations.length > 0))

      locFromChapters.forEach(doc => {
        storiesPromises.push(getFirestore().collection('stories').doc(doc.id).get())
      })

      return Promise.all(storiesPromises)
    })
    .then(data => {
      locFromChapters = locFromChapters.map(story => ({ ...story, id: story.id, title: data.find(doc => doc.id === story.id).data().title, locations: [...new Set(story.locations.flat(Infinity))] }))
      return getFirestore().collection('locations').where('authorId', '==', userId).orderBy('createdAt', 'desc').get()
    })
    .then(data => {
      result.allLocations = []
      data.forEach(doc => {
        result.allLocations.push({
          id: doc.id,
          image: doc.data().image,
          name: doc.data().name,
          description: doc.data().description,
          imageCopyright: doc.data().imageCopyright
        })
      })
      
      result.locByStory = locFromChapters.map(story => ({
        ...story, locations: story.locations.map(loc => ({
          id: loc,
          image: result.allLocations.find(doc => doc.id === loc).image,
          name: result.allLocations.find(doc => doc.id === loc).name,
          description: result.allLocations.find(doc => doc.id === loc).description,
          imageCopyright: result.allLocations.find(doc => doc.id === loc).imageCopyright
        }))
      }))
      
      return dispatch({ type: types.GET_LOCATIONS, payload: result })
    })
}

export const getPublicLocations = id => (dispatch, getState, { getFirebase, getFirestore }) => {
  let result = {}
  let locFromChapters = []

  getFirestore().collection('chapters').where('authorId', '==', id).get()
    .then(data => {
      let storiesPromises = []
      data.forEach(doc => {
        locFromChapters.push({ locations: doc.data().locations, id: doc.data().storyId })
      })
      locFromChapters = reduceLocByStories(locFromChapters.filter(doc => doc.locations.length > 0))

      locFromChapters.forEach(doc => {
        storiesPromises.push(getFirestore().collection('stories').doc(doc.id).get())
      })

      return Promise.all(storiesPromises)
    })
    .then(data => {
      locFromChapters = locFromChapters.map(story => ({ ...story, id: story.id, title: data.find(doc => doc.id === story.id).data().title, public: data.find(doc => doc.id === story.id).data().public })).filter(story => story.public)
      
      let locPromises = []
      let allLocations = []
      locFromChapters.forEach(doc => allLocations.push((doc.locations)) )
      allLocations = [...new Set(allLocations.flat(2))]
      allLocations.forEach(doc => locPromises.push(getFirestore().collection('locations').doc(doc).get()))
      return Promise.all(locPromises)
    })
    .then(data => {
      result.allLocations = []
      data.forEach(doc => {
        result.allLocations.push({
          id: doc.id,
          name: doc.data().name,
          description: doc.data().description,
          image: doc.data().image,
          createdAt: doc.data().createdAt,
          imageCopyright: doc.data().imageCopyright
        })
      })

      result.locByStory = locFromChapters.map(story => ({
        ...story, locations: story.locations.map(loc => {
          if (result.allLocations.find(doc => doc.id === loc)) {
            return {
              id: loc,
              name: result.allLocations.find(doc => doc.id === loc).name,
              description: result.allLocations.find(doc => doc.id === loc).description,
              image: result.allLocations.find(doc => doc.id === loc).image,
              createdAt: result.allLocations.find(doc => doc.id === loc).createdAt,
              imageCopyright: result.allLocations.find(doc => doc.id === loc).imageCopyright
            }
          } else return null
        })
      })).map(story => ({...story, locations: story.locations.filter(loc => loc)}))
      return dispatch({ type: types.GET_LOCATIONS, payload: result })
    })
}

export const getFavoriteStories = id => (dispatch, getState, { getFirebase, getFirestore }) => {

  const userId = id || getFirebase().auth().currentUser.uid

  getFirestore().collection('storiesLikes').where('senderId', '==', userId).get()
    .then(data => {
      let storiesLikespromises = []
      data.forEach(doc => storiesLikespromises.push(getFirestore().collection('stories').doc(doc.data().storyId).get()))
      return Promise.all(storiesLikespromises)
    })
    .then(data => {
      let stories = []
      data.forEach(doc => {
        if (doc.exists && ((doc.data().public) || (!id && doc.data().authorId === getFirebase().auth().currentUser.uid))) {
          stories.push({
            title: doc.data().title,
            authorName: doc.data().authorName,
            authorId: doc.data().authorId,
            id: doc.id
          })
        }
      })
      return dispatch({ type: types.GET_FAV_STORIES, payload: stories })
    })
}