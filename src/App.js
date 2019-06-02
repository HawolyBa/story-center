import React, { Component } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css'
import './scss/main.scss'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import {routes, protectedRoutes} from './routes'

import Layout from './components/shared/Layout'
import AuthRoute from './components/authentication/AuthRoute'
import Authentication from './components/authentication/Authentication'
import ProtectedRoute from './components/shared/ProtectedRoute'

import NotFound from './components/shared/NotFound';
import ScrollToTop from './components/shared/ScrollToTop';
import Loading from './components/hoc/Loading'

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <BrowserRouter >
            <ScrollToTop>
              <Loading />
              <Layout>
                <Switch>
                  { routes.map(({ path, Component, exact }) => <Route key={path} exact={exact} path={path} component={Component}/> )}
                  {protectedRoutes.map(({ path, Component, exact }) => (
                    <ProtectedRoute component={Component} key={path} exact={exact} path={path} />
                  ))}
                  <AuthRoute exact path="/auth" component={Authentication} />
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
