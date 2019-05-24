import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { getPopularStories, getPopularTags, getLatestStories, cleanup, getFeaturedStories } from '../../redux/actions/storyActions'
import { getRandomUsers, getPopularUsers } from '../../redux/actions/listActions'
import { login, resetPassword } from '../../redux/actions/authActions'
import { getPopularCharacters } from '../../redux/actions/charactersActions'
import { string, arrayOf, shape, number, object, func, array } from 'prop-types'
import { Form, Label, FormGroup, Row, Container } from 'reactstrap'
import {Link} from 'react-router-dom'
import { sortAlpha, deleteSpaces } from '../../utils/helpers'
import { defaultAvatar } from '../default/defaultImages'


import Loading from '../shared/Loading'
import PopularStories from './PopularStories';
import PopularCharacters from './PopularCharacters';
import CallToActions from './CallToActions';
import Showcase from './Showcase';
import PasswordLost from '../authentication/PasswordLost'

class Home extends Component {

    state = {
      email: '',
      password: '',
      modal: false,
      hovered: false
    }

  componentDidMount() {
    this.props.getPopularStories()
    this.props.getFeaturedStories()
    this.props.getPopularUsers()
    this.props.getLatestStories()
    this.props.getPopularCharacters()
    this.props.getPopularTags()
  }

  componentWillUnmount() {
    this.props.cleanup()
  }

  showSlide = e => {
    const slides = document.querySelectorAll('.slides')
    slides.forEach(slide => slide.classList.remove('active'))
    const paginations = document.querySelectorAll('.pagination-btn')
    paginations.forEach(pagi => pagi.classList.remove('pagination-active'))

    document.getElementById(e.target.id).classList.add('pagination-active')
    document.getElementById(`slide${e.target.id}`).classList.add('active')
  }
 
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value.trim().toString() })
  }

  togglePasswordLost = e => {
    this.setState({ modal: !this.state.modal })
  }

  login = e => {
    e.preventDefault()
    this.props.login({email: this.state.email, password: this.state.password})
  }

  resetPassword = e => {
    e.preventDefault()
    this.props.resetPassword(e.target.email.value)
  }

  selectCategory = e => {
    this.props.history.push(`/categories/${e.target.value}`)
  }

  toggleBg = e => {
    // const target = document.getElementById(e.target.id)
    // const bg = target.getAttribute('data-bg')
    // if (!this.state.hovered) {
    //   target.style.background = '#303030'
    //   this.setState({ hovered: true })
    // } else {
    //   target.style.background = `url(${bg}) no-repeat center / cover`
    //   this.setState({ hovered: false })
    // }
    
  }

  render() {
    const { categories, stories, popularStories, popularCharacters, authError, auth, profile, popularUsers, popularTags, loading, featuredStories } = this.props
    return (
      <main className="inner-main">
      {!loading ?
        <div className="home">
          <PasswordLost resetPassword={this.resetPassword} alerts={this.props.alerts} toggleModal={this.togglePasswordLost} isOpen={this.state.modal} />
          <Showcase history={this.props.history} showSlide={this.showSlide} stories={featuredStories}/>
          <Container>
            <Row>
              <aside id="left-col" className="col-md-2 col-md-push-8">
                <section className="categories home-list mb-4">
                  <h2 className="mb-2">Categories</h2>
                  <div className="select">
                    <select className="select-cat" name="categories" onChange={this.selectCategory}>
                      <option hidden>Choose...</option>
                      { categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <ul className="cat-list">
                    { categories.map(cat => (
                      <Fragment key={cat.id}>
                        <li><Link to={`/categories/${cat.id}`}>{`${cat.name} (${cat.storiesCount})`}</Link></li>
                      </Fragment>
                    )) }
                  </ul>
                </section>
                <section className="trendings home-list mb-4">
                  <h2 className="mb-3">Trendings</h2>
                  <ul>
                    { popularTags.map(({tag, times}) => (
                      <Fragment key={tag}>
                        <li><Link to={`/tags/${encodeURIComponent(tag)}`}>#{deleteSpaces(decodeURIComponent(tag))}</Link></li>
                      </Fragment>
                    )) }
                  </ul>
                </section>
              </aside>
              <div id="popular-stories" className="col-md-8 col-md-pull-2">
                <h2 className="mb-4">Popular stories</h2>
                  <PopularStories toggleBg={this.toggleBg} hovered={this.state.hovered} popularStories={popularStories}/>
                <hr/>
                { auth.uid ? 
                  <CallToActions history={this.props.history}/>: 
                  <p>Login or Register now to start writing your stories !</p> }
                <hr/>
                <PopularCharacters popularCharacters={popularCharacters}/>
                <hr/>
                <div className="latest-stories mb-4">
                  <h2 className="mb-4 mt-4">Latest stories</h2>
                  <PopularStories type="latest" popularStories={stories} />
                </div>
              </div>
              <aside id="right-col" className="col-md-2 right-col">
              <div className="login">
                {!auth.uid ? <Form onSubmit={this.login} className="login-form">
                  <h2>Login</h2>
                  { authError ? <div className="alert alert-danger login-failed">{authError}</div>: null }
                  <FormGroup>
                    <Label>Email address</Label>
                    <input onChange={this.onChange} type="email" name="email" id="email"/>
                  </FormGroup>
                  <FormGroup>
                    <Label>Password</Label>
                    <input onChange={this.onChange} type="password" name="password" id="password"/>
                  </FormGroup>
                  <div className="flex fc ac">
                    <button className="custom-btn">Login</button>
                    <p className="mt-4" onClick={this.togglePasswordLost}>Password lost ?</p>
                    <Link to="/auth">Don't have an account yet ? Register here</Link>
                  </div>
                </Form>: 
                <div className="greetings">
                  <h3 className="greetings">Hello {profile.username}</h3>
                  <Link className="profile-link" to="/profile">Go to your profile</Link>
                </div>
                    }  
              </div>
              <hr/>
              <div className="random-users popular-users">
                <h2>Popular authors</h2>
                <ul>
                  { popularUsers.map(user => (
                    <Fragment key={user.id}>
                      <li className="flex fs ac frn">
                        <div className="user-pic-block">
                          <img className="user-pic" src={user.image ? user.image: defaultAvatar } alt={user.username}/>
                        </div>
                        <span className="flex fc fs jc">
                          <Link to={`/profile/${user.id}`}>{user.username}</Link>
                          <span>{user.likesCount} follower{user.likesCount > 1 ? 's': ''}</span>
                        </span>
                      </li> 
                      <hr/>
                    </Fragment>
                  )) }
                </ul>
              </div>
              <div className="links">
                <h2>Links</h2>
                <hr/>
                <ul>
                  <li><Link to='/contact'>Contact</Link></li>
                  <li><Link to='/rules'>Rules</Link></li>
                  <li><Link to='/privacy'>Privacy</Link></li>
                </ul>
              </div>
            </aside>
            </Row>
          </Container>
        </div>:
      <Loading /> }
      </main>
    )
  }
}

