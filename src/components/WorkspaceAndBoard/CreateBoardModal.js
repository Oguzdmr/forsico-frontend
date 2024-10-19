import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../styles/loginModal.css";
import BoardApi from "../../api/BoardApi/board.js";
const config = require("../../config");
import Cross from "../../assets/close.svg";
import InputError from "../../assets/input-error-icon.svg";
import PasswordInputEye from "../../assets/passwordInputEye.svg";

const CreateBoardModal = ({ onClose, workspaceId, forgotPassword }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const modalRef = useRef(null);

  const dispatch = useDispatch();
  const token = useSelector((state) => {
    return state.auth.token.token || "";
  });
  const navigate = useNavigate();
  const boardApi = new BoardApi();

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickCreate = async () => {
    let response = await boardApi.createBoard();
    if (response.status === true) {
      setWorkspaceIdState(response.data._id);
      dispatch(fetchWorkspaces());
    }
  };

  return (
    <div className="login-modal-container">
      <div className="login-modal-card" ref={modalRef}>
        <div className="login-modal-close">
          <span>
            <img
              className="login-modal-close-icon"
              src={Cross}
              alt="Close"
              onClick={onClose}
            />
          </span>
        </div>
        <div className="login-modal-header">
          <div className="login-modal-title">
            <span>Create</span>
            <span>Board!</span>
          </div>
        </div>

        <div className="login-modal-separator">
          <span>or</span>
        </div>
        <div className={`login-modal-input`}>
          <div className="input-icon-wrapper">
            <img src={Email} className="input-icon" alt="Icon" />
            <input
              className={`login-input-email`}
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Board İsmi Giriniz..."
            />
          </div>
        </div>
        <div className="login-modal-input">
          <div className="input-icon-wrapper">
            <img
              src={Password}
              className="input-icon-left"
              alt="Password Icon"
            />
            <textarea
              id="board-description-input"
              className="login-input-password"
              type="text"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Description"
            />
          </div>
        </div>
        {errorMessage && (
          <div className="login-error-message">
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="login-modal-action">
          <button
            type="button"
            className="login-submit-btn"
            onClick={handleClickCreate}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBoardModal;
