import React, { useState, useEffect, useRef } from "react";
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
import {
  fetchNotifications,
  readNotification,
  bulkReadNotifications,
  addNotification,
} from "../../store/notificationSlice";

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userInfo = useSelector((state) => state.auth.user);
  const workspaces = useSelector((state) => state.workspaces.entities);
  const notifications = useSelector((state) => state.notifications.entities);
  const notificationDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const [notificationDropdown, setNotificationDropdown] = useState(false);
  const [profileDropdown, setProfileDrodown] = useState(false);
  const [hasUnReadNotification, setHasUnReadNotification] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const workspaceIds = workspaces?.map((workspace) => workspace._id);
      const boardIds = workspaces
        ?.map((workspace) => {
          return workspace.boards?.map((board) => {
            return board._id;
          });
        })
        .filter(Boolean)
        .flat();

      dispatch(fetchNotifications({ workspaceIds, boardIds }));
    }
  }, [dispatch, isAuthenticated, workspaces]);

  useEffect(() => {
    if (isAuthenticated) {
      setHasUnReadNotification(
        notifications?.filter(
          (notification) => notification?.user?.id === userInfo.id
        ).length > 0
      );
    }
  }, [notifications]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3001");

    socket.onopen = () => {
      console.log("WebSocket bağlantısı kuruldu.");

      subscribeToChannels(workspaces, socket);
    };

    socket.onmessage = (event) => {
      console.log(event.data);
      dispatch(
        addNotification(
          JSON.parse((JSON.parse(event.data || "{}") || {}).message)
        )
      );
    };

    socket.onclose = () => {
      console.log("WebSocket bağlantısı kapandı.");
    };

    return () => {
      socket.close();
    };
  }, [workspaces]);

  const subscribeToChannels = (workspaces, socket) => {
    workspaces?.forEach((workspace) => {
      workspace.boards.forEach((board) => {
        const channelName = `workspace:${workspace._id}:board:${board._id}`;
  
        socket.send(JSON.stringify({ channels: [channelName] }));
      });
    });
  };
  

  const handleLogoutClick = () => {
    dispatch(logout());
  };

  const handleClickOutside = (event) => {
    if (
      notificationDropdownRef.current &&
      !notificationDropdownRef.current.contains(event.target)
    ) {
      setNotificationDropdown(false);
    }

    if (
      profileDropdownRef.current &&
      !profileDropdownRef.current.contains(event.target)
    ) {
      setProfileDrodown(false);
    }
  };

  const handleNotificationButtonChange = (e) => {
    setNotificationDropdown(e.target.checked);
  };

  const handleProfileButtonChange = (e) => {
    setProfileDrodown(e.target.checked);
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    console.log("selected item", item);
    console.log("select", selectedItem);
  };

  const handleNotificationClick = (workspaceId, notificationId) => {
    dispatch(
      readNotification({
        workspaceId: workspaceId,
        notificationId: notificationId,
      })
    );
  };

  const handleMarkAllAsRead = () => {
    dispatch(
      bulkReadNotifications({
        workspaceId: notifications[0]?.workspaceId,
        notificationIds: notifications.map((notification) => {
          return notification._id;
        }),
      })
    );
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

        {!isAuthenticated && (
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
        )}
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
              <input
                id="notification-dropdown-toggler"
                checked={notificationDropdown}
                onChange={handleNotificationButtonChange}
                type="checkbox"
              ></input>
              <label htmlFor="notification-dropdown-toggler">
                {hasUnReadNotification ? (
                  <img src={HasNotificationIcon}></img>
                ) : (
                  <img src={HasNotificationIcon}></img>
                )}
              </label>
              <div
                className="notification-dropdown"
                ref={notificationDropdownRef}
              >
                <div
                  className="notification-dropdown-header"
                  onClick={handleMarkAllAsRead}
                >
                  <p className="mark-all-as-read-button">Mark all as read!</p>
                </div>
                {notifications?.map((notification) => (
                  <Link
                    key={notification?._id}
                    to={`/workspaces/board/${notification.workspaceId}/${notification.boardId}/?selectedTask=${notification.taskId}`}
                  >
                    <li
                      notificationid={notification._id}
                      workspaceid={notification.workspaceId}
                      boardid={notification.boardId}
                      targetid={notification.targetId}
                      isread={
                        notification.readBy?.map((user) => {
                          user.id === userInfo.id;
                        }).length > 0
                          ? "true"
                          : "false"
                      }
                      onClick={() => {
                        handleNotificationClick(
                          notification.workspaceId,
                          notification._id
                        );
                      }}
                    >
                      <div className="notification-container">
                        <div className="notification-header">
                          <img
                            className="notification-image"
                            src={notification?.user?.profilePicture}
                          ></img>
                          <div className="notification-header-text">
                            {notification.message.split("::=>")[0].trim()}
                          </div>
                        </div>
                        <div className="notification-content">
                          {notification.message.includes("::=>")
                            ? notification.message
                                .split("::=>")
                                .slice(-1)[0]
                                ?.trim()
                            : ""}
                        </div>
                      </div>
                    </li>
                  </Link>
                ))}
              </div>
            </div>

            <div className="navbar-profile-button">
              <input
                id="profile-dropdown-toggler"
                checked={profileDropdown}
                onChange={handleProfileButtonChange}
                type="checkbox"
              ></input>
              <label htmlFor="profile-dropdown-toggler">
                <img
                  className="navbar-profile-image"
                  src={userInfo?.profilePictureUrl || ""}
                ></img>
              </label>
              <div className="profile-dropdown" ref={profileDropdownRef}>
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
