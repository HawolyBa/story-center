import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { getStory, editStory, deleteStory, searchImages, nextpage, cleanup } from '../../../redux/actions/storyActions'
import { string, bool, func, shape, array, object } from 'prop-types'
import { Form, Button, FormGroup } from 'reactstrap'
import { languages, copyrights, status as statuses } from './metadatas'
import { Sentry } from 'react-activity';
import 'react-activity/lib/Sentry/Sentry.css';
import { Link } from 'react-router-dom'
import SimpleBar from 'simplebar-react';

import StoryBanner from '../StoryBanner'
import FlashMessage from '../../shared/FlashMessage'
import Private from '../../shared/Private'
import StoryForm from './StoryForm'
import ImageForm from './ImageForm'
import Gallery from './Gallery'
import Loading from '../../shared/Loading'
import NotFound from '../../shared/NotFound'

class EditStory extends Component {
  _isMounted = false;

  state = {
    checked: false,
    thumb: '',
    title: '',
    summary: '',
    alert: '',
    flash: false,
    message: '',
    banners: {
      photos: []
    },
    searchImage: '',
    isOpen: false,
    mature: false,
    filename: '',
    banner: '',
    imageCopyright: '',
    copyright: ''
  }
  
  componentDidMount() {
    this._isMounted = true;
    if (this._isMounted) {
      this.props.getStory(this.props.match.params.id)
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.props.cleanup()
  }

  componentDidUpdate(prevProps) {

    if (prevProps.banners !== this.props.banners ) {
      this.setState({banners: this.props.banners})
    }

    if (prevProps.imagesLoading !== this.props.imagesLoading) {
      this.setState({ imagesLoading: this.props.imagesLoading })
    }

    if (this.props.story !== prevProps.story) {
      this.setState({
        title: this.props.story.title,
        summary: this.props.story.summary,
        banner: this.props.story.banner,
        language: this.props.story.language,
        mature: this.props.story.mature,
        category: this.props.story.category,
        status: this.props.story.status,
        checked: this.props.story.public,
        tags: this.props.story.tags,
        copyright: this.props.story.copyright,
        imageCopyright: this.props.story.imageCopyright,
        thumb: this.props.story.banner
      })
    }
  }

  delete = e => {
    const confirmation = window.confirm('Do you really want to delete this story ? This action is definitive')
    if (confirmation) {
      this.props.deleteStory(this.props.match.params.id, this.props.history)
    }
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
    const reader = new FileReader();
    const banner = e.target.files[0]

    if (banner.name.includes('jpg') || banner.name.includes('png') || banner.name.includes('jpeg')) {
      reader.onload = (imgFile => {
        const image = new Image();
        image.src = imgFile.target.result

        image.onload = () => {
          if (image.width < 800 || image.width > 1600 || image.height < 600 || image.height > 1200) {
            this.setState({ flash: true, message: 'Your image does not respect the size requirements', alert: 'danger' })
            setTimeout(() => this.setState({ flash: false }), 3000)
          } else {
            this.setState({ banner, thumb: '', filename: banner.name, imageCopyright: '' })
          }
        }
      })
      reader.readAsDataURL(banner);
    } else {
      this.setState({ flash: true, message: 'The format of your image is not supported', alert: 'danger' })
      setTimeout(() => this.setState({ flash: false }), 3000)
    }
  }

  tagsChange = e => {
    this.setState({ tags: e.target.value.trim().split(',').map(c => `${encodeURIComponent(c.trim())}`)})
  }

  onSubmit = e => {
    e.preventDefault()
    let { checked, alert, flash, message, searchImage, banners, thumb, filename, isOpen,...remain } = this.state
    const tags = this.state.tags ? this.state.tags: []
    this.props.editStory(this.props.match.params.id, { ...remain, public: checked, tags }, this.props.storiesTitles)
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
      this.setState({ banner: banner.src.landscape, imageCopyright: banner.photographer, thumb: banner.src.tiny, filename: '' })
    } else if (this.state.banner && this.state.banner === banner.src.landscape) {
      this.setState({ banner: '', ImageCopyright: '', thumb: '' , filename: ''})
    } else if (this.state.banner && this.state.banner !== banner.src.landscape) {
      this.setState({ banner: banner.src.landscape, imageCopyright: banner.photographer, thumb: banner.src.tiny, filename: '' })
    }
  }

