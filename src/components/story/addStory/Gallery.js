import React from 'react'
import { Row, Col, Button } from 'reactstrap'
import { Sentry } from 'react-activity';
import 'react-activity/lib/Sentry/Sentry.css';

import CustomTooltip from '../../hoc/CustomTooltip'

const Gallery = ({ imagesLoading, banners, banner, chooseBanner, nextpage }) => {
  return (
    <div className="gallery">
      { imagesLoading ? <Sentry/> :
      banners.total_results > 0 ?
        <Row className="mt-4">
          {banners.photos.length > 0 && banners.photos.map(bann => (
          <Col md="3" 
            sm="6"
            xs="6"
            key={bann.id} 
            onClick={chooseBanner.bind(this, bann)}
            >
            <div href='#' id={`banner-${bann.id}`} className={`banner ${banner && banner !== bann.src.landscape && 'greyscale'} ${banner && banner === bann.src.landscape && 'scale'}`} style={{backgroundImage: `url(${bann.src.medium})`}} />
            <CustomTooltip placement="top" target={`banner-${bann.id}`}>
              <img src={bann.src.original} width="100%" alt=""/>
            </CustomTooltip>
          </Col>
          ))}
        </Row>:
        banners.hasOwnProperty('total_results') ?
        <p className="mt-2">No results</p>:
        null}
        {banners.photos.length > 0 && <nav className="chap-nav flex spb ac frn">
          <Button className={!banners.prev_page ? 'hidden': null} size="sm" outline onClick={nextpage.bind(this, banners.prev_page)}>
            Prev
          </Button>
          <Button className={!banners.next_page ? 'hidden': null} size="sm" outline onClick={nextpage.bind(this, banners.next_page)}>
            Next
          </Button>
        </nav>}
    </div>
  )
}

export default Gallery
