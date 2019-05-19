import { reduceCharactersByStories, getOneFromCollection, reduceChapters } from './actionHelpers'

import { storage } from '../../config/fbConfig'
import types from '../types'

export const addCharacter = (character, history) => (dispatch, getState, { getFirebase, getFirestore }) => {

  const { image,...remain } = character
  const username = getState().firebase.profile.username
  const userId = getState().firebase.auth.uid
  const errors = {}

  dispatch({ type: types.LOADING_CHARACTER })

  if (!character.firstname) errors.firstname = 'Must not be empty' 
  if (!character.imageCopyright && character.image) errors.imageCopyright = 'Must not be empty'

  if (errors.firstname || errors.imageCopyright) return dispatch({ type: types.SET_ERRORS, payload: errors })

  if ( typeof image !== 'object' ) {
    getFirestore().collection('characters').add({
      ...remain,
      image,
      likesCount: 0,
      authorId: userId,
      authorName: username,
      createdAt: new Date().toISOString()
    })
    .then(docRef => { 
      dispatch({type: types.CHARACTER_ADDED, payload: {id: docRef.id, message: 'Character added successefully', alert: 'success'} })
      history.push(`/character/edit/${docRef.id}`)
    })
    .catch(err => dispatch({ type: types.CHARACTER_ADDED, payload: {message: err.response.message, alert: 'danger'} }))
  } else {
    storage
      .ref(`${userId}/${image.name}`)
      .put(image)
      .then(() => {
        return storage.ref(userId).child(image.name).getDownloadURL()
      })
      .then(url => {
        return getFirestore().collection('characters').add({
          ...remain,
          image: url,
          authorId: userId,
          likesCount: 0,
          authorName: username,
          createdAt: new Date().toISOString()
        })
      })
      .then(docRef => {
        dispatch({
          type: types.CHARACTER_ADDED, 
          payload: {id: docRef.id, message: 'Character added successfully', alert: 'success'} 
        })
        history.push(`/character/edit/${docRef.id}`)
      })
      .catch(err => dispatch({ type: types.CHARACTER_ADDED, payload: {message: err.response.message, alert: 'danger'} }))
  }

}

export const updateCharacter = (id, newInfo) => (dispatch, getState, { getFirebase, getFirestore }) => {
  dispatch({ type: types.LOADING_UI })

  const { image,...remain } = newInfo
  const userId = getState().firebase.auth.uid
  const errors = {}

  if (!newInfo.firstname) errors.firstname = 'Must not be empty'
  if (!newInfo.imageCopyright && newInfo.image) errors.imageCopyright = 'Must not be empty'

  if (errors.firstname || errors.imageCopyright) return dispatch({ type: types.SET_ERRORS, payload: errors })

  if (image === null) {
    getFirestore()
      .collection('characters')
      .doc(id)
      .update({
        ...remain
      })
    .then(() => {
      return dispatch({type: types.CHARACTER_ADDED, payload: { message: 'Character edited successefully', alert: 'success'}} )
    })
    .catch(err => dispatch({ type: types.CHARACTER_ADDED, payload: {message: err.response.message, alert: 'danger'} }))
  } else {
    storage
      .ref(`${userId}/${image.name}`)
      .put(image)
      .then(() => {
        return storage.ref(userId).child(image.name).getDownloadURL()
      })
      .then(url => {
        return getFirestore().collection('characters').doc(id).update({
          ...remain,
          image: url
        })
      })
      .then(() => dispatch({type: types.CHARACTER_ADDED, payload: { message: 'Character edited successefully', alert: 'success'}} ))
      .catch(err => dispatch({ type: types.CHARACTER_ADDED, payload: {message: err.response.message, alert: 'danger'} }))
  }
}

export const deleteRelation = (id, relationId, relatives) => (dispatch, getState, { getFirebase, getFirestore }) => {
  const characters = relatives.filter(rel => rel !== relatives[relationId])
  getFirestore().collection('characters').doc(id).update({
     relatives: characters
   }).then(() => dispatch({type: 'DELETE_RELATION', payload: characters }))
}

