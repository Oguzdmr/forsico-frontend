import React, { useEffect, useState } from "react";
import TaskList from "../../components/WorkspaceAndBoard/TaskList";
import VectorIcon from "../../assets/Vector.png";
import { useDispatch, useSelector } from "react-redux";
import "../../styles/Home.css";
import { fetchBoard, updateStatus } from "../../store/boardSlice";

import { useParams } from "react-router-dom";

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
    console.log(boardId);
    dispatch(updateStatus({ status: "idle" }));
  }, [boardId]);

  useEffect(() => {
    console.log("çalıştı")
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

  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);

  const boards = useSelector((state) => state.auth.boards);
  const board = boards.find((board) => board.isActive === true);
  const columns = board.columns;

  const [isSideBarOpen, setIsSideBarOpen] = useState(true);

  return (
    <div className={`home-container scrollbar-hide`}>
      {columns.length > 0 ? (
        <>
          {columns.map((col, index) => (
            <TaskList key={index} colIndex={index} />
          ))}
          <div
            onClick={() => {
              setIsBoardModalOpen(true);
            }}
            className="new-column-button"
          >
            <img src={VectorIcon} alt="New Column" />
          </div>
        </>
      ) : (
        <>
          <img src={VectorIcon} alt="New Column" />
        </>
      )}

      <button className="add-task-button">Add Task +</button>
    </div>
  );
}

export default Board;
