import React from 'react'
import { Link } from 'react-router-dom'

import StoriesCards from '../shared/StoriesCards'

import styled, { keyframes } from 'styled-components';
import fadeIn from 'react-animations/lib/fadeIn'
import StoryList from '../shared/StoryList';
const animation = keyframes`${fadeIn}`;
const AnimatedSection = styled.section`
  animation: 0.6s ${animation}
`;


const Stories = ({ stories, auth, id, changeView, activeView }) => {
  return (
    <AnimatedSection className="stories">
      <div className="flex frw spb ac mb-4">
        <h5>{stories && stories.length} {stories && stories.length > 1 ? 'stories': 'story'}</h5>
        {!id && <Link className="custom-btn" to='/story/add'><i className="fas fa-plus-circle"></i> Add a new story</Link>}
      </div>
      <div className="flex spb fe ac mb-3 sort">
        <span>View:</span>
        <i onClick={changeView.bind(this, "grid")} className="fas fa-th c-pointer ml-3 mr-2"></i> 
        <i onClick={changeView.bind(this, "list")} className="fas fa-list c-pointer"></i>
      </div>
      { stories.length > 0 ?
        activeView === 'grid'?
        <StoriesCards auth={auth} type="profile" stories={stories} />:
        <StoryList stories={stories} auth={auth} type="profile"/>:
        <p>No story for the moment</p>
      }
    </AnimatedSection>
  )
}

export default Stories
