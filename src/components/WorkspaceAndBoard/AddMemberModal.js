import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../styles/addmembermodal.css";
import BoardApi from "../../api/BoardApi/board.js";
const config = require("../../config");
import Cross from "../../assets/close.svg";
import { fetchWorkspaces } from "../../store/workspaceSlice";
import Penİcon from "../../assets/homepage-pen-icon.svg"
import Descİcon from "../../assets/create-board-modal-desc.svg"

const AddMemberModal = ({ onClose, workspaceId }) => {
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
                <div>
                        <div className='modal-title'>
                            <span>Invite your team members</span>
                        </div>
                        <div className='connection-area'>
                            <span>Invite with connection link</span>
                            <input className="connection-link" type="text" placeholder="https://murat.forsico.com/user/dashboard..." />
                        </div>
                        <div className='line-or'>
                            <span>or</span>
                        </div>
                        <div>
                            <div className='invite-mail-title'>
                                Invite with email adresses
                            </div>
                            <div className='invited-email'>
                                <a>murat@forsico.io</a>
                            </div>
                        </div>
                        <div>
                            <input className="email-invite" type="text" placeholder="Enter one or more email addresses" />
    
                        </div>
                    </div>
            </div>
        </div>
    );
};

export default AddMemberModal;
