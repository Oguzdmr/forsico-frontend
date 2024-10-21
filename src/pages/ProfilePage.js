import React, { useState, useRef } from 'react';
import '../styles/profilepage.css';
import Authentication from '../api/AuthApi/authentication.js';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import EditRightArrow from "../assets/edit-profile-right-arrow.svg"
import UsernameIcon from "../assets/edit-profile-username-icon.svg"
import EmailIcon from "../assets/edit-profile-email-icon.svg"
import BirthdayIcon from "../assets/edit-profile-birthday-icon.svg"

const Profile = () => {
    const dispatch = useDispatch();
    const authentication = new Authentication();
    const user = useSelector((state) => state.auth.user);
    const token = useSelector((state) => state.auth.token);

    const fileInputRef = useRef(null); // Reference to the file input

    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [email, setEmail] = useState(user?.email || '');
    const [username, setUsername] = useState(user?.userName || '');
    const [profile, setProfile] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        birthDate: user?.dateOfBirth || '',
        profileImage: user?.profileImage || './default-profile-image.jpg'
    });

    const [password, setPassword] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleImageClick = () => {
        fileInputRef.current.click(); // Trigger the file input when image is clicked
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfile({ ...profile, profileImage: event.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className='profile-page-main-div'>
            <div className='edit-profile-main'>
                <div className='edit-profile-title'>
                    <h2 className='edit-profile-title'>Edit Profile</h2>
                </div>
                <div className='edit-profile-form'>
                    <div className='edit-profile-image-area'>
                        <img
                            className='edit-profile-image'
                            src={profile.profileImage}
                            alt=""
                            onClick={handleImageClick} // Trigger file input on image click
                            style={{ cursor: 'pointer' }}
                        />
                        <input
                            type="file"
                            ref={fileInputRef} // Associate the input with the ref
                            onChange={handleImageChange}
                            style={{ display: 'none' }} // Hide the file input
                        />
                        <div className='btn-area'>
                            <button
                                className='image-area-edit-btn'
                                onClick={handleImageClick} // Same as clicking on the image
                            >
                                Edit
                            </button>
                            <button className='image-area-delete-btn'>Delete</button>
                        </div>
                    </div>

                    <div className='edit-profile-form-area'>
                        <div className='account-settings'>
                            <p className='gray-letter fs-18'>Account settings</p>
                            <div className='editprofile-line'></div>
                            <div className='edit-profile-area' onClick={() => setEditProfileOpen(!editProfileOpen)}>
                                <h3 className='edit-profile-h3 fs-18'>
                                    Edit profile
                                </h3>
                                <img src={EditRightArrow} alt="" />
                            </div>
                            {editProfileOpen && (
                                <div className='edit-profile-fields'>
                                    <div className='edit-profile-icon-div'>
                                        <img className='edit-profile-input-icon' src={UsernameIcon} alt="Username" />
                                        <input
                                            className='edit-profile-input'
                                            type="text"
                                            placeholder="User name"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                    <div className='edit-profile-icon-div'>
                                        <img className='edit-profile-input-icon' src={UsernameIcon} alt="FullName" />
                                        <input
                                            className='edit-profile-input'
                                            type="text"
                                            placeholder="Full name"
                                            value={`${profile.firstName} ${profile.lastName}`}
                                            onChange={(e) =>
                                                setProfile({
                                                    ...profile,
                                                    firstName: e.target.value.split(' ')[0],
                                                    lastName: e.target.value.split(' ')[1] || ''
                                                })
                                            }
                                        />
                                    </div>
                                    <div className='edit-profile-icon-div'>
                                        <img className='edit-profile-input-icon' src={EmailIcon} alt="email" />
                                        <input
                                            className='edit-profile-input'
                                            type="email"
                                            placeholder="e-mail address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className='edit-profile-icon-div'>
                                        <img className='edit-profile-input-icon' src={BirthdayIcon} alt="birthDay" />
                                        <input
                                            className='edit-profile-input'
                                            type="date"
                                            placeholder="Birthday"
                                            value={profile.birthDate}
                                            onChange={(e) =>
                                                setProfile({ ...profile, birthDate: e.target.value })
                                            }
                                        />
                                    </div>
                                    <button className='editprofile-update-button' onClick={() => {/* Update profile logic */ }}>Update</button>
                                </div>
                            )}
                            <div className='editprofile-line'></div>


                            <div className='edit-profile-area' onClick={() => setChangePasswordOpen(!changePasswordOpen)}>
                                <h3 className='edit-profile-h3 fs-18'>
                                    Change password
                                </h3>
                                <img src={EditRightArrow} alt="" />
                            </div>

                            {changePasswordOpen && (
                                <div className='change-password-fields'>
                                    <div>
                                        <input
                                            className='edit-profile-input'
                                            type="password"
                                            name="oldPassword"
                                            placeholder="Old Password"
                                            value={password.oldPassword}
                                            onChange={(e) =>
                                                setPassword({ ...password, [e.target.name]: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <input
                                            className='edit-profile-input'
                                            type="password"
                                            name="newPassword"
                                            placeholder="New Password"
                                            value={password.newPassword}
                                            onChange={(e) =>
                                                setPassword({ ...password, [e.target.name]: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div>
                                        <input
                                            className='edit-profile-input'
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                            value={password.confirmPassword}
                                            onChange={(e) =>
                                                setPassword({ ...password, [e.target.name]: e.target.value })
                                            }
                                        />
                                    </div>
                                    <button className='editprofile-update-button' onClick={() => {/* Update password logic */ }}>Update</button>
                                </div>
                            )}
                            <div className='editprofile-line'></div>


                            <div className='push-notifications'>
                                <label className='fs-18'>Push notifications</label>
                                <label className="toggle">
                                    <input className='push-notification-input' type="checkbox" />
                                    <span className='slider round'></span>
                                </label>
                            </div>

                            <div className='more'>
                                <div>
                                    <span className='edit-profile-p gray-letter fs-18'>More</span>
                                    <div className='editprofile-line'></div>

                                </div>

                                <div className='privacy-policy-title'>
                                    <h4 className='fs-18'>Privacy policy</h4>
                                    <img src={EditRightArrow} alt="" />
                                </div>
                                <div className='terms-and-conditions-title'>
                                    <h4 className='fs-18'>Terms and conditions</h4>
                                    <img src={EditRightArrow} alt="" />

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;