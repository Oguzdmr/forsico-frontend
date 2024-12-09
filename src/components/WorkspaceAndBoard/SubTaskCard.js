import React, { useState } from "react";
import TaskModal from "./TaskModal";
import '../../styles/workspaceCss/SubTaskCard.css';
import { useSelector } from "react-redux";

import miniCalendar from '../../assets/mini-calendar.svg';
import people from '../../assets/people-blue.svg';

import UrgentFlag from "../../assets/redFlag.svg";
import HighFlag from "../../assets/blueFlag.svg";
import NormalFlag from "../../assets/taskcard-info-priority.svg";

function SubTaskCard({listId, taskId, subtask, workspaceId, boardId, color }) { // subtask'ı prop olarak alıyoruz
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const priorityOptions = [
    { label: "Urgent", icon: UrgentFlag, index: 0 },
    { label: "High", icon: HighFlag, index: 1 },
    { label: "Normal", icon: NormalFlag, index: 2 },
  ];
  const handleOnDrag = (e) => {
    e.dataTransfer.setData(
      "text",
      JSON.stringify({ taskId, prevColIndex: listId })
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
            <p className="subtask-title">{subtask?.name}</p> {/* subtask başlığını kullanıyoruz */}
            <div className="subtask-extra">
              <img src={priorityOptions[subtask?.priority]?.icon} alt="Flag icon" />
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
          listId={listId}
          taskId={subtask._id}
          workspaceId={workspaceId}
          boardId={boardId}
          setIsTaskModalOpen={setIsTaskModalOpen}
        />
      )}
    </div>
  );
}

export default SubTaskCard;
