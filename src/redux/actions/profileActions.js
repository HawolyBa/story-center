import { reduceCharactersByStories, reduceChaptersNote, reduceLocationsByStories } from './actionHelpers'
import { reduceUserDetails } from '../validators'
import types from '../types'
import { storage } from '../../config/fbConfig'


export const getUserProfile = () => (dispatch, getState, { getFirebase, getFirestore }) => {
  dispatch({ type: types.LOADING_USER })
  let result = {}
  result.favorites = {}
  let charaFromChapters = []
  const userId = getFirebase().auth().currentUser.uid

  getFirestore().collection('characters').where('authorId', '==', userId).get()
    .then(data => {
      result.characters = {}
      result.characters.allCharacters = []
      data.forEach(doc => {
        if (doc.exists) {
          result.characters.allCharacters.push({
            id: doc.id,
            image: doc.data().image,
            firstname: doc.data().firstname,
            lastname: doc.data().lastname,
            createdAt: doc.data().createdAt,
            likesCount: doc.data().likesCount,
            public: doc.data().public,
            authorId: doc.data().authorId
          })
        }
      })
      return getFirestore().collection('storiesLikes').where('senderId', '==', userId).get()
    })
    .then(data => {
      let storiesLikespromises = []
      data.forEach(doc => storiesLikespromises.push(getFirestore().collection('stories').doc(doc.data().storyId).get()))
      return Promise.all(storiesLikespromises)
    })
    .then(data => {
      result.favorites.stories = []
      data.forEach(doc => {
        if (doc.exists && (doc.data().public || doc.data().authorId === userId)) {
          result.favorites.stories.push({
            title: doc.data().title,
            authorName: doc.data().authorName,
            authorId: doc.data().authorId,
            id: doc.id
          })
        }
      })
      return getFirestore().collection('charactersLikes').where('senderId', '==', userId).get()
    })
    .then(data => {
      let charactersLikesPromises = []
      data.forEach(doc => charactersLikesPromises.push(getFirestore().collection('characters').doc(doc.data().characterId).get()))
      return Promise.all(charactersLikesPromises)
    })
    .then(data => {
      result.favorites.characters = []
      data.forEach(chara => {
        if (chara.exists && (chara.data().public || chara.data().authorId === userId)) {
          result.favorites.characters.push({
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
      return getFirestore().collection('usersLikes').where('senderId', '==', userId).get()
    })
    .then(data => {
      let followingPromises = []
      data.forEach(doc => followingPromises.push(getFirestore().collection('users').doc(doc.data().recipient).get()))
      return Promise.all(followingPromises)
    })
    .then(data => {
      result.favorites.followings = []
      data.forEach(user => {
        if (user.exists) {
          result.favorites.followings.push({
            id: user.id,
            image: user.data().image,
            username: user.data().username
          })
        }
      })
      return getFirestore().collection('usersLikes').where('recipient', '==', userId).get()
    })
    .then(data => {
      let followerPromises = []
      data.forEach(doc => followerPromises.push(getFirestore().collection('users').doc(doc.data().senderId).get()))
      return Promise.all(followerPromises)
    })
    .then(data => {
      result.followers = []
      data.forEach(user => {
        if (user.exists) {
          result.followers.push({
            id: user.id,
            image: user.data().image,
            username: user.data().username
          })
        }
      })
      return getFirestore().collection('chapters').where('authorId', '==', userId).get() 
    })
    .then(data => {
      let stories = []
      let storiesPromises = []
      data.forEach((doc, i) => {
        stories.push({note: doc.data().note, storyId: doc.data().storyId})
        charaFromChapters.push({characters: doc.data().characters, storyId: doc.data().storyId})
      })
      
      charaFromChapters = reduceCharactersByStories(charaFromChapters)
      
      result.stories = reduceChaptersNote(stories)
      result.stories.forEach((story, i) => {
        result.stories[i].note = result.stories[i].note.reduce((a, b) => a + b, 0) / result.stories[i].note.length
        result.stories[i].charactersCount = charaFromChapters.find(chap => chap.storyId === story.storyId).characters.length
        storiesPromises.push(getFirestore().collection('stories').doc(story.storyId).get())
      })

      return Promise.all(storiesPromises)
      
    })
    .then(docs => {
      docs.forEach((story, i) => {
        result.stories[i].id = story.id
        result.stories[i].title = story.data().title
        result.stories[i].createdAt = story.data().createdAt
        result.stories[i].category = story.data().category
        result.stories[i].public = story.data().public
        result.stories[i].language = story.data().language
        result.stories[i].banner = story.data().banner
        result.stories[i].status = story.data().status
        result.stories[i].likesCount = story.data().likesCount
        result.stories[i].chaptersCount = story.data().chaptersCount
        result.stories[i].authorId = story.data().authorId
      })
      
      charaFromChapters.forEach((doc, i) => {
        charaFromChapters[i].characters = doc.characters.flat()
        charaFromChapters[i].characters = new Set(doc.characters)
        charaFromChapters[i].characters = Array.from(doc.characters)
      })

      result.characters.charaByStory = charaFromChapters.map((story, i) => {
          const res = {}
          res.storyId = story.storyId
          res.title = result.stories.filter(sto => sto.storyId === story.storyId)[0].title
          res.characters = story.characters.map(chara => {
          const character = result.characters.allCharacters.filter(c => c.id === chara)[0]
          return character
        })
        return res
      })

      return getFirestore().collection('stories').where('authorId', '==', userId).where('chaptersCount', '==', 0).get()
    })
    .then(data => {
      data.forEach(doc => {
        result.stories.push({...doc.data(), id: doc.id, note: 0, charactersCount: 0})
      });
      return getFirestore().collection('locations').where('authorId', '==', userId).orderBy('createdAt', 'desc').get()
    })
    .then(data => {
      result.locations = {}
      result.locations.allLocations = []
      data.forEach(doc => {
        if (doc.exists) {
          result.locations.allLocations.push({
            id: doc.id,
            image: doc.data().image,
            name: doc.data().name,
            description: doc.data().description,
            storyId: doc.data().storyId,
            //storyTitle: result.stories.find(sto => sto.storyId === doc.data().id).title
          })
        }
      })

      let storiesPromises = []
      result.locations.locByStory = reduceLocationsByStories(result.locations.allLocations)
      result.locations.locByStory.forEach(story => {
        storiesPromises.push(getFirestore().collection('stories').doc(story.storyId).get())
      }) 

      return Promise.all(storiesPromises)
    })
    .then(docs => {
      docs.forEach((doc, i) => {
        result.locations.locByStory[i].title = doc.data().title
        result.locations.locByStory[i].id = doc.id
      })
      return dispatch({ type: types.GET_USER, payload: result })
    })
    .catch(err => console.log(err))
}

export const getPublicUserProfile = id => (dispatch, getState, { getFirebase, getFirestore }) => {
  dispatch({ type: types.LOADING_USER })
  let result = {}
  result.favorites = {}
  let charaFromChapters = []

  getFirestore().collection('users').doc(id).get()
    .then(doc => {
      if (!doc.exists) return dispatch({ types: types.NOT_FOUND })
      result = {...result, ...doc.data()}
      result.id = doc.id
      return getFirestore().collection('characters').where('authorId', '==', id).where('public', '==', true).get()
    })
    .then(data => {
      result.characters = {}
      result.characters.allCharacters = []
      data.forEach(doc => {
        if (doc.exists) {
          result.characters.allCharacters.push({
            id: doc.id,
            image: doc.data().image,
            firstname: doc.data().firstname,
            lastname: doc.data().lastname,
            createdAt: doc.data().createdAt,
            likesCount: doc.data().likesCount,
            public: doc.data().public
          })
        }
      })
      return getFirestore().collection('storiesLikes').where('senderId', '==', id).get()
    })
    .then(data => {
      let storiesLikespromises = []
      data.forEach(doc => storiesLikespromises.push(getFirestore().collection('stories').doc(doc.data().storyId).get()))
      return Promise.all(storiesLikespromises)
    })
    .then(data => {
      result.favorites.stories = []
      data.forEach(doc => {
        if (doc.exists && doc.data().public) {
          result.favorites.stories.push({
            title: doc.data().title,
            authorName: doc.data().authorName,
            authorId: doc.data().authorId,
            id: doc.id,
            public: doc.data().public
          })
        }
      })
      return getFirestore().collection('charactersLikes').where('senderId', '==', id).get()
    })
    .then(data => {
      let charactersLikesPromises = []
      data.forEach(doc => charactersLikesPromises.push(getFirestore().collection('characters').doc(doc.data().characterId).get()))
      return Promise.all(charactersLikesPromises)
    })
    .then(data => {
      result.favorites.characters = []
      data.forEach(chara => {
        if (chara.exists && chara.data().public) {
          result.favorites.characters.push({
            id: chara.id,
            firstname: chara.data().firstname,
            lastname: chara.data().lastname,
            likesCount: chara.data().likesCount,
            image: chara.data().image,
            authorName: chara.data().authorName,
            public: chara.data().public
          })
        }
      })
      return getFirestore().collection('usersLikes').where('senderId', '==', id).get()
    })
    .then(data => {
      let followingPromises = []
      data.forEach(doc => followingPromises.push(getFirestore().collection('users').doc(doc.data().recipient).get()))
      return Promise.all(followingPromises)
    })
    .then(data => {
      result.favorites.followings = []
      data.forEach(user => {
        if (user.exists) {
          result.favorites.followings.push({
            id: user.id,
            image: user.data().image,
            username: user.data().username
          })
        }
      })
      return getFirestore().collection('usersLikes').where('recipient', '==', id).get()
    })
    .then(data => {
      let followerPromises = []
      data.forEach(doc => followerPromises.push(getFirestore().collection('users').doc(doc.data().senderId).get()))
      return Promise.all(followerPromises)
    })
    .then(data => {
      result.followers = []
      data.forEach(user => {
        if (user.exists) {
          result.followers.push({
            id: user.id,
            image: user.data().image,
            username: user.data().username
          })
        }
      })
      return getFirestore().collection('chapters').where('authorId', '==', id).get() 
    })
    .then(data => {
      let chapters = []
      let storiesPromises = []
      data.forEach((doc, i) => {
        chapters.push({note: doc.data().note, storyId: doc.data().storyId})
        charaFromChapters.push({characters: doc.data().characters, storyId: doc.data().storyId})
      })
      charaFromChapters = reduceCharactersByStories(charaFromChapters)

      result.stories = reduceChaptersNote(chapters)
      result.stories.forEach((story, i) => {
        result.stories[i].note = result.stories[i].note.reduce((a, b) => a + b, 0) / result.stories[i].note.length
        result.stories[i].charactersCount = charaFromChapters.find(chap => chap.storyId === story.storyId).characters.length
        storiesPromises.push(getFirestore().collection('stories').doc(story.storyId).get())
      })

      return Promise.all(storiesPromises)
      
    })
    .then(docs => {
      docs.forEach((story, i) => {
        if (story.exists) {
          result.stories[i].title = story.data().title
          result.stories[i].createdAt = story.data().createdAt
          result.stories[i].category = story.data().category
          result.stories[i].language = story.data().language
          result.stories[i].banner = story.data().banner
          result.stories[i].public = story.data().public
          result.stories[i].status = story.data().status
          result.stories[i].likesCount = story.data().likesCount
          result.stories[i].chaptersCount = story.data().chaptersCount
        }
      })
      
      charaFromChapters.forEach((doc, i) => {
        charaFromChapters[i].characters = doc.characters.flat()
        charaFromChapters[i].characters = new Set(doc.characters)
        charaFromChapters[i].characters = Array.from(doc.characters)
      })

      result.characters.charaByStory = charaFromChapters.map((story, i) => {
          const res = {}
          res.storyId = story.storyId
          res.public = result.stories.find(sto => sto.storyId === story.storyId).public
          res.title = result.stories.find(sto => sto.storyId === story.storyId).title
          res.characters = story.characters.map(chara => result.characters.allCharacters.find(c => c.id === chara)).filter((c => typeof c === 'object'))
          return res
      })

      return getFirestore().collection('stories').where('authorId', '==', id).where('chaptersCount', '==', 0).where('public', '==', true).get()
    })
    .then(data => {
      data.forEach(doc => {
        if (doc.exists) {
          result.stories.push({...doc.data(), storyId: doc.id, note: 0, charactersCount: 0, public: doc.data().public})
        }
      });
      return getFirestore().collection('locations').where('authorId', '==', id).orderBy('createdAt', 'desc').get()
    })
    .then(data => {
      result.locations = {}
      result.locations.allLocations = []
      data.forEach(doc => {
        if (doc.exists) {
          const publicIds = result.stories.filter(sto => sto.public)
          if (publicIds.includes(doc.data().storyId)) {
            result.locations.allLocations.push({
              id: doc.id,
              image: doc.data().image,
              name: doc.data().name,
              description: doc.data().description,
              storyId: doc.data().storyId,
              storyTitle: result.stories.find(sto => sto.storyId === doc.data().storyId).title
            })
          }
        }
      })
    
      let storiesPromises = []
      result.locations.locByStory = reduceLocationsByStories(result.locations.allLocations)
      result.locations.locByStory.forEach(story => {
        storiesPromises.push(getFirestore().collection('stories').doc(story.storyId).get())
      }) 

      return Promise.all(storiesPromises)
    })
    .then(docs => {
      docs.forEach((doc, i) => {
        result.locations.locByStory[i].title = doc.data().title
        result.locations.locByStory[i].id = doc.id
      })
      result.stories = result.stories.filter(sto => sto.public)
      return dispatch({ type: types.GET_USER, payload: result })
    })
    .catch(err => console.log(err))
}

export const changeImage = image => (dispatch, getState, { getFirebase, getFirestore }) => {

  dispatch({ type: types.LOADING_UI })

  const userId = getFirebase().auth().currentUser.uid
  let imgUrl = ''

  storage
    .ref(`${userId}/${image.name}`)
    .put(image)
    .then(() => storage.ref(userId).child(image.name).getDownloadURL())
    .then(url => {
      imgUrl = url
      return getFirestore().collection('users').doc(userId).update({
        image: url
      })
    })
    .then(() => {
      const newImg = new Image();
      //img.src = imgUrl;
      newImg.onload = function () {
        var imageHeight = newImg.height;
        var imageWidth = newImg.width;
        dispatch({ type: types.IMAGE_CHANGED, payload: {imageWidth, imageHeight} })
      }
      newImg.src = imgUrl; 
      return getFirebase().auth().currentUser.updateProfile({
        photoURL: image.photoURL
      })
    })
    .catch(err => console.log(err))
}

export const updateUserProfile = (newInfo, usernames) => (dispatch, getState, { getFirebase, getFirestore }) => {

  if (newInfo.username && usernames.includes(newInfo.username.toLowerCase()) ) return dispatch({ type: types.SET_ALERTS, payload: { message: 'This username is already taken', alert: 'danger' } })

  const reducedDetails = reduceUserDetails(newInfo)

  const user = getFirebase().auth().currentUser
  const {newPassword, actualPassword,...info} = reducedDetails

  if (newPassword) {
    user.reauthenticateAndRetrieveDataWithCredential(
      getFirebase().auth.EmailAuthProvider.credential(
        user.email, 
        actualPassword
      ))
      .then(cred => user.updatePassword(newPassword))
      .then(() => getFirestore().collection('users').doc(user.uid).update({...info}) )
      .then(() => dispatch({ type: types.SET_ALERTS, payload: { message: 'Your profile has been successfully updated', alert: 'success' } }))
      .catch(err => dispatch({ type: types.SET_ALERTS, payload: { message: err.message, alert: 'danger' } }))
  } else {
    getFirestore().collection('users').doc(user.uid).update({...info}) 
      .then(() => dispatch({ type: types.SET_ALERTS, payload: { message: 'Your profile has been successfully updated', alert: 'success' } }))
      .catch(err => dispatch({ type: types.SET_ALERTS, payload: { message: err.message, alert: 'danger' } }))
  }

  

  // user.updateProfile({
  //   displayName: newInfo.displayName,
  // }).then(() => 
  //   dispatch({ type: 'UPDATE_PROFILE_SUCCESS' })
  // ).catch(error => {
  //   dispatch({ type: 'UPDATE_PROFILE_ERROR' })
  // });

}

export const changeNightmode = () => (dispatch, getState, { getFirebase, getFirestore }) => {
  getFirestore().collection('users').doc(getFirebase().auth().currentUser.uid).get()
    .then(doc => getFirestore().collection('users').doc(getFirebase().auth().currentUser.uid).update({ nightMode: !doc.data().nightMode}))
    
}

export const getNotifications = () => (dispatch, getState, { getFirebase, getFirestore }) => {

  getFirestore().collection('notifications').where('recipient', '==', getFirebase().auth().currentUser.uid).where('read', '==', false).orderBy('createdAt', 'desc')
    .onSnapshot(data => {
      let result = []
      data.forEach(doc => {
        if (doc.exists) {
          result.push({
            id: doc.id,
            message: doc.data().message,
            read: doc.data().read,
            type: doc.data().type,
            createdAt: doc.data().createdAt
          })
        }
      })
      return dispatch({ type: types.GET_NOTIFICATIONS, payload: result })
    })
}

export const getUsersBySearch = search => (dispatch, getState, { getFirebase, getFirestore }) => {

  let result = []
  getFirestore().collection('users').get()
    .then(data => {
      data.forEach(doc => {
        const username = doc.data().username.toLowerCase().split(' ')
        const searchTerm = search.split('-')
        const isIncluded = searchTerm.every(word => username.includes(word))
        const orIncluded = searchTerm.some(word => doc.data().username.toLowerCase().indexOf(word) !== -1)
        if (isIncluded || orIncluded) {
          result.push({...doc.data(), id: doc.id})
        }
      })
      return dispatch({ type: types.GET_ARCHIVES_USERS, payload: result })
    })    
}

export const report = info => (dispatch, getState, { getFirebase, getFirestore }) => {

  
  const userId = getFirebase().auth().currentUser ? getFirebase().auth().currentUser.uid: 'Anonymous'
  const username = getState().firebase.profile.isEmpty ? info.username: getState().firebase.profile.username
  const imageName = Math.round(Math.random() * 10000000).toString()

  if (typeof info.image === 'object') {
    
    storage
      .ref(`${userId}/${imageName}`)
      .put(info.image)
      .then(() => storage.ref(userId).child(imageName).getDownloadURL())
      .then(url => {
        return getFirestore().collection('reports').add({
          ...info,
          image: url,
          plaignant: userId,
          plaignantName: username
        })
      })
      .then(() => dispatch({ type: types.REPORT_SENT, payload: { message: 'Report successfully adressed', alert: 'success' } }))
      .catch((err) => console.log(err))
  } else {
    getFirestore().collection('reports').add({
      ...info,
      plaignant: userId,
      plaignantName: username
    })
    .then(() => dispatch({ type: types.REPORT_SENT, payload: { message: 'Report successfully adressed', alert: 'success' } }))
    .catch((err) => dispatch({ type: types.REPORT_SENT, payload: { message: 'There has been a problem', alert: 'danger' } }))
  }
}

export const addFeedback = (userId, content) => (dispatch, getState, { getFirebase, getFirestore }) => {
  getFirestore().collection('feedback').add({ userId, content, createdAt: new Date().toISOString() })
}

export const markedAsSeen = notifications => (dispatch, getState, { getFirebase, getFirestore }) => {

  const batch = getFirestore().batch()
  const notifPromises = []

  notifications.forEach(notif => {
    notifPromises.push(getFirestore().collection('notifications').doc(notif.id).get())
  })
  Promise.all(notifPromises).then(data => {
    data.forEach(doc => {
      if (!doc.data().read) batch.update(getFirestore().collection('notifications').doc(doc.id), { read: true })
    })
    batch.commit()
  })
}

export const markAllAsRead = () => (dispatch, getState, { getFirebase, getFirestore }) => {

  const batch = getFirestore().batch()
  const userId = getFirebase().auth().currentUser.uid

  getFirestore().collection('notifications').where('recipient', '==', userId).where('read', '==', false).get()
    .then(data => {
      data.forEach(doc => {
        batch.update(getFirestore().collection('notifications').doc(doc.id), { read: true })
      })
      return batch.commit()
    })
}

export const markOneAsRead = id => (dispatch, getState, { getFirebase, getFirestore }) => {
  getFirestore().collection('notifications').doc(id).update({ read: true })
}

export const dismissAll = () => (dispatch, getState, { getFirebase, getFirestore }) => {
  const batch = getFirestore().batch()
  const userId = getFirebase().auth().currentUser.uid

  getFirestore().collection('notifications').where('recipient', '==', userId).get()
    .then(data => {
      data.forEach(doc => {
        batch.delete(getFirestore().collection('notifications').doc(doc.id))
      })
      return batch.commit()
    })
}