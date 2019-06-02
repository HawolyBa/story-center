import React, { Fragment } from "react";

const Tabs = ({ changeTab, id, changeTabSelect, auth, activeTab }) => {
  return (
    <Fragment>
      <div className="floating-tabs mb-5">
        <div className="flex frn ac jc">
          <span className={`tab c-pointer ${activeTab === 'stories' ? 'activeTab': ''}`} onClick={changeTab.bind(this, "stories")}>
            Stories
          </span>
          <span className={`tab c-pointer ${activeTab === 'characters' ? 'activeTab': ''}`} onClick={changeTab.bind(this, "characters")}>
            Characters
          </span>
          <span className={`tab c-pointer ${activeTab === 'locations' ? 'activeTab': ''}`} onClick={changeTab.bind(this, "locations")}>
            Locations
          </span>
          <span className={`tab c-pointer ${activeTab === 'followers' ? 'activeTab': ''}`} onClick={changeTab.bind(this, "followers")}>
            Followers
          </span>
          <span className={`tab c-pointer ${activeTab === 'favorites' ? 'activeTab': ''}`} onClick={changeTab.bind(this, "favorites")}>
            Favorites
          </span>
          {!id && (
            <span className={`tab c-pointer ${activeTab === 'settings' ? 'activeTab': ''}`} onClick={changeTab.bind(this, "settings")}>
              Settings
            </span>
          ) }
        </div>
        <hr/>
      </div>
      <div className="select responsive-tabs mb-4">
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
