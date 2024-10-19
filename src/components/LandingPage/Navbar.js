import React, { useState } from "react";
import LoginModal from "../Auth/LoginModal";
import SignUpModal from "../Auth/SignUpModal";
import ForgotPasswordModal from "../Auth/ForgotPasswordModal";
import Button from "npm-forsico-ui/dist/Button";
import Dropdown from "npm-forsico-ui/dist/Dropdown";
import "../../styles/navbar.css";
import { Link } from "react-router-dom";
import ForsicoLogoWhite from "../../assets/forsico-logo-white.svg";
import HasNotificationIcon from "../../assets/has-notification-icon.svg";
import NavbarSearchIcon from "../../assets/navbar-search-icon.svg";
import NotificationIcon from "../../assets/forsico-logo-white.svg";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userInfo = useSelector((state) => state.auth.user);

  const handleLogoutClick = () => {
    dispatch(logout());
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    console.log("selected item", item);
    console.log("select", selectedItem);
  };

  const projectItems = [
    { value: "1", label: "project 1", image: "", link: "/" },
    {
      value: "2",
      label: "project 2",
      image: "https://via.placeholder.com/24",
      link: "/",
    },
    {
      value: "3",
      label: "project 3",
      image: "https://via.placeholder.com/24",
      link: "/",
    },
  ];

  const solutionsItems = [
    { value: "1", label: "solutions 1", image: "", link: "/" },
    {
      value: "2",
      label: "solutions 2",
      image: "https://via.placeholder.com/24",
      link: "/",
    },
    {
      value: "3",
      label: "solutions 3",
      image: "https://via.placeholder.com/24",
      link: "/",
    },
  ];

  const pricingItems = [
    { value: "1", label: "pricing 1", image: "", link: "/" },
    {
      value: "2",
      label: "pricing 2",
      image: "https://via.placeholder.com/24",
      link: "/",
    },
    {
      value: "3",
      label: "pricing 3",
      image: "https://via.placeholder.com/24",
      link: "/",
    },
  ];

  const enterpriseItems = [
    { value: "1", label: "enterprise 1", image: "", link: "/" },
    {
      value: "2",
      label: "enterprise 2",
      image: "https://via.placeholder.com/24",
      link: "/",
    },
    {
      value: "3",
      label: "enterprise 3",
      image: "https://via.placeholder.com/24",
      link: "/",
    },
  ];

  return (
    <div className="navbar">
      <div className="navbar-leftside">
        <Link className="logo" to="/">
          <img src={ForsicoLogoWhite}></img>
        </Link>

        <div className="leftside-buttons">
          <Dropdown
            items={projectItems}
            onSelect={handleSelect}
            selectedItem={selectedItem}
            title="Project"
          />
          <Dropdown
            items={solutionsItems}
            onSelect={handleSelect}
            selectedItem={selectedItem}
            title="Solutions"
          />
          <Dropdown
            items={pricingItems}
            onSelect={handleSelect}
            selectedItem={selectedItem}
            title="Pricing"
          />
          <Dropdown
            items={enterpriseItems}
            onSelect={handleSelect}
            selectedItem={selectedItem}
            title="Enterprise"
          />
        </div>
      </div>
      <div className="navbar-rightside">
        {isAuthenticated ? (
          <>
            <div className="navbar-search-bar">
              <div className="input-wrapper">
                <img
                  src={NavbarSearchIcon}
                  className="navbar-search-icon"
                ></img>
                <input
                  type="text"
                  className="navbar-search-input"
                  placeholder="Search..."
                ></input>
              </div>
            </div>

            <div className="navbar-notification-button">
              <button className="notification">
                <img src={HasNotificationIcon}></img>
                {/*TODO add no notification svg with if check from notificationState*/}
              </button>
            </div>

            <div className="profile-button">
              <input id="profile-dropdown-toggler" type="checkbox"></input>
              <label for="profile-dropdown-toggler">
                <img
                  className="navbar-profile-image"
                  src={userInfo?.profilePictureUrl || ""}
                ></img>
              </label>
              <div className="profile-dropdown">
                <li>
                  <Link className="go-profile" to="/workspaces/profile">
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link className="go-profile" to="/workspaces/home">
                    My Workspaces
                  </Link>
                </li>
                <li>
                  <a className="go-profile" onClick={handleLogoutClick}>
                    Logout
                  </a>
                </li>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="rightside-button login">
              <Button
                Title="Login"
                onClick={() => setShowLoginModal(true)}
                style={{
                  backgroundColor: "#1C3C83",
                  color: "#FFF",
                  width: "100px",
                  height: "40px",
                  borderRadius: "20px",
                  border: "2px solid #FFF",
                  fontSize: "15px",
                }}
              />
            </div>
            <div className="rightside-button sign-up">
              <Button
                Title="Sign Up"
                onClick={() => setShowSignUpModal(true)}
                style={{
                  backgroundColor: "#36C5F0",
                  color: "white",
                  padding: "11px, 33px, 11px, 33px",
                  borderRadius: "20px",
                  width: "100px",
                  height: "40px",
                  fontSize: "15px",
                }}
              />
            </div>
          </>
        )}
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          signUp={() => {
            setShowLoginModal(false);
            setShowSignUpModal(true);
          }}
          forgotPassword={() => {
            setShowLoginModal(false);
            setShowForgotPasswordModal(true);
          }}
        />
      )}
      {showSignUpModal && (
        <SignUpModal
          onClose={() => setShowSignUpModal(false)}
          login={() => {
            setShowLoginModal(true);
            setShowSignUpModal(false);
          }}
        />
      )}
      {showForgotPasswordModal && (
        <ForgotPasswordModal
          onClose={() => setShowForgotPasswordModal(false)}
        />
      )}
    </div>
  );
};

export default Navbar;
