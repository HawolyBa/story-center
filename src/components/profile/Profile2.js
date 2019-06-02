import React, { Component } from 'react'
//import { string } from 'prop-types'
import { connect } from 'react-redux'
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { setProgressBar } from '../../redux/actions/profileActions'
import {  getPrivateStories } from '../../redux/actions/storyActions'
import { Row, Col } from 'reactstrap'

class Profile2 extends Component {

  componentDidMount() {
    this.props.getPrivateStories()
  }

  componentDidUpdate(prevProps) {
    if (this.props.loading !== prevProps.loading) {
      const open = this.props.loading === false ? '' : 'OPEN'
      this.props.setProgressBar(open)
    }
  }
  
  render() {
    return (
      <main className="profile">
        <Row>
          <Col md="3">
          <section className="user-infos">
            <div className="avatar mb-4"/>
            <h2>Hawoly Ba</h2>
            <table className="stats flex spb ac frn mb-4 mt-4">
              <tbody>
                <tr className="numbers">
                  <td><strong>12</strong></td>
                  <td><strong>160</strong></td>
                  <td><strong>426</strong></td>
                </tr>
                <tr>
                  <td>stories</td>
                  <td>followers</td>
                  <td>followings</td>
                </tr>
              </tbody>
            </table>
            <p className="bio text-center mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi</p>
            <button className="square-btn custom-btn">Follow</button>
            <div className="tabs mt-5">
              <Row>
                <Col md="6">
                  <div className="tab">
                    <i className="fas fa-book"></i>
                    <span>Stories</span>
                  </div>
                </Col>
                <Col md="6">
                  <div className="tab">
                    <i className="fas fa-users"></i>
                    <span>Characters</span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <div className="tab">
                    <i className="fas fa-map-marker-alt" id="add-location-btn"></i>
                    <span>Locations</span>
                  </div>
                </Col>
                <Col md="6">
                  <div className="tab">
                    <i className="fas fa-user-friends"></i>
                    <span>Followers</span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <div className="tab">
                    <i className="fas fa-heart"></i>
                    <span>Favorite</span>
                  </div>
                </Col>
                <Col md="6">
                  <div className="tab">
                    <i className="fas fa-cog"></i>
                    <span>Settings</span>
                  </div>
                </Col>
              </Row>
            </div>
          </section>
          </Col>
          <Col md="9">
            <section className="content">
              <div className="stories">
                <div className="upper-band flex spb ac frn">
                  <h3>13 stories</h3>
                  <div className="sort">
                    View: <i class="fas fa-th"></i> <i class="fas fa-list"></i>
                  </div>
                </div>
                <Row>
                  <Col md="6">
                    <div className="story-block">
                      <h4>Titre de l'histoire</h4>
                      <small><span className="dot dot-in-progress"></span> In progress</small>
                      <small>Posted two weeks ago</small>
                      <hr/>
                      <p>Summary: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste quaerat nostrum, nulla velit neque facere mollitia nemo ut earum tempora iure totam libero, amet doloribus aut, voluptatem nesciunt soluta? Reprehenderit...</p>
                      <div className="story-footer flex fs ac frn">
                        <span>Note</span>
                        <div className="stats">
                          <span><strong>13</strong> chapters</span>
                          <span><strong>20</strong> characters</span>
                        </div>
                        <span>128 <i className="fas fa-heart"></i></span>
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="story-block">
                      <h4>Titre de l'histoire</h4>
                      <small><span className="dot dot-in-progress"></span> In progress</small>
                      <small>Posted two weeks ago</small>
                      <hr/>
                      <p>Summary: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste quaerat nostrum, nulla velit neque facere mollitia nemo ut earum tempora iure totam libero, amet doloribus aut, voluptatem nesciunt soluta? Reprehenderit...</p>
                      <div className="story-footer flex fs ac frn">
                        <span>Note</span>
                        <div className="stats">
                          <span><strong>13</strong> chapters</span>
                          <span><strong>20</strong> characters</span>
                        </div>
                        <span>128 <i className="fas fa-heart"></i></span>
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="story-block">
                      <h4>Titre de l'histoire</h4>
                      <small><span className="dot dot-in-progress"></span> In progress</small>
                      <small>Posted two weeks ago</small>
                      <hr/>
                      <p>Summary: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste quaerat nostrum, nulla velit neque facere mollitia nemo ut earum tempora iure totam libero, amet doloribus aut, voluptatem nesciunt soluta? Reprehenderit...</p>
                      <div className="story-footer flex fs ac frn">
                        <span>Note</span>
                        <div className="stats">
                          <span><strong>13</strong> chapters</span>
                          <span><strong>20</strong> characters</span>
                        </div>
                        <span>128 <i className="fas fa-heart"></i></span>
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="story-block">
                      <h4>Titre de l'histoire</h4>
                      <small><span className="dot dot-in-progress"></span> In progress</small>
                      <small>Posted two weeks ago</small>
                      <hr/>
                      <p>Summary: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste quaerat nostrum, nulla velit neque facere mollitia nemo ut earum tempora iure totam libero, amet doloribus aut, voluptatem nesciunt soluta? Reprehenderit...</p>
                      <div className="story-footer flex fs ac frn">
                        <span>Note</span>
                        <div className="stats">
                          <span><strong>13</strong> chapters</span>
                          <span><strong>20</strong> characters</span>
                        </div>
                        <span>128 <i className="fas fa-heart"></i></span>
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="story-block">
                      <h4>Titre de l'histoire</h4>
                      <small><span className="dot dot-in-progress"></span> In progress</small>
                      <small>Posted two weeks ago</small>
                      <hr/>
                      <p>Summary: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste quaerat nostrum, nulla velit neque facere mollitia nemo ut earum tempora iure totam libero, amet doloribus aut, voluptatem nesciunt soluta? Reprehenderit...</p>
                      <div className="story-footer flex fs ac frn">
                        <span>Note</span>
                        <div className="stats">
                          <span><strong>13</strong> chapters</span>
                          <span><strong>20</strong> characters</span>
                        </div>
                        <span>128 <i className="fas fa-heart"></i></span>
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="story-block">
                      <h4>Titre de l'histoire</h4>
                      <small><span className="dot dot-in-progress"></span> In progress</small>
                      <small>Posted two weeks ago</small>
                      <hr/>
                      <p>Summary: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste quaerat nostrum, nulla velit neque facere mollitia nemo ut earum tempora iure totam libero, amet doloribus aut, voluptatem nesciunt soluta? Reprehenderit...</p>
                      <div className="story-footer flex fs ac frn">
                        <span>Note</span>
                        <div className="stats">
                          <span><strong>13</strong> chapters</span>
                          <span><strong>20</strong> characters</span>
                        </div>
                        <span>128 <i className="fas fa-heart"></i></span>
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="story-block">
                      <h4>Titre de l'histoire</h4>
                      <small><span className="dot dot-in-progress"></span> In progress</small>
                      <small>Posted two weeks ago</small>
                      <hr/>
                      <p>Summary: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste quaerat nostrum, nulla velit neque facere mollitia nemo ut earum tempora iure totam libero, amet doloribus aut, voluptatem nesciunt soluta? Reprehenderit...</p>
                      <div className="story-footer flex fs ac frn">
                        <span>Note</span>
                        <div className="stats">
                          <span><strong>13</strong> chapters</span>
                          <span><strong>20</strong> characters</span>
                        </div>
                        <span>128 <i className="fas fa-heart"></i></span>
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="story-block">
                      <h4>Titre de l'histoire</h4>
                      <small><span className="dot dot-in-progress"></span> In progress</small>
                      <small>Posted two weeks ago</small>
                      <hr/>
                      <p>Summary: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste quaerat nostrum, nulla velit neque facere mollitia nemo ut earum tempora iure totam libero, amet doloribus aut, voluptatem nesciunt soluta? Reprehenderit...</p>
                      <div className="story-footer flex fs ac frn">
                        <span>Note</span>
                        <div className="stats">
                          <span><strong>13</strong> chapters</span>
                          <span><strong>20</strong> characters</span>
                        </div>
                        <span>128 <i className="fas fa-heart"></i></span>
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="story-block">
                      <h4>Titre de l'histoire</h4>
                      <small><span className="dot dot-in-progress"></span> In progress</small>
                      <small>Posted two weeks ago</small>
                      <hr/>
                      <p>Summary: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste quaerat nostrum, nulla velit neque facere mollitia nemo ut earum tempora iure totam libero, amet doloribus aut, voluptatem nesciunt soluta? Reprehenderit...</p>
                      <div className="story-footer flex fs ac frn">
                        <span>Note</span>
                        <div className="stats">
                          <span><strong>13</strong> chapters</span>
                          <span><strong>20</strong> characters</span>
                        </div>
                        <span>128 <i className="fas fa-heart"></i></span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </section>
          </Col>
        </Row>
      </main>
    )
  }
}

Profile2.defaultProps = {
  
}

Profile2.propTypes = {
  
}

const mapStateToProps = (state) => ({
  loading: state.profile.loading
})

const mapDispatchToProps = {
  setProgressBar,
  getPrivateStories
}

export default compose(connect(mapStateToProps, mapDispatchToProps), firestoreConnect([]) )(Profile2)