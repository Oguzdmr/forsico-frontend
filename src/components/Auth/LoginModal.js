import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import '../../styles/loginModal.css';
import Authentication from '../../api/AuthApi/authentication.js';
const config = require("../../config");
import Cross from "../../assets/close.svg"
import Google from "../../assets/google.svg"
import Microsoft from "../../assets/microsoft.svg"
import Password from "../../assets/passwordInput.svg"
import Email from "../../assets/emailInput.svg"
import InputError from "../../assets/input-error-icon.svg"
import PasswordInputEye from "../../assets/passwordInputEye.svg"






const LoginModal = ({ onClose, signUp, forgotPassword }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // Error mesajı state
    const modalRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authentication = new Authentication();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setErrorMessage('Lütfen geçerli bir e-posta adresi girin');
            return;
        }

        const response = await authentication.login(email, password);

        if (response.success) {
            dispatch(
                setCredentials({
                    user: response.data.user,
                    token: response.data.token,
                })
            );

            onClose();
            navigate('/workspaces/home');
        } else {
            setErrorMessage(response.errors[0].errorMessage);
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
        <div className='login-modal-container'>
            <div className='login-modal-card' ref={modalRef}>
                <div className='login-modal-close'>
                    <span>
                        <img
                            className='login-modal-close-icon'
                            src={Cross}
                            alt='Close'
                            onClick={onClose}
                        />
                    </span>
                </div>
                <div className='login-modal-header'>
                    <div className='login-modal-title'>
                        <span>Welcome</span>
                        <span>back!</span>
                    </div>
                    <div className='login-modal-signup'>
                        <span>Don't have an account yet?</span>
                        <a className='login-modal-signup-link' onClick={signUp}>
                            Sign up
                        </a>
                    </div>
                </div>
                <div className='login-modal-auth-options'>
                    <button className='login-google-auth' onClick={handleGoogleButtonClick}>
                        <span>
                            <img
                                className='login-google-icon'
                                src={Google}
                                alt='Google'
                            />
                        </span>
                    </button>
                    <span style={{ width: '20px' }}></span>
                    <button className='login-microsoft-auth' onClick={handleMicrosoftButtonClick}>
                        <span>
                            <img
                                className='login-microsoft-icon'
                                src={Microsoft}
                                alt='Microsoft'
                            />
                        </span>
                    </button>
                </div>
                <div className='login-modal-separator'>
                    <span>or</span>
                </div>
                <div className={`login-modal-input ${!validateEmail(email) && email !== '' ? 'error' : ''}`}>
                    <div className="input-icon-wrapper">
                        <img
                            src={Email}
                            className="input-icon"
                            alt="Icon"
                        />
                        <input
                            className={`login-input-email ${!validateEmail(email) && email !== '' ? 'error' : ''}`}
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="E-posta adresiniz"
                        />
                        {!validateEmail(email) && email !== '' && (
                            <span className="login-error-icon">
                                <img src={InputError} alt="Error" />
                            </span>
                        )}
                    </div>
                </div>
                <div className='login-modal-input'>
                    <div className='input-icon-wrapper'>
                        <img
                            src={Password}
                            className='input-icon-left'
                            alt='Password Icon'
                        />
                        <input
                            id='password-input'
                            className='login-input-password'
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
                    <div className='login-error-message'>
                        <p>{errorMessage}</p>
                    </div>
                )}
                <div className='login-modal-options'>
                    <div className='login-remember-me'>
                        <input type='checkbox' className='login-remember-check'></input>
                        <p className='login-remember-text'>Remember me</p>
                    </div>
                    <a className='login-forgot-password' onClick={forgotPassword}>
                        Forgot password?
                    </a>
                </div>
                <div className='login-modal-action'>
                    <button type='button' className='login-submit-btn' onClick={handleLogin}>
                        Login
                    </button>
                </div>
                <div>
                    <a className='login-help-link' href='#'>
                        Help?
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;