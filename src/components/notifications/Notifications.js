import React, { Component } from 'react'
import { array, func } from 'prop-types'
import { connect } from 'react-redux'
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { markAllAsRead, markOneAsRead, dismissAll } from '../../redux/actions/profileActions'

class Notifications extends Component {

  render() {
    const { notifications } = this.props
    const unreadNumber = notifications && notifications.filter(notif => !notif.read).length
    return (
      <main className="inner-main">
        <div className="notifications">
          <h2 className="text-center">Notifications</h2>
          <div className="upper-band flex spb ac frw">
            <h3><span className="notif-number">{unreadNumber}</span> notifications</h3>
            <div>
              <button className="custom-btn square btn mr-3" onClick={this.props.dismissAll}>Clear all</button>
              <button className="square btn secondary-btn" onClick={this.props.markAllAsRead}>Mark all as read</button>
            </div>
          </div>
          <hr />
          <div className="notif-list">
            { notifications.map(notif => (
              <React.Fragment key={notif.id}>
                <div className="notif flex spb ac frw">
                  <p>{notif.message}</p>
                  {notif.read ?
                  <i className="primary fas fa-check"></i>:
                  <button className="custom-btn" onClick={this.props.markOneAsRead.bind(this, notif.id)}>Mark as read</button>}
                </div>
                <hr />
              </React.Fragment>
            ))}
          </div>
        </div>
      </main>
    )
  }
}

Notifications.defaultProps = {
  notifications: []
}

Notifications.propTypes = {
  notifications: array.isRequired,
  markAllAsRead: func.isRequired,
  markOneAsRead: func.isRequired,
  dismissAll: func.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile,
  notifications: state.firebase.auth && state.firestore.ordered.notifications && state.firestore.ordered.notifications.filter(not => not.recipient === state.firebase.auth.uid).sort((a,b) => {
    a = new Date(a.createdAt);
    b = new Date(b.createdAt);
    return a > b ? -1 : a < b ? 1 : 0;
  })
})
export default compose(connect(mapStateToProps, { markAllAsRead, markOneAsRead, dismissAll }), firestoreConnect([{ collection: 'notifications' }]))(Notifications)