import React from 'react'
import "../../styles/docsCSS/campaign.css"
import TEditor from '../Editor/TEditor'
import PenIcon from "../../assets/board-pen-icon.svg"


const CampaignIdeas = () => {
  return (
   <div className='campaign-main-container'>
    <div className='campaign-main'>
        <div className='campaign-title-area'>
          <div><img src={PenIcon} alt="pen" /></div>
          <div className='campaign-title'><span className='campaign-title-text'>Campaign Ideas</span></div>
        </div>
      </div>
      <div className='campaign-target-area'>
        <span className='campaign-desc'>Target audience</span>
        <textarea className='campaign-textarea' cols="30" rows="15" placeholder='e.g. Project managers for remote teach teams'></textarea>
      </div>
      <div className='campaign-topic-area'>
        <span className='campaign-desc'>Product Service</span>
        <textarea className='campaign-textarea' cols="30" rows="15"></textarea>
      </div>
      <div className='campaign-target-area'>
        <span className='campaign-desc'>Campaign/Service</span>
        <textarea className='campaign-textarea' cols="30" rows="15"></textarea>
      </div>
      <div className='campaign-generate-button-area'>
        <button className='campaign-generate-button'>Generate</button>
      </div>
   </div>
  )
}

export default CampaignIdeas
