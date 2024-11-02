import React, { useState, useEffect, useRef } from 'react';
import '../../styles/signUp.css';
import { TailSpin } from 'react-loader-spinner';
import Authentication from '../../api/AuthApi/authentication';
import Cross from "../../assets/cross-icon.svg";
import Google from "../../assets/google.svg";
import Microsoft from "../../assets/microsoft.svg";
import Username from "../../assets/fullNameInput.svg";
import Email from "../../assets/emailInput.svg";
import Password from "../../assets/passwordInput.svg";
import PasswordInputEye from "../../assets/passwordInputEye.svg";

const config = require("../../config");

const SignUpModal = ({ onClose, login }) => {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const authentication = new Authentication();
    const modalRef = useRef(null);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validateForm = () => {
        if (!userName || !fullName || !email || !password) {
            setErrorMessage('Tüm alanları doldurun');
            return false;
        }
        if (!validateEmail(email)) {
            setErrorMessage('Geçerli bir e-posta adresi girin');
            return false;
        }
        return true;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setErrorMessage("");

        const nameParts = fullName.trim().split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');

        try {
            const result = await authentication.register(userName, email, password, firstName, lastName);
            if (result.status === true) {
                onClose();
            } else {
                setErrorMessage(result.errors[0].errorMessage);
            }
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    };

    const handleGoogleButtonClick = () => {
        const url = config.authProdUrl + "/api/Auth/Google";
        window.open(url, "_blank");
    };

    const handleMicrosoftButtonClick = () => {
        const url = config.authProdUrl + "/api/Auth/Microsoft";
        window.open(url, "_blank");
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='signup-modal-container'>
            <div className='signup-modal-card' ref={modalRef}>
                <div className='signup-modal-close'>
                    <span><img className='signup-modal-close-icon' src={Cross} alt="Close" onClick={onClose}></img></span>
                </div>
                <div className='signup-modal-header'>
                    <div className='signup-modal-title'>
                        <span>Welcome to</span>
                        <span>Forsico!</span>
                    </div>
                    <div className='signup-modal-login'>
                        <span>Already have an account?</span>
                        <a className='signup-modal-login-link' onClick={login}>Login</a>
                    </div>
                </div>
                <div className='signup-modal-auth-options'>
                    <button className='signup-google-auth' onClick={handleGoogleButtonClick}>
                        <span><img className='signup-google-icon' src={Google} alt="Google"></img></span>
                    </button>
                    <span style={{ width: '20px' }}></span>
                    <button className='signup-microsoft-auth' onClick={handleMicrosoftButtonClick}>
                        <span><img className='signup-microsoft-icon' src={Microsoft} alt="Microsoft"></img></span>
                    </button>
                </div>
                <div className='signup-modal-separator'>
                    <span>or</span>
                </div>
                <div className={`signup-modal-input ${!userName && errorMessage ? 'error' : ''}`}>
                    <div className="input-icon-wrapper">
                        <img src={Username} className='input-icon' alt='Full Name Icon' />
                        <input
                            className={`signup-input-fullname ${!userName && errorMessage ? 'error' : ''}`}
                            type='text'
                            name='userName'
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                            placeholder='Username'
                        />
                    </div>
                </div>
                <div className='signup-modal-input'>
                    <div className='input-icon-wrapper'>
                        <img src={Username} className='input-icon' alt='Full Name Icon' />
                        <input
                            className='signup-input-fullname'
                            type='text'
                            name='fullname'
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            placeholder='Full name'
                        />
                    </div>
                </div>
                <div className={`signup-modal-input ${!validateEmail(email) && email !== '' ? 'error' : ''}`}>
                    <div className="input-icon-wrapper">
                        <img src={Email} className='input-icon' alt='Email Icon' />
                        <input
                            className={`signup-input-email ${!validateEmail(email) && email !== '' ? 'error' : ''}`}
                            type='email'
                            name='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder='Work e-mail address'
                        />
                        {!validateEmail(email) && email !== '' && (
                            <span className="signup-error-icon">
                                <img src="./input-error-icon.svg" alt="Error" />
                            </span>
                        )}
                    </div>
                </div>
                <div className={`signup-modal-input ${!password && errorMessage ? 'error' : ''}`}>
                    <div className="input-icon-wrapper">
                        <img src={Password} className='input-icon-left' alt='Password Icon' />
                        <input
                            id='password-input'
                            className={`signup-input-password ${!password && errorMessage ? 'error' : ''}`}
                            type={passwordVisible ? 'text' : 'password'}
                            name='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder='Password'
                        />
                        <img
                            src={PasswordInputEye}
                            className='input-icon-right'
                            alt='Toggle Visibility'
                            onClick={togglePasswordVisibility}
                        />
                    </div>
                </div>
                {errorMessage && (
                    <div className='signup-error-message'>
                        <p>{errorMessage}</p>
                    </div>
                )}
                <div className='signup-modal-terms'>
                    <p className='signup-terms-text'>
                        By clicking the continue button, you agree to our <a href='#'>Terms of Service</a> and <a href='#'>Privacy Policy</a>.
                    </p>
                </div>
                <div className='signup-modal-action'>
                    <button
                        type='button'
                        className='signup-submit-btn'
                        onClick={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <TailSpin height="24" width="24" color="#fff" ariaLabel="loading" />
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUpModal;
