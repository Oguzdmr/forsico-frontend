import React, { useState, useRef } from "react";
import "../../styles/workspaceCss/inviteteammodal.css"; // CSS dosyası için uygun yol
import shareCopyIcon from"../../assets/shareCopyIcon.svg"

const InviteTeamModal = ({ onClose }) => {
  const [emailInput, setEmailInput] = useState(""); // Input alanı
  const [emails, setEmails] = useState([]); // Eklenen email listesi

  const handleAddEmail = (e) => {
    e.preventDefault();
    if (emailInput && !emails.includes(emailInput)) {
      setEmails([...emails, emailInput]); // Yeni e-posta ekleme
      setEmailInput(""); // Input'u sıfırlama
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmails(emails.filter((email) => email !== emailToRemove)); // E-posta silme
  };
  const linkInputRef = useRef(null);

  const handleCopyLink = async() => {
    if (linkInputRef.current) {
        await navigator.clipboard.writeText(linkInputRef.current.value);
      }
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
                <button className="share-copy-button" onClick={()=>handleCopyLink()}>
                  <img
                    src={shareCopyIcon}
                    alt="Copy"
                    className="share-copy-icon"
                  />
                </button>
            </div>
          </div>

          <div className="invite-team-line" ></div>
          <label className="invite-team-emails-label" >Invite with email adresses</label>
          <div className="invite-team-emails-container">
            
            {emails.map((email, index) => (
              <div key={index} className="invite-team-email-item">
                <span>{email}</span>
                <button onClick={() => handleRemoveEmail(email)}>
                  <img src="" alt="" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddEmail} className="invite-team-email-input-form">
            <input
              type="email"
              placeholder="Enter one or more email addresses"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
            <button type="submit">Add</button>
          </form>
        </div>

        <div className="invite-team-modal-footer">
          <button className="invite-team-back-button" onClick={onClose}>
            Back
          </button>
          <button className="invite-team-continue-button">Continue</button>
        </div>
      </div>
    </div>
  );
};

export default InviteTeamModal;
