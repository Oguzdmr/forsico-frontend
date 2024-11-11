import React from 'react'
import AiIcon from "../../assets/ai-icon.svg"
import "../../styles/docsCSS/writeWithAi.css"
import TEditor from '../Editor/TEditor'


const WriteWithAi = () => {
  return (
   <div className='writewithai-main-container'>
    <div className='writewithai-main'>
        <div className='writewithai-title-area'>
          <div className='ai-icon'><img src={AiIcon} alt="ai-icon" /></div>
          <div className='writewithai-title'><span className='writewithai-title-text'>Write With AI</span></div>
        </div>
      </div>
      <div className='writewithai-desc-area'>
        <span className='writewithai-desc'>What would you like AI to write about?</span>
      </div>
      <div className='writewithai-text-area'>
        <textarea className='writewithai-textarea' cols="30" rows="15"></textarea>
      </div>
      <div className='writewithai-generate-button-area'>
        <button className='writewithai-generate-button'>Generate</button>
      </div>
      <div>
      <TEditor></TEditor>
      </div>
   </div>
  )
}

export default WriteWithAi
