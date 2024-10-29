import React, { useEffect, useState, useRef } from "react";
import TaskList from "../components/WorkspaceAndBoard/TaskList";
import VectorIcon from "../assets/Vector.png";
import ShareIcon from "../assets/shareIcon.svg";
import AddMemberIcon from "../assets/addMemberIcon.svg";
import { useDispatch, useSelector } from "react-redux";
import "../styles/workspaceCss/board.css";
import { fetchMyTasks } from "../store/myTasksSlice";

function MyTasks() {
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);
  const dispatch = useDispatch();
  const {
    entities,
    status = "idle",
    error,
  } = useSelector((state) => {
    return state.myTasks || {};
  });
  const memberModalRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const workspaces = useSelector((state) => {
    return state.workspaces?.entities;
  });

  useEffect(() => {
    if (status === "idle" && workspaces.length > 0) {
      dispatch(fetchMyTasks({ workspaceId: (workspaces || [])[0]?._id }));
    }
  }, [dispatch, status, workspaces]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (
      memberModalRef.current &&
      !memberModalRef.current.contains(event.target)
    ) {
      setIsModalOpen(false);
    }
  };

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  return (
    <div className="board-page">
      <div className="board-header">
        <div className="board-title">
          <h1>My Tasks</h1>
        </div>

        <div className="board-button-group">
          <div className="board-share">
            <img src={ShareIcon} alt="Share" />
          </div>
        </div>

        {isModalOpen && (
          <div className="member-modal" ref={memberModalRef}>
            <div className="member-modal-title">
              <h1>Members</h1>
              <img src={AddMemberIcon} alt="Add Member" />
            </div>
            <div className="member-modal-line"></div>
            <div className="member-modal-content">
              {entities?.members.map((member) => (
                <div className="member" key={member._id}>
                  <img src={member?.profilePicture} alt="Member 1" />
                  <span>
                    {member.firstName} {member.lastName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className={`board-container scrollbar-hide`}>
        <div className="board-top-line"></div>
        <div className="board-content">
          {entities?.length > 0 ? (
            <>
              {entities.map((workspace, index) => (
                <TaskList
                  key={index}
                  list={workspace}
                  colIndex={workspace._id}
                  workspaceId={workspace._id}
                />
              ))}
            </>
          ) : (
            <div className="empty-my-tasks-section">
                <p>You don't have any tasks</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyTasks;
