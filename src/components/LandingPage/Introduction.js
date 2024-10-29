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
                    <h2>Manage your business <br /> plan with <span>Forsico AI</span></h2>
                    <p>Create business plans with artificial <br /> intelligence, track your work, stay connected <br /> with your teammates</p>
                    <button>Get Started</button>
                </div>
                <div className='introduction-design'><img src={UpperRight} alt="" /></div>
            </div>
            <div className='introduction-board'>
                <div className='introduction-board-main'>
                    <div className='board-title-name bg-blue'><span className='board-title-name-text'>General</span></div>
                    <div className='board-title-name bg-turkuoise'><span className='board-title-name-text'>Doing</span></div>
                    <div className='board-title-name bg-green'><span className='board-title-name-text'>Done</span></div>
                </div>
                <div className='introduction-board-card-main'>
                    <div className='introduction-board-card board-card-icon'><img className='introduction-card-icon' src={İntroductionCard} alt="card" /></div>
                    <div className='introduction-board-card'></div>
                    <div className='introduction-board-card'></div>

                </div>
            </div>

        </div>
    );
};

export default Introduction;
