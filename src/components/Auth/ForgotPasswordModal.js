import React, { useState, useEffect, useRef } from 'react';
import Authentication from '../../api/AuthApi/authentication';
import '../../styles/forgatPassMoadal.css';
import CrossIcon from "../../assets/cross-icon.svg"
import EmailIcon from "../../assets/emailInput.svg"

const ForgotPasswordModal = ({ onClose, login, signup }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(''); 
    const authentication = new Authentication();
    const modalRef = useRef(null); // Ref to track modal

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        try {
            const response = await authentication.forgotPassword(email);
            
            if (response.status === true) {
                setMessage("Email başarıyla gönderildi.");
            } else {
                setMessage(response.errors[0].errorMessage);
            }
        } catch (error) {
            setMessage(error.message);
        }
    };

    // Close modal on click outside
    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='forgotpassword-modal-container'>
            <div className='forgotpassword-modal-card' ref={modalRef}>
                <div className='login-modal-close'>
                    <span><img className='login-modal-close-icon' src={CrossIcon} alt="Close" onClick={onClose}></img></span>
                </div>
                <div className='login-modal-header'>
                    <div className='forgotpassword-modal-title'>
                        <span className='forgotpassword-title'>Forgot</span>
                        <span className='forgotpassword-title'>Password</span>
                    </div>
                </div>
                <div className='forgotpassword-subtitle'><span className='gray-letter'>Please enter the email you use to sign in to forsico</span></div>
                <div className='forgotpassword-modal-input'>
                    <div className='input-icon-wrapper'>
                        <img src={EmailIcon} className='input-icon' alt='Email Icon' />
                        <input
                            className='login-input-email'
                            type='email'
                            name='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder='Work e-mail address'
                        />
                    </div>
                </div>

                {message && (
                    <div className='login-modal-message'>
                        <p>{message}</p>
                    </div>
                )}

                <div className='forgotpassword-modal-action'>
                    <button type='button' className='forgot-password-btn' onClick={handleForgotPassword}>Send Email</button>
                </div>
                <div className='forgotpassword-line'></div>
                <div className='button-lower-area'>
                    <span className='gray-letter'>Already have an account?<a className='signup-modal-login-link' onClick={login} >Login</a></span>
                    <span className='gray-letter'>Don't have an account yet?<a className='signup-modal-login-link' onClick={signup}>Sign Up</a></span>
                </div>
            </div>
        </div>
    );
};
export default ForgotPasswordModal;