import React from 'react'
import "../../styles/docsCSS/seoArticleBrief.css"
import PenIcon from "../../assets/board-pen-icon.svg"


const SeoArticleBrief = () => {

  
  return (
   <div className='seoarticlebrief-main-container'>
    <div className='seoarticlebrief-main'>
        <div className='seoarticlebrief-title-area'>
          <div><img src={PenIcon} alt="pen" /></div>
          <div className='seoarticlebrief-title'><span className='seoarticlebrief-title-text'>SEO Article Brief</span></div>
        </div>
      </div>
      <div className='seoarticlebrief-target-area'>
        <span className='seoarticlebrief-desc'>Target audience</span>
        <textarea className='seoarticlebrief-textarea' cols="30" rows="15" placeholder='e.g. Project managers for remote teach teams'></textarea>
      </div>
      <div className='seoarticlebrief-topic-area'>
        <span className='seoarticlebrief-desc'>Product Service</span>
        <textarea className='seoarticlebrief-textarea' cols="30" rows="15"></textarea>
      </div>
      <div className='seoarticlebrief-target-area'>
        <span className='seoarticlebrief-desc'>Campaign/Service</span>
        <textarea className='seoarticlebrief-textarea' cols="30" rows="15"></textarea>
      </div>
      <div className='seoarticlebrief-generate-button-area'>
        <button className='seoarticlebrief-generate-button'>Generate</button>
      </div>
      <div>
      <button className="create-docs-button">
                Create Document
              </button>
      </div>
   </div>
  )
}

export default SeoArticleBrief
