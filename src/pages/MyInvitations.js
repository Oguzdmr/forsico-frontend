import React, { useEffect, useState } from "react";
import "../styles/myinvitations.css";
const config = require("../config");
import { useDispatch, useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import { fetchWorkspaces } from "../store/workspaceSlice";

const MyInvitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => {
    return state.auth.token.token;
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        const response = await fetch(
          `${config.boardApiBaseUrl}/invitation/my-invitations`,
          requestOptions
        );
        const data = await response.json();
        if (response.ok) {
          setInvitations(data.data);
        } else {
          console.error("Failed to load invitations", data);
        }
      } catch (error) {
        console.error("Error loading invitations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, []);

  const handleAccept = async (id) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `${config.boardApiBaseUrl}/invitation/accept/${id}`,
        requestOptions
      );
      if (response.ok) {
        setInvitations(
          invitations.filter((invitation) => invitation._id !== id)
        );
        dispatch(fetchWorkspaces());
      } else {
        console.error("Failed to accept invitation", await response.json());
      }
    } catch (error) {
      console.error("Error accepting invitation:", error);
    }
  };

  const handleDecline = async (id) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };
      const response = await fetch(
        `${config.boardApiBaseUrl}/invitation/decline/${id}`,
        requestOptions
      );
      if (response.ok) {
        setInvitations(
          invitations.filter((invitation) => invitation._id !== id)
        );
      } else {
        console.error("Failed to decline invitation", await response.json());
      }
    } catch (error) {
      console.error("Error declining invitation:", error);
    }
  };

  if (loading)
    return <TailSpin height="24" width="24" color="#fff" ariaLabel="loading" />;

  return (
    <div className="invitations-container">
      <h2>My Invitations</h2>
      {invitations.length === 0 ? (
        <p className="no-invitations">No pending invitations.</p>
      ) : (
        <div className="invitations-list">
          {invitations.map((invitation) => (
            <div key={invitation._id} className="invitation-card">
              <div className="invitation-info">
                <h3>{invitation.boardId.name}</h3>
                <p>
                  <strong>Workspace:</strong> {invitation.workspaceId.name}
                </p>
                <p>
                  <strong>Invited by:</strong> {invitation.inviterId.firstName}{" "}
                  {invitation.inviterId.lastName}
                </p>
              </div>
              <div className="invitation-actions">
                <button
                  className="accept-btn"
                  onClick={() => handleAccept(invitation._id)}
                >
                  Accept
                </button>
                <button
                  className="decline-btn"
                  onClick={() => handleDecline(invitation._id)}
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyInvitations;
