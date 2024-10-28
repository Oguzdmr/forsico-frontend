import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../styles/workspaceCss/createboardmodal.css";
import BoardApi from "../../api/BoardApi/board.js";
const config = require("../../config");
import Cross from "../../assets/close.svg";
import { fetchWorkspaces } from "../../store/workspaceSlice";
import Penİcon from "../../assets/homepage-pen-icon.svg"
import Descİcon from "../../assets/create-board-modal-desc.svg"

const CreateBoardModal = ({ onClose, workspaceId }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState(''); // Error mesajı state
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
    console.log("modal")
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickCreate = async () => {
    let response = await boardApi.createBoard(token, workspaceId, name, description);
    if (response.status === true) {
      dispatch(fetchWorkspaces());
      onClose();
      navigate("/workspaces/board/" + workspaceId + "/" + response.data._id)
    }
  };

  return (
    <div className="create-board-modal-container">
      <div className="create-board-modal-card" ref={modalRef}>
        <div className="create-board-modal-close">
          <span>
            <img
              className="create-board-modal-close-icon"
              src={Cross}
              alt="Close"
              onClick={onClose}
            />
          </span>
        </div>
        <div className="create-board-modal-header">
          <div className="create-board-modal-title">
            <span>Let's create your Board!</span>
          </div>
        </div>
        <br />

        <div className={`create-board-modal-input`}>
          <div className="input-icon-wrapper create-board-name">
            <img className="create-board-pen-icon" src={Penİcon} alt="Pen" />
            <input
              className={`create-board-input-email`}
              type="email"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Type your board name ..."
            />
          </div>
        </div>
        <div className="create-board-modal-input">
          <div className="input-icon-wrapper create-board-desc-area">
            <img className="create-board-desc-icon" src={Descİcon} alt="Desc" />

            <textarea
              id="board-description-input"
              className="create-board-input-password"
              type="text"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Type your board description ..."
              style={{ height: "150px" }}
            />
          </div>
        </div>
        {errorMessage && (
          <div className="create-board-error-message">
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="create-board-modal-action">
          <button
            type="button"
            className="create-board-submit-btn"
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