  triggerClick = e => {
    document.getElementById('addImage').click()
  }

  nextpage = url => {
    this.props.nextpage(url)
  }

  render() {
    const { categories, story, match, auth, UI, loading, notFound, errors } = this.props
    const { checked, mature, title, language, category, copyright, summary, tags, status, thumb, filename, imageCopyright, imagesLoading, banners, banner } = this.state
    return (
      <main className="inner-main inner-main-story">
      { !loading ?
        !notFound ?
        story && auth.uid === story.authorId ? 
        <React.Fragment>
        <div className="story">
          <StoryBanner story={story} id={match.params.id}/>
          <SimpleBar style={{ height: '80vh' }}>
            <div className="edit-story add-story">
              <div className="upper-band flex as spb">
                <Link className="square-btn primary-btn outlined" to={`/story/${match.params.id}`}>Back to story</Link>
              </div>
              <hr/>  
              <h2 className="text-center">Edit your story</h2>
              <Form>
                <StoryForm
                  categories={categories}
                  checked={checked}
                  errors={errors}
                  onSelect={this.onSelect}
                  languages={languages} 
                  copyrights={copyrights}
                  statuses={statuses}
                  status={status}
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
                  type="edit"
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
                <hr/>
                <div className="flex ac frn spb">
                  <FormGroup>
                  {
                    UI.loading ?
                    <Sentry/>:
                    <Button onClick={this.onSubmit} type="submit" className="square-btn primary-btn">Edit</Button>
                  }
                  </FormGroup>
                  <FormGroup>
                    <Button onClick={this.delete} className="square-btn danger-btn">Delete story</Button>
                  </FormGroup>
                </div>
              </Form>
            </div>
          </SimpleBar>
        </div>
        <FlashMessage flash={this.state.flash} message={this.state.message} alert={this.state.alert}/>
        </React.Fragment>:
        <Private data={auth} type={"Unauthorized"} /> :
        <NotFound /> :
        <Loading />
        }
      </main>
    )
  }
}

EditStory.defaultProps = {
  categories: [],
  story: {
    title: '',
    locationsCount: 0,
    public: false,
    likesCount: 0,
    createdAt: '',
    authorName: '',
    authorId: '',
    summary: '',
    id: '',
    chapters: [],
    note: 0,
    tags: []
  },
  banners: {}
}

EditStory.propTypes = {
  story: shape({
    authorId: string.isRequired,
    id: string.isRequired,
    title: string.isRequired,
    authorName: string.isRequired,
    public: bool.isRequired,
    banner: string,
    genre: string,
    language: string,
    rating: string,
    status: string,
    summary: string
  }).isRequired,
  getStory: func.isRequired,
  editStory: func.isRequired,
  deleteStory: func.isRequired,
  searchImages: func.isRequired,
  nextpage: func.isRequired,
  cleanup: func.isRequired,
  imagesLoading: bool.isRequired,
  banners: object.isRequired,
  auth: object.isRequired,
  UI: object.isRequired,
  categories: array.isRequired
}

const mapStateToProps = state => {
  return {
    story: state.story.story,
    categories: state.firestore.ordered.categories,
    UI: state.UI,
    auth: state.firebase.auth,
    banners: state.story.banners,
    imagesLoading: state.UI.imagesLoading,
    loading: state.story.loading,
    notFound: state.story.notFound, 
    errors: state.UI.errors,
    storiesTitles: state.firestore.ordered.stories && state.firestore.ordered.stories.filter(story => story.authorId === state.firebase.auth.uid).map(story => story.title).filter(title => title !== state.story.story.title)
  }
}

const mapDispatchToProps = {
  getStory, 
  editStory, 
  deleteStory, 
  searchImages,
  nextpage, 
  cleanup
}

export default compose(connect(mapStateToProps, mapDispatchToProps), firestoreConnect([ {collection: 'categories'}, { collection: 'stories' } ]))(EditStory)
