import React, { Component } from 'react'
import {  Input, Form, FormGroup, Button, Badge } from 'reactstrap'
import { submitComment, submitAnswer, deleteComment } from '../../../redux/actions/storyActions'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Link } from 'react-router-dom'
import { defaultAvatar } from '../../default/defaultImages'

import Moment from 'react-moment';

class Comments extends Component {

  state = { 
    toggleCommentForm: false,
    toggleAnswerForm: false,
    clickedForm: '',
    flash: false,
    showAnswer: false
  }
  
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  submitComment = e => {
    e.preventDefault()
    this.props.submitComment({
      content: this.state.content,
      storyId: this.props.params.id,
      chapterId: this.props.params.chapid,
      authorId: this.props.story.authorId
    })

    this.setState({ content: '', toggleCommentForm: false })
    e.target.content.value = ''
  }

  commentToggle = (id, e) => {
    this.setState({ toggleCommentForm: !this.state.toggleCommentForm, clickedForm: id })
  }

  deleteComment = (id, e) => {
    const confirm = window.confirm('Do you really want to delete your comment ?')
    if (confirm) this.props.deleteComment(id)
    this.setState({ flash: true })
  }

  answerToggle = (id, e) => {
    this.setState({ toggleAnswerForm: !this.state.toggleAnswerForm, clickedForm: id })
  }

  submitAnswer = (id, username, userId, e) => {
    e.preventDefault()
    this.props.submitAnswer({
      commentAnsweredId: id,
      answeredToId: userId,
      content: `@${username} ${this.state.content}`,
      storyId: this.props.params.id,
      chapterId: this.props.params.chapid,
      authorId: this.props.story.authorId,
      title: this.props.story.title,
      answeredTo: username
    })

    this.setState({ content: '', toggleCommentForm: false, toggleAnswerForm: false })
    e.target.content.value = ''
  }

  render(){
    const { comments, favoriteError, auth } = this.props
    return (
      <section className="comments">
        <h3 className="mb-4">Comments</h3>
          <Form onSubmit={this.submitComment} className="mb-5">
            <FormGroup>
              <textarea onInput={this.onChange} name="content"></textarea>
            </FormGroup>
            <button className="custom-btn">Submit</button>
          </Form>
          <p>
          { favoriteError ? <Badge color="danger">{favoriteError}</Badge>: null }</p>
          <div className="comments-block">
            { comments && comments.map(comment => (
              <div className="comment" key={comment.id}>
                <div className="comment-details">
                  <div className="comment-pic">
                    <Link to={`/profile/${comment.userId}`}>
                      <span style={{ backgroundImage: `url(${comment.userImage ? comment.userImage : defaultAvatar})` }}/>
                    </Link>
                  </div>
                  <small>
                    <Link className="username" to={`/profile/${comment.userId}`}>{ comment.username }</Link><br/>
                    <Moment format="YYYY-MM-DD, HH:mm">{new Date(comment.createdAt)}</Moment>
                  </small>
                </div>
                  <p>{ comment.content }</p>
                  <span className="answer" onClick={this.commentToggle.bind(this, comment.id)}>Answer</span>
                  { comment.userId === auth.uid ? <span className="delete" onClick={this.deleteComment.bind(this, comment.id)}>Delete</span>: null}
                <div>
                { this.state.clickedForm === comment.id && this.state.toggleCommentForm ? 
                  <Form className="mt-4" onSubmit={this.submitAnswer.bind(this, comment.id, comment.username, comment.userId)}>
                    <FormGroup>
                      <textarea onInput={this.onChange} name="content" placeholder={`@${comment.username}`}></textarea>
                    </FormGroup>
                    <button className="custom-btn">Submit</button>
                  </Form>:
                null }

                  { comment.answers && comment.answers.map(answer => (
                    <div className="comment-answer" key={answer.id}>
                      <div className="comment-details">
                        <div className="comment-pic">
                          <Link to={`/profile/${answer.userId}`}>
                            <span style={{ backgroundImage: `url(${answer.userImage ? answer.userImage : defaultAvatar})` }} />
                          </Link>
                        </div>
                      <small>
                        <Link className="username" to={`/profile/${answer.userId}`}>{ answer.username }</Link><br/>
                        <Moment format="YYYY-MM-DD, HH:mm">{new Date(answer.createdAt)}</Moment>
                      </small>
                    </div>
                    <p>{ answer.content }</p> 
                    <span className="answer" onClick={this.answerToggle.bind(this, answer.id)}>Answer</span>
                    { answer.userId === auth.uid ? <span className="delete" onClick={this.deleteComment.bind(this, answer.id)}>Delete</span>: null}
                    { this.state.clickedForm === answer.id && this.state.toggleAnswerForm ? 
                    <Form onSubmit={this.submitAnswer.bind(this, comment.id, answer.username, answer.userId)}>
                      <FormGroup>
                        <Input onInput={this.onChange} name="content" placeholder={`@${answer.username}`} type="textarea"/>
                      </FormGroup>
                    <Button>Submit</Button>
                  </Form>:
                null }
                    </div>
                  )) }

                </div>

              </div>
            )) }
        </div>
      </section>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
      favoriteError: state.auth.favoriteError,
      auth: state.firebase.auth
  }
}

export default compose(connect(mapStateToProps, { deleteComment, submitComment, submitAnswer }), firestoreConnect([{ collection: 'comments' }]))(Comments)
