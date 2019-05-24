import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './scss/main.scss'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'


import Layout from './components/shared/Layout'
import AuthRoute from './components/authentication/AuthRoute'
import Authentication from './components/authentication/Authentication'
import Home from './components/home/Home'
import Profile from './components/profile/Profile'
import PrivateProfile from './components/profile/PrivateProfile'
import ProtectedRoute from './components/shared/ProtectedRoute'

import Character from './components/character/Character'
import AddCharacter from './components/addCharacter/AddCharacter'
import EditCharacter from './components/addCharacter/EditCharacter'

import Story from './components/story/Story'
import Chapter from './components/story/chapter/Chapter'
import AddStory from './components/story/addStory/AddStory'
import EditStory from './components/story/addStory/EditStory'
import AddChapter from './components/story/addChapter/AddChapter'
import EditChapter from './components/story/addChapter/EditChapter'

import Archive from './components/archive/Archive'

import Rules from './components/links/Rules'
import Privacy from './components/links/Privacy'
import Contact from './components/links/Contact'

import NotFound from './components/shared/NotFound';
import ScrollToTop from './components/shared/ScrollToTop';
import Guidances from './components/static/Guidances';
import Notifications from './components/notifications/Notifications';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter >
          <ScrollToTop>
            <Layout>
              <Switch>
                <Route exact path='/' component={Home}/>
                <Route exact path='/rules' component={Guidances}/>
                <AuthRoute exact path="/auth" component={Authentication} />
                <ProtectedRoute exact path='/profile' component={PrivateProfile}/>
                <ProtectedRoute exact path='/notifications' component={Notifications}/>
                <Route path='/profile/:id' component={Profile}/>
                <ProtectedRoute exact path='/character/add' component={AddCharacter}/>
                <Route path='/character/edit/:id' component={EditCharacter}/>
                <Route path='/character/:id' component={Character}/>
                <ProtectedRoute exact path='/story/add' component={AddStory}/>
                <Route path='/story/:id/edit' component={EditStory}/>
                <Route path='/story/:id/chapter/:chapid/edit' component={EditChapter}/>
                <Route path='/story/:id/chapter/:chapid' component={Chapter}/>
                <Route path='/story/:id/add' component={AddChapter}/>
                <Route path='/story/:id' component={Story}/>
                <Route path='/search/:search' component={Archive}/>
                <Route path='/categories/:catid' component={Archive}/>
                <Route path='/tags/:tag' component={Archive}/>
                <Route exact path='/browse' component={Archive}/>
                <Route exact path='/contact' component={Contact}/>
                <Route exact path='/privacy' component={Privacy}/>
                <Route exact path='/rules' component={Rules}/>
                <Route component={NotFound}/>
              </Switch>
            </Layout>
          </ScrollToTop>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
