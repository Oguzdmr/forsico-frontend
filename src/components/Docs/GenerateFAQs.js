import React from 'react'
import "../../styles/docsCSS/generateFAQs.css"
import PenIcon from "../../assets/board-pen-icon.svg"


const GenerateFAQs = () => {

  
  return (
   <div className='generatefaqs-main-container'>
    <div className='generatefaqs-main'>
        <div className='generatefaqs-title-area'>
          <div><img src={PenIcon} alt="pen" /></div>
          <div className='generatefaqs-title'><span className='generatefaqs-title-text'>Genrate FAQs</span></div>
        </div>
      </div>
      <div className='generatefaqs-target-area'>
        <span className='generatefaqs-desc'>Target audience</span>
        <textarea className='generatefaqs-textarea' cols="30" rows="15" placeholder='e.g. Project managers for remote teach teams'></textarea>
      </div>
      <div className='generatefaqs-topic-area'>
        <span className='generatefaqs-desc'>Product Service</span>
        <textarea className='generatefaqs-textarea' cols="30" rows="15"></textarea>
      </div>
      <div className='generatefaqs-generate-button-area'>
        <button className='generatefaqs-generate-button'>Generate</button>
      </div>
      <div>
      <button className="create-docs-button">
                Create Document
              </button>
      </div>
   </div>
  )
}

export default GenerateFAQs
