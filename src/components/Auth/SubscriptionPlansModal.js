import React, { useState, useEffect, useRef } from 'react';
import '../../styles/subscriptionmodal.css';

const config = require("../../config");

const SubscriptionPlansModal = ({ onClose, login }) => {
    

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='subscription-modal-container' ref={modalRef}>
            
        
        </div>
    );
};

export default SubscriptionPlansModal;