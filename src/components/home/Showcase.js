import React from 'react'

const Showcase = ({ stories, showSlide, history }) => {
  return (
    <section className="showcase mb-5">
      { stories.map((story, i) => (
        <div onClick={() => history.push(`/story/${story.id}`)} data-slide={`slide${i + 1}`} key={i} className={`slides ${i === 0 ? 'active': ''}`} id={`slide${i+1}`} style={{ backgroundImage: `url(${story.banner})` }}>
          <span className="featured-tag">Featured stories</span>
          <h2>{story.title}</h2>
        </div>
      )) }
      <div className="showcase-pagination"> 
        {stories.map((story, i) => (<span className={`pagination-btn ${i === 0 ? 'pagination-active': ''}`} key={i} onClick={showSlide} id={i+1}>{i + 1}</span> )) }
      </div>
    </section>
  )
}

export default Showcase
