import React, { Fragment } from "react";
import CustomTooltip from '../hoc/CustomTooltip'
import story_icon from '../../images/tabs/compose.png'
import character_icon from '../../images/tabs/teamwork.png'
import location_icon from '../../images/tabs/placeholder.png'
import follower_icon from '../../images/tabs/followers.png'
import favorite_icon from '../../images/tabs/like.png'
import setting_icon from '../../images/tabs/gears.png'

const Tabs = ({ changeTab, id, changeTabSelect, auth, activeTab }) => {
  return (
    <Fragment>
      <div className="floating-tabs flex fc ac js">
        <img
          href="#"
          id="stories"
          className={`tab ${activeTab === 'stories' ? 'activeTab': ''}`}
          onClick={changeTab.bind(this, "stories")}
          src={story_icon}
          alt="stories"
        />
        <CustomTooltip placement="left" target="stories">
          Stories
        </CustomTooltip>
        <img
          id="characters"
          className={`tab ${activeTab === 'characters' ? 'activeTab' : ''}`}
          onClick={changeTab.bind(this, "characters")}
          src={character_icon}
          alt="characters"
        />
        <CustomTooltip placement="left" target="characters">
          Characters
        </CustomTooltip>
        <img
          id="locations"
          className={`tab ${activeTab === 'locations' ? 'activeTab' : ''}`}
          onClick={changeTab.bind(this, "locations")}
          src={location_icon}
          alt="locations"
        />
        <CustomTooltip placement="left" target="locations">
          Locations
        </CustomTooltip>
        <img
          id="followers"
          className={`tab ${activeTab === 'followers' ? 'activeTab' : ''}`}
          onClick={changeTab.bind(this, "followers")}
          src={follower_icon}
          alt="followers"
        />
        <CustomTooltip placement="left" target="followers">
          Followers
        </CustomTooltip>
        <img
          id="favorites"
          className={`tab ${activeTab === 'favorites' ? 'activeTab' : ''}`}
          onClick={changeTab.bind(this, "favorites")}
          src={favorite_icon}
          alt="favorites"
        />
        <CustomTooltip placement="left" target="favorites">
          Favorites
        </CustomTooltip>
        {!id && (
          <React.Fragment>
            <img 
            id="settings" 
            className={`tab ${activeTab === 'settings' ? 'activeTab' : ''}`} 
            onClick={changeTab.bind(this, 'settings')}
            src={setting_icon}
            alt="settings"
            />
            <CustomTooltip placement="left" target="settings">
              Settings
            </CustomTooltip>
          </React.Fragment>
        ) }
      </div>
      <div className="select responsive-tabs">
        <select name="tab" onChange={changeTabSelect}>
          <option value="stories">Stories</option>
          <option value="characters">Characters</option>
          <option value="locations">Locations</option>
          <option value="followers">Followers</option>
          <option value="favorites">Favorites</option>
          {!id && <option value="settings">Settings</option>}
        </select>
      </div>
    </Fragment>
  );
};

export default Tabs;
