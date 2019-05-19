import { getOneFromCollection, removeFromFavorite, addToFavoriteHelper, findifFavorite, getAllFromCollection } from "./actionHelpers";
import types from "../types";

export const addToFavorite = (id, type) => async (dispatch, getState, { getFirebase, getFirestore }) => {

  const userId = getFirebase().auth().currentUser.uid
  let newArray = []

  if (getFirebase().auth().currentUser.emailVerified) {
    const userQuery = await getOneFromCollection(getFirestore, 'users', userId)

    if (type === 'character') {
      addToFavoriteHelper(userQuery, 'favoritesCharacters', id, getFirestore, userId, 'characters')
    } else if (type === 'story') {
      addToFavoriteHelper(userQuery, 'favoritesStories', id, getFirestore, userId, 'stories')
    } else if (type === 'profile') {
      addToFavoriteHelper(userQuery, 'favoritesUsers', id, getFirestore, userId, 'users')
    }

    return dispatch({ type: 'ADD_TO_FAVORITE', payload: newArray })
   
  } else {
    dispatch({ type: 'VERIFY_ERROR', payload: 'You need to verify your email first' })
  }
}

export const removeFavorite = (id, type) => async (dispatch, getState, { getFirebase, getFirestore }) => {

  const userId = getFirebase().auth().currentUser.uid

  const userQuery = await getOneFromCollection(getFirestore, 'users', userId)

    if (type === 'character') {
      removeFromFavorite(userQuery, 'favoritesCharacters', id, getFirestore, userId, 'characters')
    } else if (type === 'story') {
      removeFromFavorite(userQuery, 'favoritesStories', id, getFirestore, userId, 'stories')
    } else if (type === 'profile') {
      removeFromFavorite(userQuery, 'favoritesUsers', id, getFirestore, userId, 'users')
    }
    dispatch({ type: 'REMOVE_FAVORITE', payload: 'remove successfully' })
  
}

export const isItemFavorite = (id, type) => async (dispatch, getState, { getFirebase, getFirestore }) => {

  let isFavorite
  const userQuery = await getOneFromCollection(getFirestore, 'users', getFirebase().auth().currentUser.uid)

    if (type === 'profile') {
      isFavorite = findifFavorite(userQuery, 'favoritesUsers', id)
    } else if (type === 'character') {
      isFavorite = findifFavorite(userQuery, 'favoritesCharacters', id)
    } else if (type === 'story') {
      isFavorite = findifFavorite(userQuery, 'favoritesStories', id)
    }
    dispatch({ type: 'IS_FAVORITE', payload: isFavorite })
}

export const getFollowings = id => async (dispatch, getState, { getFirebase, getFirestore }) => {
  const userId = id || getFirebase().auth().currentUser.uid

  getFirestore().collection('usersLikes').where('senderId', '==', userId).get()
    .then(data => {
      let followingPromises = []
      data.forEach(doc => followingPromises.push(getFirestore().collection('users').doc(doc.data().recipient).get()))
      return Promise.all(followingPromises)
    })
    .then(data => {
      let followings = []
      data.forEach(user => {
        if (user.exists) {
          followings.push({
            id: user.id,
            image: user.data().image,
            username: user.data().username
          })
        }
      })
      return dispatch({ type: types.GET_FOLLOWINGS, payload: followings })
    })
}

export const getFollowers = id => async (dispatch, getState, { getFirebase, getFirestore }) => {
  const userId = id || getFirebase().auth().currentUser.uid

  getFirestore().collection('usersLikes').where('recipient', '==', userId).get()
    .then(data => {
      let followerPromises = []
      data.forEach(doc => followerPromises.push(getFirestore().collection('users').doc(doc.data().senderId).get()))
      return Promise.all(followerPromises)
    })
    .then(data => {
      const followers = []
      data.forEach(user => {
        if (user.exists) {
          followers.push({
            id: user.id,
            image: user.data().image,
            username: user.data().username
          })
        }
      })
      return dispatch({ type: types.GET_FOLLOWERS, payload: followers })
    })
}

export const getRandomUsers = () => async (dispatch, getState, { getFirebase, getFirestore }) => {

  const usersQuery = await getAllFromCollection(getFirestore, 'users')
  let users = []
  let numberOfUsers = usersQuery.docs.length
  let allIds = []
  let j;

  while (allIds.length < 5) {
    j = Math.floor(Math.random() * numberOfUsers)
    if (allIds.indexOf(j) === -1) {
      let user = await getOneFromCollection(getFirestore, 'users', usersQuery.docs[j].id)
      users = [...users, {
        id: user.id,
        image: user.data().image,
        username: user.data().username
      }]
      allIds.push(j)
    }
  }

return dispatch({ type: types.GET_RANDOM_USERS, payload: users })

}

export const getPopularUsers = () => async (dispatch, getState, { getFirebase, getFirestore }) => {
  let result = []

  getFirestore().collection('users').orderBy('likesCount', 'desc').limit(5).get()
    .then(data => {
      data.forEach(user => {
        result.push({
          id: user.id,
          image: user.data().image,
          username: user.data().username,
          likesCount: user.data().likesCount
        })
      })
      return dispatch({ type: types.GET_POPULAR_USERS, payload: result })
    })
    .catch(err => console.log(err))
}

