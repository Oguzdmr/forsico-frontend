import React from 'react';
import '../../styles/introduction.css'
import UpperRight from "../../assets/home-page-upper-right.svg"
import MiddleArea from "../../assets/home-page-middle-area.svg"
import İntroductionCard from "../../assets/introduction-card.svg"

const Introduction = () => {
    return (
        <div className='introduction-main-container'>
            <div className='introduction-main'>
                <div className='introdoction-get-start'>
                    <div className='intoduction-get-start-title'><h2 className='introduction-get-start-h2'>Manage projects effectively and<br/> efficiently with<span> Forsico AI</span></h2></div>
                    <div className='introduction-get-start-desc'><p className='intoduction-get-start-description'>Create business plans with artificial  intelligence, track your work, stay connected <br/> with your teammates</p></div>
                    <div className='introduction-get-start-button-div'><button className='introduction-get-start-button'>Get Started</button></div>
                </div>
                <div className='introduction-design'><img className='introduction-design-image' src={UpperRight} alt="" /></div>
            </div>
            <div className='introduction-board'>
                <div className='introduction-board-main'>
                    <div className='introduction-board-list'>
                        <div className='board-title-name bg-blue'><span className='board-title-name-text'>General</span></div>
                        <div className='introduction-board-card board-card-icon'><img className='introduction-card-icon' src={İntroductionCard} alt="card" /></div>
                    </div>
                    <div className='introduction-board-list'>
                        <div className='board-title-name bg-turkuoise'><span className='board-title-name-text'>Doing</span></div>
                        <div className='introduction-board-card'></div>
                    </div>
                    <div className='introduction-board-list'>
                    <div className='board-title-name bg-green'><span className='board-title-name-text'>Done</span></div>
                    <div className='introduction-board-card'></div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Introduction;