export const getCharacter = id => async (dispatch, getState, { getFirebase, getFirestore }) => {
  dispatch({ type: types.LOADING_CHARACTER })

  let result = {}
  getOneFromCollection(getFirestore, 'characters', id)
    .then(doc => {
      if (!doc.exists) return dispatch({ type: types.NOT_FOUND })
      result = doc.data()
      result.id = doc.id

      return getFirestore().collection('chapters').where('characters', 'array-contains', id).get()
    })
    .then(data => {
      let stories = []
      let storiesPromises = []
      data.forEach(doc => {
        stories.push({
          id: doc.id,
          title: doc.data().title,
          storyId: doc.data().storyId
        })
      })

      result.stories = reduceChapters(stories)
      
      result.stories.forEach((story, i) => {
        storiesPromises.push(getOneFromCollection(getFirestore, 'stories', story.storyId))
      })

      return Promise.all(storiesPromises)
    })
    .then(docs => {
      docs.forEach((story, i) => {
        result.stories[i].id = story.id
        result.stories[i].title = story.data().title
        result.stories[i].status = story.data().status
      })

      let relPromises = []
      result.relatives.forEach((rel, i) => {
        relPromises.push(getOneFromCollection(getFirestore, 'characters', rel.character_id)) 
      })
      
      return Promise.all(relPromises)
    })
    .then(docs => {
      docs.forEach((rel, i) => {
        result.relatives[i].firstname = rel.data().firstname
        result.relatives[i].lastname = rel.data().lastname
        result.relatives[i].image = rel.data().image
        result.relatives[i].authorId = rel.data().authorId
        result.relatives[i].public = rel.data().public
      })
      return dispatch({type: types.GET_CHARACTER, payload: result})
    })
    .catch(err => console.error(err))

}

export const getPopularCharacters = () => (dispatch, getState, { getFirebase, getFirestore }) => {

  let characters = []

  getFirestore().collection('characters').where('public', '==', true).orderBy('likesCount', 'desc').limit(10).get()
    .then(data => {
      data.forEach((chara, i) => {
        characters.push({
          id: chara.id,
          firstname: chara.data().firstname,
          lastname: chara.data().lastname,
          image: chara.data().image,
          authorName: chara.data().authorName,
          likesCount: chara.data().likesCount
        })  
      })
      return dispatch({ type: 'GET_POPULAR_CHARACTERS', payload: characters })
    })
}

export const getUserCharacters = id => async (dispatch, getState, { getFirebase, getFirestore }) => {

  const storiesQuery = await getFirestore().collection('stories').where('authorId', '==', id).get()
  const charactersQuery = await getFirestore().collection('characters').where('authorId', '==', id).get()
  const characters = charactersQuery.docs.map(chara => ({...chara.data(), id: chara.id}))

  const stories = storiesQuery.docs.map(async story => {
    const storyChapters = await getFirestore().collection('chapters').where('storyId', '==', story.id).get()
    const charactersId = storyChapters.docs.map(chap => chap.data().characters).flat()
    const characters = charactersId.map(async chara => {
      const character = await getOneFromCollection(getFirestore, 'characters', chara)
      return {...character.data(), id: character.id}
    })

    return Promise.all(characters).then(res => ({
      id: story.id,
      title: story.data().title,
      characters: res
    }))
  })

  Promise.all(stories).then(res => dispatch({ type: types.GET_USER_CHARACTERS, payload: {characters, charaByStory: res}, }))
}

export const deleteCharacter = (id, history) => async (dispatch, getState, { getFirebase, getFirestore }) => {

  getFirestore().collection('characters').doc(id).delete()
    .then(() => history.push('/profile'))
}

export const getCharactersBySearch = search => (dispatch, getState, { getFirebase, getFirestore }) => {

  dispatch({ type: types.LOADING_CHARACTER })

  let result = []
  getFirestore().collection('characters').where('public', '==', true).get()
    .then(data => {
      data.forEach(doc => {
        const firstname = doc.data().firstname.toLowerCase()
        const lastname = doc.data().lastname.toLowerCase()
        const authorName = doc.data().authorName.toLowerCase().split(' ')
        const searchTerm = search.split('-')
        const firstnameIncluded = searchTerm.some(word => firstname.indexOf(word) !== -1 )
        const lastnameIncluded = searchTerm.some(word => lastname.indexOf(word) !== -1)
        const authorIncluded = searchTerm.every(word => authorName.includes(word))
        const orAuthorIncluded = searchTerm.some(word => doc.data().authorName.toLowerCase().indexOf(word) !== -1)
        if (firstnameIncluded || lastnameIncluded || authorIncluded || orAuthorIncluded) {
          result.push({...doc.data(), id: doc.id})
        }
      })
      return dispatch({ type: types.GET_ARCHIVES_CHARACTERS, payload: result })
    })    
}

