import React, { useState } from "react";
import TaskModal from "./TaskModal";
import '../../styles/workspaceCss/TaskCard.css';
import { useSelector } from "react-redux";

import rightButton from '../../assets/right-button.svg';
import miniCalendar from '../../assets/mini-calendar.svg';
import fork from '../../assets/fork-blue.svg';
import people from '../../assets/people-blue.svg';
import flag from '../../assets/flag.svg';
import downArrow from '../../assets/down-arrow.svg';

function TaskCard({ colIndex, taskIndex, color }) {
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
        className="task-container"
        style={{ borderColor: color }} // Use the passed color here
      >
        <div className="task-frame">
          <div className="task-content">
            <p className="task-title">{task.title}</p>
            <div className="task-icon">
              <img src={rightButton} alt="icon" />
            </div>
          </div>
          <div className="task-divider"></div>
        </div>

        <div className="task-info">
          <div className="task-date">
            <div className="mini-calendar-icon">
              <img src={miniCalendar} alt="mini calendar" />
            </div>
            <span className="date-text">August 12</span>
          </div>
          <div className="task-status">
            <span>%50</span>
          </div>
        </div>

        <div className="task-stats">
          <div className="stat-group">
            <div className="stat-icon">
              <img src={fork} alt="Fork icon" />
            </div>
            <div className="stat-text">8</div>
          </div>

          <div className="stat-group">
            <div className="stat-icon">
              <img src={people} alt="People icon" />
            </div>
            <div className="stat-text">4</div>
          </div>
          <div className="task-extra">
            <img src={flag} alt="Right button" />
          </div>
        </div>
      </div>

      {/* Task container'ın altına eklenen footer */}
      <div className="task-footer">
        <span className="footer-text"></span>
        <img src={downArrow} alt="Extra icon" className="footer-icon" />
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

export default TaskCard;
