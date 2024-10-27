import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../styles/loginModal.css";
import { HexColorPicker } from "react-colorful";
import Cross from "../../assets/close.svg";
import ListApi from "../../api/BoardApi/list.js"; // API dosyanızı ayarlayın
import { addList } from "../../store/boardSlice";

const CreateListModal = ({ onClose, workspaceId, boardId }) => {
  const [name, setName] = useState(""); // Liste ismi
  const [description, setDescription] = useState("test"); // Liste açıklaması
  const [color, setColor] = useState("#aabbcc"); // Liste rengi
  const [errorMessage, setErrorMessage] = useState(""); // Hata mesajı
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false); // Renk seçici durumu

  const modalRef = useRef(null);
  const colorPickerRef = useRef(null); // Renk seçici için ref

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const listApi = new ListApi();

  // Token'i Redux Store'dan almak
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

    try {
      const response = await listApi.createList(
        token,
        workspaceId,
        name,
        description,
        boardId,
        color
      );
        console.log("create list response",response)
      if (response.status === true) {
        dispatch(
          addList({ name:response.data.name, _id:response.data._id , color:response.data.color})
        );
        onClose();
      } else {
        setErrorMessage("Liste oluşturulurken hata oluştu.");
      }
    } catch (error) {
      console.error("Liste oluşturulurken hata:", error);
      setErrorMessage("Beklenmeyen bir hata oluştu.");
    }
  };

  return (
    <div className="login-modal-container">
      <div className="login-modal-card" ref={modalRef}>
        <div className="login-modal-close">
          <img
            className="login-modal-close-icon"
            src={Cross}
            alt="Close"
            onClick={onClose}
          />
        </div>
        <div className="login-modal-header">
          <span className="login-modal-title">Create List</span>
        </div>

        <div className="login-modal-input">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Liste İsmi Giriniz..."
            required
            className="login-input-email"
          />
        </div>

        <div className="login-modal-input">
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

        {isColorPickerOpen && (
          <div ref={colorPickerRef} style={{ marginTop: "10px", marginBottom:"10px", width:"250px" }}>
            <HexColorPicker style={{width:"250px"}} color={color} onChange={setColor} />
          </div>
        )}

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

export default CreateListModal;
