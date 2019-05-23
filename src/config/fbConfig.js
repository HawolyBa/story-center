
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/functions'
import 'firebase/storage'


var config = {
  apiKey: "AIzaSyBI9ITjYUCZ6YedemNiY9EXmKMLEx6yCys",
  authDomain: "story-center.firebaseapp.com",
  databaseURL: "https://story-center.firebaseio.com",
  projectId: "story-center",
  storageBucket: "story-center.appspot.com",
  messagingSenderId: "1095246518275"
};
firebase.initializeApp(config);

export const storage = firebase.storage()
export const functions = firebase.functions()
const firestore = firebase.firestore();
firestore.settings({timestampsInSnapshots: true});

export default firebase