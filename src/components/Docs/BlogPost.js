import React from 'react'
import AiIcon from "../../assets/ai-icon.svg"
import "../../styles/docsCSS/blogPost.css"
import TEditor from '../Editor/TEditor'
import PenIcon from "../../assets/board-pen-icon.svg"





const BlogPost = () => {
  
  return (
    <div className='blogpost-main-container'>
      <div className='blogpost-main'>
        <div className='blogpost-title-area'>
          <div><img src={PenIcon} alt="pen" /></div>
          <div className='blogpost-title'><span className='blogpost-title-text'>Blog Post</span></div>
        </div>
      </div>
      <div className='blogpost-target-area'>
        <span className='blogpost-desc'>Target audience</span>
        <textarea className='blogpost-textarea' cols="30" rows="15" placeholder='e.g. Project managers for remote teach teams'></textarea>
      </div>
      <div className='blogpost-topic-area'>
        <span className='blogpost-desc'>Topic</span>
        <textarea className='blogpost-textarea' cols="30" rows="15" placeholder='e.g. 5 ways to improve communication with remote teams'></textarea>
      </div>
      <div className='blogpost-generate-button-area'>
        <button className='blogpost-generate-button'>Generate</button>
      </div>
      <div>
        <button className="create-docs-button">
          Create Document
        </button>
      </div>
    </div>
  )
}

export default BlogPost