Home.defaultProps = {
  categories: [],
  stories: [],
  popularStories: [],
  popularCharacters: []
}

Home.propTypes = {
  categories: arrayOf(shape({
      id: string.isRequired,
      name: string.isRequired,
      storiesCount: number.isRequired
  })).isRequired,
  stories: arrayOf(shape({
      id: string.isRequired,
      title: string.isRequired,
      banner: string.isRequired,
  })).isRequired,
  popularStories: arrayOf(shape({
      title: string,
      id: string,
      banner: string,
      likesCount: number,
      characters: number,
      note: number,
      authorName: string,
  })).isRequired,
  popularCharacters: arrayOf(shape({
      id: string,
      authorName: string,
      firstname: string,
      lastname: string,
      image: string,
      likesCount: number
  })).isRequired,
  randomUsers: arrayOf(shape({
      id: string.isRequired,
      image: string.isRequired,
      username: string.isRequired
  })).isRequired,
  popularUsers: arrayOf(shape({
    id: string.isRequired,
    image: string.isRequired,
    username: string.isRequired,
    likesCount: number.isRequired
  })).isRequired,
  popularTags: arrayOf(shape({
    tag: string.isRequired,
    times: number.isRequired
  })).isRequired,
  featuredStories: array.isRequired,
  auth: object.isRequired,
  profile: object.isRequired,
  authError: string,
  getPopularStories: func.isRequired,
  getRandomUsers: func.isRequired,
  login: func.isRequired,
  getPopularUsers: func.isRequired,
  getPopularCharacters: func.isRequired,
  getPopularTags: func.isRequired,
  getFeaturedStories: func.isRequired,
  resetPassword: func.isRequired
}

const mapStateToProps = state => {
  return {
    categories: state.firestore.ordered.categories && sortAlpha(Array.from(state.firestore.ordered.categories)),
    stories: state.story.latest,
    popularStories: state.story.popularStories,
    popularCharacters: state.characters.popularCharacters,
    randomUsers: state.list.randomUsers,
    authError: state.auth.authError,
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    popularUsers: state.list.popularUsers,
    popularTags: state.story.popularTags,
    loading: state.story.loading,
    featuredStories: state.story.featuredStories,
    alerts: state.alerts
  }
}

export default compose(connect(mapStateToProps, { getPopularStories, getRandomUsers, login, getPopularUsers, getPopularCharacters, getPopularTags, getLatestStories, cleanup, getFeaturedStories, resetPassword }), firestoreConnect([{collection: 'categories'}]))(Home)
