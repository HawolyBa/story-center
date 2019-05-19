import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'
import storyReducer from './storyReducer';
import authReducer from './authReducer';
import charactersReducer from './charactersReducer';
import listReducer from './listReducer';
import UIReducer from './UIReducer';
import alertReducer from './alertReducer';
import profileReducer from './profileReducer';

export default combineReducers({
  firestore: firestoreReducer,
  firebase: firebaseReducer,
  story: storyReducer,
  auth: authReducer,
  characters: charactersReducer,
  list: listReducer,
  UI: UIReducer,
  alerts: alertReducer,
  profile: profileReducer
})