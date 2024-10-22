import React from "react";
import { useDispatch, useSelector } from "react-redux";
import TaskCard from "./TaskCard";
import authSlice from "../../store/authSlice";
import "../../styles/workspaceCss/TaskList.css";
import { dragTask } from '../../store/authSlice';


function TaskList({ colIndex }) {
  const colors = [
    "color-blue",
    "color-red",
    "color-sky",
    "color-orange",
    "color-purple",
    "color-green",
    "color-indigo",
    "color-yellow",
    "color-pink",
  ];

  const dispatch = useDispatch();
  const boards = useSelector((state) => state.auth.boards);
  const board = boards.find((board) => board.isActive === true);
  const col = board.columns.find((col, i) => i === colIndex);

  if (!board) return null; // Eğer aktif bir board yoksa render edilmesin

  // Assign a unique, fixed color based on column index
  const color = colors[colIndex % colors.length];

  const handleOnDrop = (e) => {
    //console.log("handleOnDrop eeee1 : ", e);

    const { prevColIndex, taskIndex } = JSON.parse(
      e.dataTransfer.getData("text")
    );

    /*
    console.log("handleOnDrop prevColIndex : ", prevColIndex);
    console.log("handleOnDrop taskIndex : ", taskIndex);
    console.log("handleOnDrop edatatransfer : ", e.dataTransfer);
    console.log("handleOnDrop edatatransfertext : ", JSON.parse(e.dataTransfer.getData("text")));
    */

    if (colIndex !== prevColIndex) {
      dispatch(
        dragTask({ colIndex, prevColIndex, taskIndex })
      );
    }
  };

  const handleOnDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleOnDrop}
      onDragOver={handleOnDragOver}
      className="scrollbar-hide column-container"
    >
      <p
        className={`column-header ${color}`}
      >
        <div className={`rounded-circle ${color}`} />
        {col.name} ({col.tasks.length})
      </p>

      {(col.tasks || []).map((task, index) => (
        <TaskCard key={index} taskIndex={index} colIndex={colIndex} color={color} />
      ))}
    </div>
  );
}

export default TaskList;
