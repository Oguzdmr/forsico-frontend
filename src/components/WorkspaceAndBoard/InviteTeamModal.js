import React, { useState, useRef } from "react";
import "../../styles/workspaceCss/inviteteammodal.css";
import shareCopyIcon from "../../assets/shareCopyIcon.svg";
import cancelIcon from "../../assets/cancel.svg";
import emailIcon from "../../assets/emailIcon.svg";
import Invitation from "../../api/BoardApi/invitation";

const InviteTeamModal = ({ onClose, workspaceId, token, boardId, userId }) => {
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState([]);
  const [error, setError] = useState("");
  const invitationService = new Invitation();

  const handleAddEmail = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailInput) return;
    if (!emailRegex.test(emailInput)) {
      setError("Geçerli bir e-posta adresi girin.");
      return;
    }
    if (emails.includes(emailInput)) {
      setError("Bu e-posta zaten eklenmiş.");
      return;
    }

    setEmails([...emails, emailInput]);
    setEmailInput("");
    setError("");
  };
  const handleEnterPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddEmail(e);
    }
  };
  const handleRemoveEmail = (emailToRemove) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };
  const linkInputRef = useRef(null);

  const handleCopyLink = async () => {
    if (linkInputRef.current) {
      await navigator.clipboard.writeText(linkInputRef.current.value);
    }
  };

  const handleInvite = async () => {
    invitationService.sendInvitation(token, workspaceId, boardId, userId, emails);
  };

  return (
    <div className="invite-team-modal-container">
      <div className="invite-team-modal-content">
        <button className="invite-team-modal-close" onClick={onClose}>
          X
        </button>
        <div className="invite-team-modal-header">
          <h2>Invite your team members</h2>
        </div>

        <div className="invite-team-modal-body">
          <div className="invite-team-input-group">
            <label>Invite with connection link</label>
            <div className="invite-team-link-container">
              <input
                type="text"
                value={window.location.href.split("?")[0]}
                readOnly
                className="share-link-input"
                ref={linkInputRef}
              />
              <button
                className="share-copy-button"
                onClick={() => handleCopyLink()}
              >
                <img
                  src={shareCopyIcon}
                  alt="Copy"
                  className="share-copy-icon"
                />
              </button>
            </div>
          </div>

          <div className="invite-team-line"></div>
          <label className="invite-team-emails-label">
            Invite with email adresses
          </label>
          <div className="invite-team-emails-container">
            {emails.map((email, index) => (
              <div key={index} className="invite-team-email-item">
                <span>{email}</span>
                <button onClick={() => handleRemoveEmail(email)}>
                  <img src={cancelIcon} alt="" />
                </button>
              </div>
            ))}
          </div>

          <form className="invite-team-email-input-form">
            <img src={emailIcon} alt="" />
            <textarea
              type="email"
              placeholder="Enter one or more email addresses"
              value={emailInput}
              onKeyDown={(e) => handleEnterPress(e)}
              onChange={(e) => setEmailInput(e.target.value)}
            />
          </form>
          {error && <p className="invite-team-error">{error}</p>}
        </div>

        <div className="invite-team-modal-footer">
          <button
            className="invite-team-continue-button"
            onClick={handleInvite}
          >
            Add Members
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteTeamModal;
