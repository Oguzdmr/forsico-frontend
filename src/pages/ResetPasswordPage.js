import React, { useState } from 'react';
import Authentication from '../api/AuthApi/authentication';
import '../styles/resetPasswordPage.css';
import Logo from "../assets/forsico-logo.svg"

const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [token, setToken] = useState(''); 
    const [message, setMessage] = useState(''); 
    const authentication = new Authentication();

    const handleResetPassword = async (e) => {
        e.preventDefault();

        try {
            const response = await authentication.resetPassword(email, token, newPassword);
            
            if (response.status === true) {
                setMessage("Şifre başarıyla sıfırlandı.");
            } else {
                setMessage(response.errors[0].errorMessage);
            }
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className='reset-password-container'>
            <div className='reset-password-card'>
                <div><img src={Logo} alt="" /></div>
                <h2 className='reset-password-title'>Reset Your Password</h2>
                <form onSubmit={handleResetPassword}>
                    <div className='input-group'>
                        <input
                            className='input-password'
                            type='password'
                            name='newPassword'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder='New Password'
                        />
                    </div>

                    {message && (
                        <div className='message'>
                            <p>{message}</p>
                        </div>
                    )}

                    <button type='submit' className='submit-btn'>Reset Password</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
