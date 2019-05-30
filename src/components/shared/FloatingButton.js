import React from 'react'
import { Link } from 'react-router-dom'
import { siteName, slogan } from '../../config/keys'

import NewLocation from './NewLocation'
import Feedback from './Feedback'
import CustomTooltip from '../hoc/CustomTooltip'

const FloatingButton = (props) => {

  const triggerClick = () => {
    document.getElementById('add-location-btn').click()
  }

  const getWindowOptions = () => {
    const width = 500;
    const height = 350;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);

    return [
      'resizable,scrollbars,status',
      'height=' + height,
      'width=' + width,
      'left=' + left,
      'top=' + top,
    ].join();
  };

  const text = encodeURIComponent(`${siteName} - ${slogan}`);
  const shareUrl = 'https://twitter.com/intent/tweet?url=' + window.location.href + '&text=' + text;
  return (
    <div className="floating-add">
      <div className="floating-btn-group">
        <div className="float c-pointer" id="menu-share">
          <i className="fas fa-ellipsis-v my-float"></i>
        </div>
        <ul>
          <li id="sharefb" className="floating-facebook">
            <i className="fab fa-facebook"></i>
            <CustomTooltip placement="left" target="sharefb">
              Share this on Facebook
            </CustomTooltip>
          </li>
          <li className="floating-twitter" id="sharetwi" onClick={() => window.open(shareUrl, 'ShareOnTwitter', getWindowOptions())}>
            <i className="fab fa-twitter"></i>
            <CustomTooltip placement="left" target="sharetwi">
              Share this on Twitter
            </CustomTooltip>
          </li>
          {props.userId &&
          <React.Fragment>
            <li id="sendfeedback">
              <Feedback userId={props.userId} type='floating' />
              <CustomTooltip placement="left" target="sendfeedback">
                Send feedback
              </CustomTooltip>
            </li>
            <li id="addlocation" onClick={triggerClick}>
              <NewLocation type="floating" />
              <CustomTooltip placement="left" target="addlocation">
                Add a new location
              </CustomTooltip>
            </li>
            <li id="addcharacter">
              <Link to={'/character/add'}>
                <i className="fas fa-user-plus"></i>
              </Link>
              <CustomTooltip placement="left" target="addcharacter">
                Add a new character
              </CustomTooltip>
            </li>
            <li id="addstory">
              <Link to={'/story/add'}>
                <i className="fas fa-pen-alt"></i>
              </Link>
              <CustomTooltip placement="left" target="addstory">
                Add a new story
              </CustomTooltip>
            </li>
          </React.Fragment>
          }
        </ul>
      </div>
    </div>
  )
}

export default FloatingButton