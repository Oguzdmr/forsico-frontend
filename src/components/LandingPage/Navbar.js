import React, { useState, useEffect, useRef, useCallback } from "react";
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
import NotificationIcon from "../../assets/has-no-notification.svg";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import { debounce } from "lodash";
import { RotatingLines } from "react-loader-spinner";
import flag from "../../assets/flag.svg";

import {
  fetchNotifications,
  readNotification,
  bulkReadNotifications,
  handleNotification,
} from "../../store/notificationSlice";

import { search, removeResults } from "../../store/searchSlice";

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userInfo = useSelector((state) => state.auth.user);
  const workspaces = useSelector((state) => state.workspaces.entities);
  const notifications = useSelector(
    (state) => state.notifications.pagedEntities
  );
  const searchResults = useSelector(
    (state) => state.searchResults?.pagedEntities
  );
  const [areSearchResultsLoading, setAreSearchResultsLoading] = useState(false);
  const searchResulstLastPage = useSelector(
    (state) => state.searchResults?.page
  );
  const searchResultsStatus = useSelector(
    (state) => state.searchResults?.status
  );
  const notificationDropdownRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const [notificationDropdown, setNotificationDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [hasUnReadNotification, setHasUnReadNotification] = useState(false);
  const [workspaceIds, setWorkspaceIds] = useState([]);
  const [boardIds, setBoardIds] = useState([]);
  const notificationLastPage = useSelector((state) => state.notifications.page);
  const [areNotificationsLoading, setAreNotificationsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && workspaces.length > 0) {
      const _workspaceIds = workspaces?.map((workspace) => workspace._id);
      const _boardIds = workspaces
        ?.map((workspace) => {
          return workspace.boards?.map((board) => {
            return board._id;
          });
        })
        .filter(Boolean)
        .flat();

      setBoardIds(_boardIds);
      setWorkspaceIds(_workspaceIds);

      dispatch(
        fetchNotifications({ workspaceIds: _workspaceIds, boardIds: _boardIds })
      );
    }
  }, [dispatch, isAuthenticated, workspaces]);

  useEffect(() => {
    if (isAuthenticated) {
      setHasUnReadNotification(
        notifications?.filter((notification) => {
          const readby = notification?.readBy?.map((readby) => {
            return readby.id || readby;
          });
          return !readby?.includes(userInfo.id);
        }).length > 0
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
      dispatch(
        handleNotification(
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
      setProfileDropdown(false);
    }
  };

  const handleNotificationButtonChange = (e) => {
    setNotificationDropdown(e.target.checked);
  };

  const handleProfileButtonChange = (e) => {
    setProfileDropdown(e.target.checked);
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
        notificationIds: notifications?.map((notification) => {
          return notification._id;
        }),
      })
    );
  };

  const debouncedSearch = useCallback(
    debounce((query, workspaceIds) => {
      dispatch(removeResults());

      if (query.length > 3) {
        dispatch(search({ workspaceIds, query, page: 1 }));
      }
    }, 500),
    []
  );

  const handleSearch = (e) => {
    const query = e.target.value || "";
    setSearchQuery(query);
    debouncedSearch(query, workspaceIds);
  };

  const handleSearchScroll = debounce((e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

    if (bottom) {
      setAreSearchResultsLoading(true);
      dispatch(
        search({
          workspaceIds: workspaceIds,
          query: searchQuery,
          page: searchResulstLastPage + 1,
          limit: 10,
        })
      )
        .then(() => {
          setAreSearchResultsLoading(false);
        })
        .catch(() => {
          setAreSearchResultsLoading(false);
        });
    }
  }, 500);

  const handleNotificationScroll = debounce((e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

    if (bottom) {
      setAreNotificationsLoading(true);
      dispatch(
        fetchNotifications({
          workspaceIds: workspaceIds,
          boardIds: boardIds,
          page: notificationLastPage + 1,
        })
      )
        .then(() => {
          setAreNotificationsLoading(false);
        })
        .catch(() => {
          setAreNotificationsLoading(false);
        });
    }
  }, 500);

  const handleSearchInputFocus = () => {
    setIsSearchDropdownOpen(true);
  };
  const handleSearchInputBlur = (e) => {
    if (!searchDropdownRef.current.contains(e.relatedTarget)) {
      setIsSearchDropdownOpen(false);
    }
  };

  const handleSearchResultLinkClick = () => {
    setIsSearchDropdownOpen(false);
    setSearchQuery("");
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
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={handleSearchInputFocus}
                  onBlur={handleSearchInputBlur}
                ></input>
                {isSearchDropdownOpen && (
                  <div
                    className="search-dropdown"
                    onScroll={handleSearchScroll}
                    ref={searchDropdownRef}
                  >
                    {searchResults?.length <= 0 || searchQuery.length < 3 ? (
                      <div className="is-empty-search">
                        {searchResultsStatus === "loading" ? (
                          <div>
                            <RotatingLines
                              height="40"
                              width="40"
                              radius="9"
                              strokeColor="#36C5F0"
                              ariaLabel="loading"
                              wrapperStyle
                              wrapperClass
                            />
                          </div>
                        ) : (
                          " You need to type at least 3 characters to search."
                        )}
                      </div>
                    ) : (
                      <div className="search-results">
                        {searchResults?.map((searchResult, index) => (
                          <Link
                            onClick={handleSearchResultLinkClick}
                            key={index}
                            to={`/workspaces/board/${searchResult.workspaceId}/${searchResult.boardId?._id}/?selectedTask=${searchResult._id}`}
                          >
                            <li className="search-result">
                              <div className="top">
                                <img
                                  alt="priority"
                                  className="priority-icon"
                                  src={flag}
                                ></img>
                                <h3 className="task-name">
                                  {searchResult.name}
                                </h3>
                              </div>
                              <div className="bottom">
                                <p className="board-name">
                                  {searchResult.boardId?.name}
                                </p>
                              </div>
                            </li>
                          </Link>
                        ))}
                      </div>
                    )}
                    <div>
                      {areSearchResultsLoading ? (
                        <div className="searchScroll">
                          <div>
                            <RotatingLines
                              height="40"
                              width="40"
                              radius="9"
                              strokeColor="#36C5F0"
                              ariaLabel="loading"
                              wrapperStyle
                              wrapperClass
                            />
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                )}
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
                  <img src={NotificationIcon}></img>
                )}
              </label>
              <div
                className="notification-dropdown"
                ref={notificationDropdownRef}
                onScroll={handleNotificationScroll}
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
                            {notification.message?.split("::=>")[0].trim()}
                          </div>
                        </div>
                        <div className="notification-content">
                          {notification.message?.includes("::=>")
                            ? notification.message
                                ?.split("::=>")
                                .slice(-1)[0]
                                ?.trim()
                            : ""}
                        </div>
                      </div>
                    </li>
                  </Link>
                ))}
                <div>
                  {areNotificationsLoading ? (
                    <div className="notificationScroll">
                      <div>
                        <RotatingLines
                          height="40"
                          width="40"
                          radius="9"
                          strokeColor="#36C5F0"
                          ariaLabel="loading"
                          wrapperStyle
                          wrapperClass
                        />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
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