export const getPrivateCharacters = () => (dispatch, getState, { getFirebase, getFirestore }) => {
  let result = {}
  let charaFromChapters = []
  const userId = getFirebase().auth().currentUser.uid

  getFirestore().collection('chapters').where('authorId', '==', userId).get()
    .then(data => {
      let storiesPromises = []
      data.forEach(doc => {
        charaFromChapters.push({ characters: doc.data().characters, id: doc.data().storyId })
      })
      charaFromChapters = reduceCharactersByStories(charaFromChapters.filter(doc => doc.characters.length > 0))

      charaFromChapters.forEach(doc => {
        storiesPromises.push(getFirestore().collection('stories').doc(doc.id).get())
      })

      return Promise.all(storiesPromises)
    })
    .then(data => {
      charaFromChapters = charaFromChapters.map(story => ({ ...story, id: story.id, title: data.find(doc => doc.id === story.id).data().title, characters: story.characters.flat(Infinity) }))
      return getFirestore().collection('characters').where('authorId', '==', userId).orderBy('createdAt', 'desc').get()
    })
    .then(data => {
      result.allCharacters = []
      data.forEach(doc => {
        result.allCharacters.push({
          id: doc.id,
          firstname: doc.data().firstname,
          lastname: doc.data().lastname,
          likesCount: doc.data().likesCount,
          image: doc.data().image,
          public: doc.data().public
        })
      })
      result.charaByStory = charaFromChapters.map(story => ({ ...story, characters: story.characters.map(chara => ({ 
          id: chara,
          firstname: result.allCharacters.find(doc => doc.id === chara).firstname,
          lastname: result.allCharacters.find(doc => doc.id === chara).lastname,
          likesCount: result.allCharacters.find(doc => doc.id === chara).likesCount,
          image: result.allCharacters.find(doc => doc.id === chara).image,
          public: result.allCharacters.find(doc => doc.id === chara).public
        })) 
      }))
      
      return dispatch({ type: types.GET_CHARACTERS, payload: result })
    })
}

export const getPublicCharacters = id => (dispatch, getState, { getFirebase, getFirestore }) => {
  let result = {}
  let charaFromChapters = []

  getFirestore().collection('chapters').where('authorId', '==', id).get()
    .then(data => {
      let storiesPromises = []
      data.forEach(doc => {
        charaFromChapters.push({ characters: doc.data().characters, id: doc.data().storyId })
      })
      charaFromChapters = reduceCharactersByStories(charaFromChapters.filter(doc => doc.characters.length > 0))

      charaFromChapters.forEach(doc => {
        storiesPromises.push(getFirestore().collection('stories').doc(doc.id).get())
      })

      return Promise.all(storiesPromises)
    })
    .then(data => {
      charaFromChapters = charaFromChapters.map(story => ({ ...story, id: story.id, title: data.find(doc => doc.id === story.id).data().title, public: data.find(doc => doc.id === story.id).data().public }))
      return getFirestore().collection('characters').where('authorId', '==', id).where('public', '==', true).orderBy('createdAt', 'desc').get()
    })
    .then(data => {
      result.allCharacters = []
      data.forEach(doc => {
        result.allCharacters.push({
          id: doc.id,
          firstname: doc.data().firstname,
          lastname: doc.data().lastname,
          likesCount: doc.data().likesCount,
          image: doc.data().image,
          public: doc.data().public
        })
      })

      result.charaByStory = charaFromChapters.map(story => ({
        ...story, characters: story.characters.map(chara => {
          if (result.allCharacters.find(doc => doc.id === chara)) {
          return {
            id: chara,
            firstname: result.allCharacters.find(doc => doc.id === chara).firstname,
            lastname: result.allCharacters.find(doc => doc.id === chara).lastname,
            likesCount: result.allCharacters.find(doc => doc.id === chara).likesCount,
            image: result.allCharacters.find(doc => doc.id === chara).image,
            public: result.allCharacters.find(doc => doc.id === chara).public
          }
        } else return null
        })
      })).map(story => ({ ...story, characters: story.characters.filter(char => char) }))

      return dispatch({ type: types.GET_CHARACTERS, payload: result })
    })
}

export const getFavoriteCharacters = id => (dispatch, getState, { getFirebase, getFirestore }) => {

  const userId = id || getFirebase().auth().currentUser.uid

  getFirestore().collection('charactersLikes').where('senderId', '==', userId).get()
    .then(data => {
      let charactersLikesPromises = []
      data.forEach(doc => charactersLikesPromises.push(getFirestore().collection('characters').doc(doc.data().characterId).get()))
      return Promise.all(charactersLikesPromises)
    })
      .then(data => {
        let characters = []
        data.forEach(chara => {
          if (chara.exists && (chara.data().public || chara.data().authorId === userId)) {
            characters.push({
              id: chara.id,
              firstname: chara.data().firstname,
              lastname: chara.data().lastname,
              likesCount: chara.data().likesCount,
              image: chara.data().image,
              authorName: chara.data().authorName,
              authorId: chara.data().authorId,
              public: chara.data().public
            })
          }
        })
        return dispatch({ type: types.GET_FAV_CHARACTERS, payload: characters })
      })
}