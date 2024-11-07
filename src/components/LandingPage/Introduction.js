import React from 'react';
import '../../styles/introduction.css'
import '../../styles/bootstrap-grid.min.css'
import UpperRight from "../../assets/home-page-upper-right.svg"
import MiddleArea from "../../assets/home-page-middle-area.svg"
import İntroductionCard from "../../assets/introduction-card.svg"

const Introduction = () => {
    return (
        <div className='container'>

            <div className='row mt-5'>
                <div className='col-lg-8 mb-5'>
                    <div className='introdoction-get-start'>
                        <h2>Manage your business plan with <span>Forsico AI</span></h2>
                        <p>Create business plans with artificial intelligence, track your work, stay connected with your teammates</p>
                        <button>Get Started</button>
                    </div>
                </div>
                <div className='col-lg-4 mb-5'>
                    <div className='introduction-design'><img src={UpperRight} alt="" /></div>
                </div>
            </div>

            <div className='row'>
                <div className='col-lg-4 mb-5'>
                    <div className='board-title-name bg-blue mb-4'><span className='board-title-name-text'>General</span></div>

                    <div className='introduction-board-card board-card-icon'>
                        <img className='introduction-card-icon' src={İntroductionCard} alt="card" />
                    </div>
                </div>
                <div className='col-lg-4 mb-5'>
                    <div className='board-title-name bg-turkuoise mb-4'><span className='board-title-name-text'>Doing</span></div>

                    <div className='introduction-board-card'></div>
                </div>
                <div className='col-lg-4 mb-5'>
                    <div className='board-title-name bg-green mb-4'><span className='board-title-name-text'>Done</span></div>

                    <div className='introduction-board-card'></div>
                </div>
            </div>

        </div>
    );
};

export default Introduction;
