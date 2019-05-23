import React from 'react'
import { TumblrIcon, RedditIcon, TwitterIcon, FacebookIcon, PinterestIcon, FacebookShareButton, TwitterShareButton, RedditShareButton, TumblrShareButton, PinterestShareButton } from 'react-share';

const ShareButtons = ({ title, image }) => {
  return (
    <div className="share-icons flex frn ac mt-2">
      <TwitterShareButton
        url={String(window.location)}
        title={title}
        className="c-pointer mr-2">
        <TwitterIcon
          size={32}
          round />
      </TwitterShareButton>
      <FacebookShareButton
        url={String(window.location)}
        quote={title}
        className="c-pointer mr-2">
        <FacebookIcon
          size={32}
          round />
      </FacebookShareButton>
      <PinterestShareButton
        url={String(window.location)}
        media={image}
        windowWidth={1000}
        windowHeight={730}
        className="c-pointer mr-2">
        <PinterestIcon size={32} round />
      </PinterestShareButton>
      <RedditShareButton
        url={String(window.location)}
        title={title}
        windowWidth={660}
        windowHeight={460}
        className="c-pointer mr-2">
        <RedditIcon
          size={32}
          round />
      </RedditShareButton>
      <TumblrShareButton
        url={String(window.location)}
        title={title}
        windowWidth={660}
        windowHeight={460}
        className="c-pointer mr-2">
        <TumblrIcon
          size={32}
          round />
      </TumblrShareButton>
    </div>
  )
}

export default ShareButtons
