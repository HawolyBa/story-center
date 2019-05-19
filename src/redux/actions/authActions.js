//import axios from 'axios'
import types from '../types'
import { validateSignUpData, validateLoginData } from '../validators'


export const register = (newUser, usernames, history) => (dispatch, getState, { getFirebase, getFirestore }) => {

  dispatch({ type: types.LOADING_UI })

  const {valid, errors} = validateSignUpData(newUser, usernames)

  if (!valid) return dispatch({ type: types.SET_ERRORS, payload: errors })

  getFirebase().auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then(addedUser => {
      return getFirestore().collection('users').doc(addedUser.user.uid).set({
        username: newUser.username,
        nightMode: false,
        likesCount: 0,
        twitter: '',
        facebook: '',
        instagram: '',
        biography: '',
        badges: [],
        createdAt: new Date().toISOString(),
        image: '',
        suspended: false
      })
    })
    .then(() => history.goBack())
    .catch(err => dispatch({ type: types.REGISTER_ERROR, payload: err.message }))
}

export const login = (credentials, history) => (dispatch, getState, { getFirebase }) => {

  const {valid, errors} = validateLoginData(credentials)

  if (!valid) return dispatch({ type: types.SET_ERRORS, payload: errors })

  getFirebase().auth().signInWithEmailAndPassword(
    credentials.email,
    credentials.password
  )
  .then(() => {
    if (history) history.goBack()
    dispatch({ type: types.LOGIN_SUCCESS })
  })
  .catch(err => {
    console.log(err)
    dispatch({ type: types.SET_ERRORS, payload: {general: err.message} })
  })
}

export const deleteAccount = (history) => async (dispatch, getState, { getFirebase, getFirestore }) => {
  const userId = getFirebase().auth().currentUser.uid
  getFirestore().collection('users').doc(userId).delete().then(() => {
    getFirebase().auth().currentUser.delete()
    history.push('/')
  }).catch(err => console.log(err))
  
}

export const logout = () => (dispatch, getState, { getFirebase }) => {
  getFirebase().auth().signOut()
}

export const verifyEmail = () => (dispatch, getState, { getFirebase, getFirestore }) => {

  getFirebase().auth().currentUser.sendEmailVerification().then(() => {
    alert("Verification Email sent")
  }).catch(err => {
    console.log(err)
  })
  
}

export const resetPassword = email => (dispatch, getState, { getFirebase, getFirestore }) => {
  getFirebase().auth().sendPasswordResetEmail(email)
    .then(() => dispatch({ type: types.PASSWORD_RESET, payload: { message: `Account recovery email sent to ${email}. Check your inbox to reset your pssword.`, alert: "success" } }))
    .catch(err => dispatch({ type: types.PASSWORD_RESET_ERROR, payload: { message: err.message, alert: "danger" } }))
}

export const getBadges = id => (dispatch, getState, { getFirebase, getFirestore }) => {
  const firestore = getFirestore()
  let badges = []

  firestore.collection('users')
    .doc(id)
    .get()
    .then(snapshot => {
      if (snapshot.data().badges) {
        snapshot.data().badges.forEach(badge => {
          firestore.collection('badges')
            .doc(badge)
            .get()
            .then(s => {
              badges = [...badges, {...s.data(), id: badge}]
              return dispatch({ type: 'GET_BADGES', payload: badges })
            })
        })
      }
    })
}

export const getUser = () => async (dispatch, getState, { getFirebase, getFirestore }) => {
  // axios.get(`https://europe-west1-story-center.cloudfunctions.net/api/${'gaga'}`)
  //   .then(res => {
  //     return dispatch({ type: 'GET_USER', payload: res.data })
  //   })
}