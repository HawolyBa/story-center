import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import CharacterCards from './CharacterCards'
import LocationCards from './LocationCards'


const DataByStory = ({ data, type, match, toggle, lg, md, xs, auth, id, deleteLocation, comp }) => {
  return (data.locations && data.locations.length > 0) || (data.characters && data.characters.length > 0) ?
    <div className="itemStory mb-4 pl-2 pb-2 pr-2 pt-2" key={data.id}>
      <h5><Link to={`/story/${data.id}`}>{data && data.title}</Link></h5>
      <hr/>
      { type === 'characters' ?
        <CharacterCards lg={lg} md={md} xs={xs} auth={auth} match={match} characters={data.characters}/> :
        <LocationCards type={comp} deleteLocation={deleteLocation} id={id} lg={lg} md={md} xs={xs} locations={data.locations} toggle={toggle}/>
      }
    </div>:
    <Fragment></Fragment>
}

export default DataByStory