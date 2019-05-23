import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { addStory, searchImages, nextpage, cleanup } from '../../../redux/actions/storyActions'
import { Form, Button, FormGroup } from 'reactstrap'
import { languages, copyrights } from './metadatas'
import { sortAlpha } from '../../../utils/helpers'
import PropTypes from 'prop-types'
import { Sentry } from 'react-activity';
import 'react-activity/lib/Sentry/Sentry.css';

import Loading from '../../shared/Loading'
import StoryForm from './StoryForm';
import ImageForm from './ImageForm';
import Gallery from './Gallery';

export class AddStory extends Component {
  _isMounted = false;

  state = {
    checked: false,
    errors: {},
    imageCopyright: '',
    thumb: '',
    category: '',
    language: '',
    copyright: '',
    banner: '',
    mature: false,
    title: '',
    searchImage: '',
    isOpen: false,
    banners: {
      photos: []
    },
    filename: '',
    imagesLoading: false,
    tags: [],
    summary: ''
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.UI.errors !== this.state.errors) {
      if (this._isMounted) this.setState({ errors: nextProps.UI.errors })
    }
    if (nextProps.banners !== this.props.banners ) {
      this.setState({banners: nextProps.banners})
    }
    if (nextProps.imagesLoading !== this.state.imagesLoading) {
      this.setState({ imagesLoading: nextProps.imagesLoading })
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.props.cleanup()
  }

  switched = e => {
    this.setState({ checked: !this.state.checked })
  }

  turnMature = e => {
    this.setState({ mature: !this.state.mature })
  }

  onSelect = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  addBanner = e => {
    const banner = e.target.files[0]
    if (banner.name.includes('jpg') || banner.name.includes('png') || banner.name.includes('jpeg')) {
      this.setState({ banner, thumb: '', filename: banner.name, imageCopyright: '' })
    } else {
      this.setState({ flash: true, message: 'The format of your image is not supported', alert: 'alert-danger' })
      setTimeout(() => this.setState({ flash: false }), 3000)
    }
  }

  tagsChange = e => {
    this.setState({ tags: e.target.value.trim().split(',').map(c => `${encodeURIComponent(c.trim())}`)})
  }

  searchImages = e => {
    e.preventDefault()
    this.props.searchImages(this.state.searchImage)
  }

  setImage = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  chooseBanner = (banner, e) => {
    if (!this.state.banner) {
      this.setState({ banner: banner.src.original, imageCopyright: `${banner.photographer} (Pexels)`, thumb: banner.src.tiny, filename: '' })
    } else if (this.state.banner && this.state.banner === banner.src.original) {
      this.setState({ banner: '', ImageCopyright: '', thumb: '', filename: '' })
    } else if (this.state.banner && this.state.banner !== banner.src.original) {
      this.setState({ banner: banner.src.original, imageCopyright: `${banner.photographer} (Pexels)`, thumb: banner.src.tiny, filename: '' })
    }
  }

  triggerClick = e => {
    document.getElementById('addImage').click()
  }

  nextpage = url => {
    this.props.nextpage(url)
  }

  onSubmit = e => {
    e.preventDefault()
    let { imagesLoading, checked, errors, alert, flash, message, searchImage, banners, thumb, filename, isOpen, ...remain } = this.state
    const tags = this.state.tags ? this.state.tags : []
    this.props.addStory({ ...remain, public: checked, tags }, this.props.history)
  }

  render() {
    const { categories, auth, UI } = this.props
    const { errors, imagesLoading, checked, mature, thumb, filename, imageCopyright, banners, banner, title, language, category, copyright, summary, tags } = this.state
    return auth ?
    auth.emailVerified ?
      <main className="inner-main inner-main-add-story">
        <div className="add-story">
          <h2 className="text-center">Add a new story</h2>
          <Form>
            <StoryForm
              categories={categories}
              checked={checked}
              errors={errors}
              onSelect={this.onSelect}
              languages={languages} 
              copyrights={copyrights}
              tagsChange={this.tagsChange}
              switched={this.switched} 
              mature={mature} 
              turnMature={this.turnMature}
              title={title}
              language={language}
              category={category}
              copyright={copyright}
              summary={summary}
              tags={tags}
            />
            <ImageForm
              triggerClick={this.triggerClick}
              thumb={thumb} 
              filename={filename}
              addBanner={this.addBanner}
              errors={errors}
              imageCopyright={imageCopyright}
              onSelect={this.onSelect}
              setImage={this.setImage}
              searchImages={this.searchImages}
            />
            <Gallery
              imagesLoading={imagesLoading}
              banners={banners}
              banner={banner}
              chooseBanner={this.chooseBanner}
              nextpage={this.props.nextpage}
            />
            <hr />
            <FormGroup>
              {
                UI.loading ?
                <Sentry/>:
                <Button onClick={this.onSubmit} type="submit" className="square-btn primary-btn">Create</Button>
              }
            </FormGroup>
          </Form>
        </div>
      </main>:
      <div>Verify your email first</div>:
    <Loading/>
  }
}

AddStory.defaultProps = {
  categories: []
}

AddStory.propTypes = {
  categories: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  banners: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  imagesLoading: PropTypes.bool.isRequired,
  addStory: PropTypes.func.isRequired,
  searchImages: PropTypes.func.isRequired,
  nextpage: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  const cat = state.firestore.ordered.categories
  const categories = cat && sortAlpha(Array.from(cat))
  return {
    auth: state.firebase.auth,
    categories,
    UI: state.UI,
    banners: state.story.banners,
    errors: state.UI.errors,
    imagesLoading: state.UI.imagesLoading
  }
}

export default compose(connect(mapStateToProps, { addStory, searchImages, nextpage, cleanup }), firestoreConnect([ {collection: 'categories'} ]))(AddStory)
