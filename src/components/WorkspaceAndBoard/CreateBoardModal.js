import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../styles/workspaceCss/createboardmodal.css";
import { TailSpin } from "react-loader-spinner";
import BoardApi from "../../api/BoardApi/board.js";
import Cross from "../../assets/close.svg";
import PenIcon from "../../assets/homepage-pen-icon.svg";
import DescIcon from "../../assets/create-board-modal-desc.svg";
import { fetchWorkspaces } from "../../store/workspaceSlice";

const CreateBoardModal = ({ onClose, workspaceId }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token.token || "");
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
    if (!name || !description) {
      setErrorMessage("Please provide both a board name and description.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    
    try {
      const response = await boardApi.createBoard(token, workspaceId, name, description);
      if (response.status === true) {
        dispatch(fetchWorkspaces());
        onClose();
        navigate(`/workspaces/board/${workspaceId}/${response.data._id}`);
      } else {
        setErrorMessage("Failed to create board. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
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

        <div className="create-board-modal-input">
          <div className="input-icon-wrapper create-board-name">
            <img className="create-board-pen-icon" src={PenIcon} alt="Pen" />
            <input
              className="create-board-input-email"
              type="text"
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
            <img className="create-board-desc-icon" src={DescIcon} alt="Desc" />
            <textarea
              id="board-description-input"
              className="create-board-input-password"
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
            disabled={loading}
          >
            {loading ? (
              <TailSpin height="24" width="24" color="#fff" ariaLabel="loading" />
            ) : (
              "Create"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBoardModal;
