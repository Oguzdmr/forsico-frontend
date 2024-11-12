import React, { useState } from "react";
import "../../styles/Footer.css";
import fullNameIcon from "../../assets/footer-fullname-icon.svg";
import emailIcon from "../../assets/footer-email-icon.svg";
import linkedInIcon from "../../assets/linkedin-icon.svg";
import instagramIcon from "../../assets/instagram-icon.svg";
import twitterIcon from "../../assets/x-icon.svg";
import Support from "../../api/SupportApi/index";
import FooterLogo from "../../assets/forsico-logo.svg";
import { RotatingLines } from "react-loader-spinner";

const Footer = () => {
  const support = new Support();
  const [contactRequestLoader, setContactRequestLoader] = useState(false);
  const [showPrivacyLabel, setShowPrivacyLabel] = useState(false);
  const [ticketState, setTicketState] = useState({
    email: "",
    fullName: "",
    content: "",
    privacyAccepted: false,
  });

  const handleFullNameChange = (e) => {
    setTicketState((previousState) => ({
      ...previousState,
      fullName: e.target.value || "",
    }));
  };

  const handleContentChange = (e) => {
    setTicketState((previousState) => ({
      ...previousState,
      content: e.target.value || "",
    }));
  };

  const handleEmailChange = (e) => {
    setTicketState((previousState) => ({
      ...previousState,
      email: e.target.value || "",
    }));
  };

  const handlePrivacyChange = (e) => {
    setShowPrivacyLabel(false);
    setTicketState((previousState) => ({
      ...previousState,
      privacyAccepted: e.target.checked || false,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (ticketState.privacyAccepted) {
      setContactRequestLoader(true);
      support
        .createContactTicket(
          ticketState.content,
          ticketState.fullName,
          ticketState.email
        )
        .then(() => {
          setContactRequestLoader(false);
          setTicketState({
            email: "",
            fullName: "",
            content: "",
            privacyAccepted: false,
          });
        });
    } else {
      setShowPrivacyLabel(true);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row footer-container">
        <div className="col-lg-6 d-flex justify-content-center align-items-center">
          <div className="footText">
            <h2 className="footer-left-h2">Contact us for more information</h2>
            <p className="footer-left-p">
              Have questions, feedback, or need assistance? We’re here to help!
              Reach out to us, and our team will get back to you as soon as
              possible.
            </p>
          </div>
        </div>

        <div className="col-lg-6 d-flex justify-content-center">
          <form className="footer-form" type="post" onSubmit={handleFormSubmit}>
            <div className="input-group-footer">
              <img
                className="input-group-image"
                src={fullNameIcon}
                alt="fullname"
              />
              <input
                className="footer-input"
                type="text"
                value={ticketState.fullName}
                onChange={handleFullNameChange}
                placeholder="Full name"
                required
              />
            </div>

            <div className="input-group-footer">
              <img
                className="input-group-image"
                src={emailIcon}
                alt="fullname"
              />
              <input
                className="footer-input"
                type="email"
                value={ticketState.email}
                onChange={handleEmailChange}
                placeholder="E-Mail Address"
                required
              />
            </div>

            <div className="input-group-footer">
              <textarea
                className="footer-message"
                value={ticketState.content}
                onChange={handleContentChange}
                placeholder="Message"
                required
              ></textarea>
            </div>

            <div className="privacy-policy ">
              <input
                className="privacy-input"
                onChange={handlePrivacyChange}
                value={ticketState.privacyAccepted}
                checked={ticketState.privacyAccepted}
                type="checkbox"
                required
              />
              <label
                className="privacy-label"
                style={{ color: showPrivacyLabel ? "red" : "inherit", }}
              >
                I have read and accept the privacy policy.
              </label>
            </div>

            <button
              type="submit"
              className="send-btn"
              disabled={contactRequestLoader ? "disabled" : ""}
            >
              {contactRequestLoader ? (
                <>
                  {" "}
                  <RotatingLines
                    height="20"
                    width="20"
                    radius="9"
                    strokeColor="white"
                    ariaLabel="loading"
                    wrapperStyle
                    wrapperClass
                  />
                </>
              ) : (
                "Send"
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="row footer-bottom">
        <div className="col-lg-4 text-center text-lg-start my-4 my-lg-0">
          <a href="#" className="logo">
            <img className="footer-bottom-image" src={FooterLogo} alt="logo" />
          </a>
        </div>
        <div className="col-lg-4 text-center">
          <p className="footer-bottom-p">
            © 2024 Forsico. All rights reserved.
          </p>
        </div>
        <div className="col-lg-4">
          <div className="social-icons d-flex justify-content-center justify-content-lg-end">
            <a
              className="icon linkedin-icon footer-social-icon"
              href="https://www.linkedin.com/company/forsicoio/"
              target="_blank"
            >
              <img src={linkedInIcon} alt="linkedin" />
            </a>
            <a
              className="icon instagram-icon footer-social-icon"
              href="https://www.instagram.com/forsico.io/"
              target="_blank"
            >
              <img src={instagramIcon} alt="instagram" />
            </a>
            <a
              className="icon linkedin-icon footer-social-icon"
              href="https://x.com/forsicoio?s=21&t=x0z6d1vm-mTi9VXGXbnRsw"
              target="_blank"
            >
              <img src={twitterIcon} alt="x" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
