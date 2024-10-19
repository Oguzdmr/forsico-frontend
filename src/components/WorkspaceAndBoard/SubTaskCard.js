import React, { useState } from "react";
import TaskModal from "./TaskModal";
import '../../styles/workspaceCss/SubTaskCard.css';
import { useSelector } from "react-redux";

import miniCalendar from '../../assets/mini-calendar.svg';
import people from '../../assets/people-blue.svg';
import flag from '../../assets/flag.svg';

function SubTaskCard({ colIndex, taskIndex, color }) {
  const boards = useSelector((state) => state.auth.boards);
  const board = boards.find((board) => board.isActive === true);
  const columns = board.columns;
  const col = columns.find((col, i) => i === colIndex);
  const task = col.tasks.find((task, i) => i === taskIndex);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  let completed = 0;
  let subtasks = task.subtasks;
  subtasks.forEach((subtask) => {
    if (subtask.isCompleted) {
      completed++;
    }
  });

  const handleOnDrag = (e) => {
    e.dataTransfer.setData(
      "text",
      JSON.stringify({ taskIndex, prevColIndex: colIndex })
    );
  };

  return (
    <div>
      <div
        onClick={() => {
          setIsTaskModalOpen(true);
        }}
        draggable
        onDragStart={handleOnDrag}
        className="subtask-container"
        style={{ borderColor: color }} // Use the passed color here
      >
        <div className="subtask-frame">
          <div className="subtask-content">
            <p className="subtask-title">{task.title}</p>
            <div className="subtask-extra">
              <img src={flag} alt="Flag icon" />
            </div>
          </div>
          <div className="subtask-divider"></div>
        </div>

        {/* SubTask Info and Stats Container */}
        <div className="subtask-info-container">
          <div className="subtask-info">
            <div className="subtask-date">
              <div className="mini-calendar-icon">
                <img src={miniCalendar} alt="mini calendar" />
              </div>
              <span className="date-text">August 12</span>
            </div>
          </div>

          <div className="subtask-stats">
            <div className="stat-group">
              <div className="stat-icon">
                <img src={people} alt="People icon" />
              </div>
              <div className="stat-text">4</div>
            </div>
          </div>
        </div>
      </div>

      {isTaskModalOpen && (
        <TaskModal
          colIndex={colIndex}
          taskIndex={taskIndex}
          setIsTaskModalOpen={setIsTaskModalOpen}
        />
      )}
    </div>
  );
}

export default SubTaskCard;