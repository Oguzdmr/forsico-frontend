import React, { useEffect, useState, useRef } from "react";
import TaskList from "../../components/WorkspaceAndBoard/TaskList";
import VectorIcon from "../../assets/Vector.png";
import MembersIcon from "../../assets/memberIcon.svg";
import ShareIcon from "../../assets/shareIcon.svg";
import FilterBoardIcon from "../../assets/filterBoard.svg";
import AiIcon from "../../assets/aiIcon.svg";
import shareCopyIcon from "../../assets/shareCopyIcon.svg";
import AddMemberIcon from "../../assets/addMemberIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import "../../styles/workspaceCss/board.css";
import { fetchBoard, updateStatus } from "../../store/boardSlice";
import { Link, useParams } from "react-router-dom";
import CreateListModal from "../../components/WorkspaceAndBoard/CreateListModal";
import InviteTeamModal from "../../components/WorkspaceAndBoard/InviteTeamModal";
import { RotatingLines } from "react-loader-spinner";
import TaskApi from "../../api/BoardApi/task.js";
import { TailSpin } from 'react-loader-spinner';
import TaskModal from "../../components/WorkspaceAndBoard/TaskModal";

function Board() {
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);
  const dispatch = useDispatch();
  const {
    entities,
    status = "idle",
    error,
  } = useSelector((state) => state.board || {});
  
  const { workspaceId, boardId } = useParams();
  const ownerId = useSelector((state) => state.auth.user.id || "");
  const _listId = useSelector((state) =>
    state?.board?.entities?.lists ? state?.board?.entities?.lists[0]?._id || "" : ""
  );
  const token = useSelector((state) => state.auth.token.token || "");
  const [isFetchingTasks, setIsFetchingTasks] = useState(false);
  const memberModalRef = useRef(null);
  const shareModalRef = useRef(null);
  const taskApi = new TaskApi();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  useEffect(() => {
    setIsLoading(true);
    dispatch(updateStatus({ status: "idle" }));
  }, [boardId]);


  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBoard({ workspaceId, boardId })).finally(() => {
        setIsLoading(false);
      });
    }
  }, [dispatch, status, workspaceId, boardId]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClickOutside = (event) => {
    if (memberModalRef.current && !memberModalRef.current.contains(event.target)) {
      setIsModalOpen(false);
    }
    if (shareModalRef.current && !shareModalRef.current.contains(event.target)) {
      setIsShareModalOpen(false);
    }
  };

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const board = useSelector((state) => state.board.entities);
  const [copySuccess, setCopySuccess] = useState(false);
  const linkInputRef = useRef(null);

  const handleCopyClick = async () => {
    try {
      if (linkInputRef.current) {
        await navigator.clipboard.writeText(linkInputRef.current.value);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleAddTask = async () => {
    try {
      setIsFetchingTasks(true);
      var createTaskRes = await taskApi.createTask(token, workspaceId, {
        name: "My Task",
        description: "My Task Description",
        listId: _listId,
        boardId: boardId,
        ownerId: ownerId,
        assignee: ownerId,
      });
      if(createTaskRes.status){
        setIsFetchingTasks(false)
        setTaskId(createTaskRes.data._id)
        setIsTaskModalOpen(true)
        dispatch(fetchBoard({ workspaceId, boardId }))
      }
    } catch (error) {
      
    }
  }
  return (
    <div className="board-page">
      <div className="board-header">
        <div className="board-title">
        {isLoading ? (
            <h1></h1>
          ) : (
            <h1>{board?.name}</h1>
        )}
        </div>
        <div className="board-button-group">
          <div className="board-ai">
            <Link to={`/workspaces/ai/${workspaceId}`}>
              <img src={AiIcon} alt="AI" />
            </Link>
          </div>
          <div className="board-members" onClick={toggleModal}>
            <img src={MembersIcon} alt="Members" />
          </div>
          <div className="board-share" onClick={() => setIsShareModalOpen(!isShareModalOpen)}>
            <img src={ShareIcon} alt="Share" />
          </div>
        </div>

        {isModalOpen && (
          <div className="member-modal" ref={memberModalRef}>
            <div className="member-modal-title">
              <h1>Members</h1>
              <div onClick={() => setAddMemberModalOpen(true)}>
                <img src={AddMemberIcon} alt="Add Member" />
              </div>
            </div>
            <div className="member-modal-line"></div>
            <div className="member-modal-content">
              {entities?.members.map((member) => (
                <div className="member" key={member._id}>
                  <img src={member?.profilePicture} alt="Member" />
                  <span>
                    {member.firstName} {member.lastName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isShareModalOpen && (
          <div className="share-modal" ref={shareModalRef}>
            <div className="share-modal-title">
              <h1>Share the board</h1>
            </div>
            <div className="share-modal-line"></div>
            <div className="share-modal-content">
              <div className="share-connection-link-wrapper">
                <label>Share with connection link</label>
                <div className="share-link-input-container">
                  <input
                    type="text"
                    value={window.location.href.split("?")[0]}
                    readOnly
                    className="share-link-input"
                    ref={linkInputRef}
                  />
                  <button className="share-copy-button" onClick={handleCopyClick}>
                    <img src={shareCopyIcon} alt="Copy" className="share-copy-icon" />
                  </button>
                </div>
                {copySuccess && <span className="share-copy-success">Copied!</span>}
              </div>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="loader-container">
          <RotatingLines height="40" width="40" radius="9" strokeColor="#36C5F0" ariaLabel="loading" />
        </div>
      ) : (
        <div className="board-container scrollbar-hide">
          <div className="board-top-line"></div>
          <div className="board-content">
            {entities?.lists?.length > 0 ? (
              <>
                {entities.lists.map((list, index) => (
                  <TaskList key={index} list={list} colIndex={list._id} workspaceId={workspaceId} boardId={boardId} />
                ))}
                <div onClick={() => setIsListModalOpen(true)} className="new-column-button">
                  <img src={VectorIcon} alt="New Column" />
                </div>
              </>
            ) : (
              <div onClick={() => setIsListModalOpen(true)} className="new-column-button">
                <img src={VectorIcon} alt="New Column" />
              </div>
            )}
            {isListModalOpen && (
              <CreateListModal onClose={() => setIsListModalOpen(false)} workspaceId={workspaceId} boardId={boardId} />
            )}
            <button className="add-task-button" onClick={()=> handleAddTask()} >{isFetchingTasks ? (
                <TailSpin
                  height="25"
                  width="25"
                  color="#ffffff"
                  ariaLabel="loading-indicator"
                />
              ) : (
                "Add Task +"
              )}</button>
          </div>
        </div>
      )}

      {isAddMemberModalOpen && <InviteTeamModal onClose={() => setAddMemberModalOpen(false)} />}
      {isTaskModalOpen && (
        <TaskModal
          listId={_listId}
          taskId={taskId}
          workspaceId={workspaceId}
          boardId={boardId}
          setIsTaskModalOpen={setIsTaskModalOpen}
        />
      )}
    </div>
  );
}

export default Board;