export const addStoryToFavorite = (id, isFavorite) => (dispatch, getState, { getFirebase, getFirestore }) => {
  if (isFavorite) return dispatch({ type: types.LIKE_ERROR, payload: {message: 'You already liked this story', alert: 'danger'} })
  if (!getFirebase().auth().currentUser) return dispatch({ type: types.LIKE_ERROR, payload: {message: 'You need to login to like a story', alert: 'danger'} })
  if (!getFirebase().auth().currentUser.emailVerified) return dispatch({ type: types.LIKE_ERROR, payload: {message: 'You need to verify your email first', alert: 'danger'} })

  getFirestore().collection('storiesLikes').add({
    sender: getState().firebase.profile.username,
    senderId: getFirebase().auth().currentUser.uid,
    storyId: id,
    createdAt: new Date().toISOString()
  })
  .then(() => {
    dispatch({ type: types.LIKED, payload: {message: 'Story added successfully to your favorites', alert: 'success'} })
  })
  .catch(err => dispatch({ type: types.LIKE_ERROR, payload: {message: 'There has been a problem', alert: 'danger'} }))
}

export const removeStoryFormFavorite = (id, isFavorite) => (dispatch, getState, { getFirebase, getFirestore }) => {
  if (!isFavorite) return dispatch({ type: types.LIKE_ERROR, payload: {message: 'You don\'t like this this story yet', alert: 'danger'} })

  getFirestore().collection('storiesLikes').where('storyId', '==', id).where('senderId', '==', getFirebase().auth().currentUser.uid).get()
    .then(data => {
      return getFirestore().collection('storiesLikes').doc(data.docs[0].id).delete()
    })
    .then(() => dispatch({ type: types.UNLIKED, payload: {message: 'Story removed successfully from your favorites', alert: 'success'} }))
    .catch(err => dispatch({ type: types.LIKE_ERROR, payload: { message: 'There has been a problem', alert: 'danger' } }))
}

export const addCharacterToFavorite = (id, isFavorite) => (dispatch, getState, { getFirebase, getFirestore }) => {
  if (isFavorite) return dispatch({ type: types.LIKE_ERROR, payload: {message: 'You already liked this character', alert: 'danger'} })
  if (!getFirebase().auth().currentUser) return dispatch({ type: types.LIKE_ERROR, payload: {message: 'You need to login to like a character', alert: 'danger'} })
  if (!getFirebase().auth().currentUser.emailVerified) return dispatch({ type: types.LIKE_ERROR, payload: {message: 'You need to verify your email first', alert: 'danger'} })

  getFirestore().collection('charactersLikes').add({
    sender: getState().firebase.profile.username,
    senderId: getFirebase().auth().currentUser.uid,
    characterId: id,
    createdAt: new Date().toISOString()
  })
  .then(() => {
    dispatch({ type: types.LIKED, payload: {message: 'Character added successfully to your favorites', alert: 'success'} })
  })
  .catch(err => dispatch({ type: types.LIKE_ERROR, payload: {message: 'There has been a problem', alert: 'danger'} }))
}

export const removeCharacterFromFavorite = (id, isFavorite) => (dispatch, getState, { getFirebase, getFirestore }) => {
  if (!isFavorite) return dispatch({ type: types.LIKE_ERROR, payload: {message: 'You don\'t like this this character yet', alert: 'danger'} })

  getFirestore().collection('charactersLikes').where('characterId', '==', id).where('senderId', '==', getFirebase().auth().currentUser.uid).get()
    .then(data => {
      return getFirestore().collection('charactersLikes').doc(data.docs[0].id).delete()
    })
    .then(() => dispatch({ type: types.UNLIKED, payload: {message: 'Character removed successfully from your favorites', alert: 'success'} }))
    .catch(err => dispatch({ type: types.LIKE_ERROR, payload: { message: 'There has been a problem', alert: 'danger' } }))
}

export const followUser = (id, isFavorite, newFollower) => (dispatch, getState, { getFirebase, getFirestore }) => {
  if (isFavorite) return dispatch({ type: types.LIKE_ERROR, payload: {message: 'You are already following this user', alert: 'danger'} })
  if (!getFirebase().auth().currentUser) return dispatch({ type: types.LIKE_ERROR, payload: {message: 'You need to login to follow users', alert: 'danger'} })
  if (!getFirebase().auth().currentUser.emailVerified) return dispatch({ type: types.LIKE_ERROR, payload: {message: 'You need to verify your email first', alert: 'danger'} })

  getFirestore().collection('usersLikes').add({
    sender: newFollower.username,
    senderId: newFollower.id,
    recipient: id,
    createdAt: new Date().toISOString()
  })
  .then(() => {
    dispatch({ type: types.LIKED, payload: {message: 'You are now following this user', alert: 'success', newFollower} })
  })
  .catch(err => dispatch({ type: types.LIKE_ERROR, payload: {message: 'There has been a problem', alert: 'danger'} }))
}

export const unfollowUser = (id, isFavorite) => (dispatch, getState, { getFirebase, getFirestore }) => {
  if (!isFavorite) return dispatch({ type: types.LIKE_ERROR, payload: {message: 'You are not following this user yet', alert: 'danger'} })

  getFirestore().collection('usersLikes').where('recipient', '==', id).where('senderId', '==', getFirebase().auth().currentUser.uid).get()
    .then(data => {
      return getFirestore().collection('usersLikes').doc(data.docs[0].id).delete()
    })
    .then(() => dispatch({ type: types.UNLIKED, payload: {message: 'User successfully unfollowed', alert: 'success', id: getFirebase().auth().currentUser.uid} }))
    .catch(err => dispatch({ type: types.LIKE_ERROR, payload: { message: 'There has been a problem', alert: 'danger' } }))
}