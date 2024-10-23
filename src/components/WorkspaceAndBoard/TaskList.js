import React from "react";
import { useDispatch, useSelector } from "react-redux";
import TaskCard from "./TaskCard";
import authSlice from "../../store/authSlice";
import "../../styles/workspaceCss/TaskList.css";
import { dragTask } from '../../store/boardSlice';


function TaskList({ list,colIndex }) {
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
  const col = board.columns.find((col, i) => i === 1);

  if (!board) return null;

  const color = colors[1 % colors.length];
  
  const handleOnDrop = (e) => {
    console.log("event json parse",JSON.parse(
      e.dataTransfer.getData("text")
    ))
    const { prevColIndex, taskIndex } = JSON.parse(
      e.dataTransfer.getData("text")
    );

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
        {list.name} ({col.tasks.length})
      </p>

      {(list.tasks || []).map((task, index) => (
        <TaskCard key={index} task={task} taskIndex={task._id} colIndex={list._id} color={color} />
      ))}
    </div>
  );
}

export default TaskList;
