import React from "react";
import Tabs from "./Tabs";
import { Button } from 'reactstrap'
import { Sentry } from 'react-activity';
import 'react-activity/lib/Sentry/Sentry.css';
import { defaultAvatar } from '../default/defaultImages'
import Report from '../shared/Report';
import ProfileLoading from './ProfileLoading'

const Banner = ({ changeTab, user, changeAvatar, triggerClick, id, auth, toggleFollow, verifyEmail, isFavorite, changeTabSelect, UI, loading, handleSize, orientation}) => {
  return (
    <section className="banner">
    {!loading ? 
      <div className="inner-banner flex spb ac frw">
        <div className="left-col flex fc ac jc">
          {!id ? <div className={`avatar mb-3 flex jc ac fc ${orientation}`} onClick={triggerClick}>
            { UI.loading ?
              <Sentry/>:
              <React.Fragment>
                <input id="changeAvatar" onChange={changeAvatar} name="banner" hidden type="file" />
                <img id="userImage" src={user.image ? user.image : defaultAvatar} alt={user.username} />
              </React.Fragment> }
          </div>:
          <div className={`mb-3 flex jc ac fc ${orientation}`}>
            <img src={user.image ? user.image : defaultAvatar} alt={user.username}/>
          </div>
          }
          {!id && !auth.emailVerified && (
            <Button outline color="danger" size="sm" onClick={verifyEmail}>
              Verify your email
            </Button>
          )} 
          {((id && auth.uid !== user.id) || (id && !auth.uid)) && <Report type="profile" data={user} />}
        </div>
        <div className="right-col">
          <header className="author-name flex spb afs">
            <h2>{user.username}</h2>
            {(id && (auth.uid !== id)) && (
              <button className={`follow-btn ${isFavorite ? 'follow-btn-outlined': 'follow-btn-full'}`} onClick={toggleFollow}>{isFavorite ? 'Unfollow': 'Follow'}</button>
            )}
          </header>
          <div className="stats">
            <span className="mr-2">
              <strong>{user.stories.length}</strong>{" "}
              {user.stories.length > 1 ? "stories" : "story"}
            </span>
            <span className="mr-2">
              <strong>{user.likesCount}</strong>{" "}
              {user.likesCount > 1 ? "followers" : "follower"}
            </span>
            <span>
              <strong>{user.favorites.followings && user.favorites.followings.length}</strong> 
              {" "} favorite author
              {user.favorites.followings && user.favorites.followings.length > 1 ? "s" : ""}
            </span>
          </div>
          <hr/>
          <p className="biography">{user.biography}</p>
          <div className="social flex fs ac mt-3">
            {user.twitter && 
              <div className="icon twitter">
                <a href={user.twitter} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter" />
                </a>
              </div>
            }
            {user.facebook &&
              <div className="icon facebook">
                <a href={user.facebook} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook" />
                </a>
              </div>
            }
            {user.instagram &&
              <div className="icon instagram">
                <a href={user.instagram} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram" />
                </a>
              </div>
            }
          </div>
        </div>
        <Tabs changeTab={changeTab} changeTabSelect={changeTabSelect} id={id} />
      </div>:
      <ProfileLoading/>}
    </section>
  );
};

export default Banner;
