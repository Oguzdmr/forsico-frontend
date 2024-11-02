import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HexColorPicker } from "react-colorful";
import { useNavigate } from "react-router-dom";
import "../../styles/workspaceCss/createlistmodal.css";
import { TailSpin } from "react-loader-spinner";
import Cross from "../../assets/close.svg";
import ListApi from "../../api/BoardApi/list.js";
import { addList } from "../../store/boardSlice";

const CreateListModal = ({ onClose, workspaceId, boardId }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("test");
  const [color, setColor] = useState("#aabbcc");
  const [errorMessage, setErrorMessage] = useState("");
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const modalRef = useRef(null);
  const colorPickerRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const listApi = new ListApi();
  const token = useSelector((state) => state.auth.token.token);

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
    if (!name) {
      setErrorMessage("Liste ismini giriniz.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await listApi.createList(
        token,
        workspaceId,
        name,
        description,
        boardId,
        color
      );
      if (response.status === true) {
        dispatch(addList({ name: response.data.name, _id: response.data._id, color: response.data.color }));
        onClose();
      } else {
        setErrorMessage("Liste oluşturulurken hata oluştu.");
      }
    } catch (error) {
      console.error("Liste oluşturulurken hata:", error);
      setErrorMessage("Beklenmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-list-modal-container">
      <div className="create-list-modal-card" ref={modalRef}>
        <div className="create-list-modal-close">
          <img
            className="create-list-modal-close-icon"
            src={Cross}
            alt="Close"
            onClick={onClose}
          />
        </div>
        <div className="create-list-modal-header">
          <span className="create-list-modal-title">Create List</span>
        </div>
        <div className="create-list-modal-input-group">
          <div className="create-list-modal-input">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Liste İsmi Giriniz..."
              required
              className="create-list-input-email"
            />
          </div>
          <div className="create-list-modal-input">
            <span className="color-picker-label">Select Color:</span>
            <div
              className="color-preview"
              onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
              style={{
                backgroundColor: color,
                width: "250px",
                height: "40px",
                marginTop: "10px",
                cursor: "pointer",
              }}
            />
          </div>
        </div>

        {isColorPickerOpen && (
          <div ref={colorPickerRef} style={{ marginTop: "10px", marginBottom: "10px", width: "250px" }}>
            <HexColorPicker style={{ width: "250px" }} color={color} onChange={setColor} />
          </div>
        )}

        {errorMessage && (
          <div className="create-list-error-message">
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="create-list-modal-action">
          <button
            type="button"
            className="create-list-submit-btn"
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

export default CreateListModal;
