import React, { useEffect, useState } from "react";
import TaskList from "../../components/WorkspaceAndBoard/TaskList";
import VectorIcon from "../../assets/Vector.png";
import { useDispatch, useSelector } from "react-redux";
import "../../styles/workspaceCss/board.css";
import { fetchBoard, updateStatus } from "../../store/boardSlice";

import { useParams } from "react-router-dom";
import CreateListModal from "../../components/WorkspaceAndBoard/CreateListModal";

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
  } = useSelector((state) => {
    return state.board || {};
  });

  const { workspaceId } = useParams();
  const { boardId } = useParams();

  useEffect(() => {
    dispatch(updateStatus({ status: "idle" }));
  }, [boardId]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchBoard({ workspaceId, boardId }));
    }
  }, [dispatch, status]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });

  const [isListModalOpen, setIsListModalOpen] = useState(false);

  const board = useSelector((state) => state.board.entities);


  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  return (
    <div className="board-page">
    <div className="board-header">
      <h1>{board.name}</h1>
      <div className="board-top-line">
      <hr />
      </div>
      
    </div>
   
    <div className={`board-container scrollbar-hide`}>
     
      {entities?.lists?.length > 0 ? (
        <>
          {entities.lists.map((list, index) => (
            <TaskList key={index} list={list} colIndex={list._id} workspaceId={workspaceId} boardId={boardId} />
          ))}
          <div
            onClick={() => {
              setIsListModalOpen(true);
            }}
            className="new-column-button"
          >
            <img src={VectorIcon} alt="New Column" />
          </div>
        </>
      ) : (
        <>
           <div
            onClick={() => {
              setIsListModalOpen(true);
            }}
            className="new-column-button"
          >
            <img src={VectorIcon} alt="New Column" />
          </div>
        </>
      )}
      {isListModalOpen && (
        <CreateListModal onClose={()=> setIsListModalOpen(false)} workspaceId={workspaceId} boardId={boardId} />
      )}

      <button className="add-task-button">Add Task +</button>
    </div>
    </div>
  );
}

export default Board;
