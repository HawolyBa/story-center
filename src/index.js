import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './redux/store'
import * as Sentry from '@sentry/browser';

Sentry.init({ dsn: 'https://d361604afa4e43b6b9d83f0f5b7cdece@sentry.io/1468658' });

store.firebaseAuthIsReady.then(() => {
  ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
})
