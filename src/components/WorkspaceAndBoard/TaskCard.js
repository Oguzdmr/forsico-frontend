import React, { useEffect, useState } from "react";
import TaskModal from "./TaskModal";
import SubTaskCard from "./SubTaskCard";
import '../../styles/workspaceCss/TaskCard.css';
import { useSelector } from "react-redux";
import rightButton from '../../assets/right-button.svg';
import miniCalendar from '../../assets/mini-calendar.svg';
import fork from '../../assets/fork-blue.svg';
import people from '../../assets/people-blue.svg';
import flag from '../../assets/flag.svg';
import downArrow from '../../assets/down-arrow.svg';
import upArrow from '../../assets/up-arrow.svg';
import moment from 'moment';

function TaskCard({ list, task, colIndex,workspaceId, taskIndex, color }) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSubtasksVisible, setIsSubtasksVisible] = useState(false);
  console.log("list",list);
  console.log("task",task)
  const [subtasks,setSubtasks] = useState(task.subtasks.map((sub)=>{
    return list.tasks.filter(tsk => tsk._id === sub)[0]
  }) || []);
  let completed = 0;


  const handleOnDrag = (e) => {
    e.dataTransfer.setData(
      "text",
      JSON.stringify({ taskIndex, prevColIndex: colIndex })
    );
  };

  const toggleSubtasks = () => {
    setIsSubtasksVisible(!isSubtasksVisible);
  };

  const hasSubtasks = subtasks?.length > 0;
console.log(subtasks)
  return (
    <div>
      <div
        onClick={() => {
          setIsTaskModalOpen(true);
        }}
        draggable
        onDragStart={handleOnDrag}
        className={`task-container ${!hasSubtasks ? 'no-subtasks' : ''}`} // Alt görev yoksa sınıf ekle
        style={{ borderColor: color }} // Border'ı pasif yap
      >
        <div className="task-frame">
          <div className="task-content">
            <p className="task-title">{task.name}</p>
            <div className="task-icon">
              <img src={rightButton} alt="icon" />
            </div>
          </div>
          <div className="task-divider"></div>
        </div>

        <div className="task-info">
          {task.dueDate && (
            <div className="task-date">
            <div className="mini-calendar-icon">
              <img src={miniCalendar} alt="mini calendar" />
            </div>
            <span className="date-text">{moment(task.dueDate).format("MMMM-DD")}</span>
            </div>
          )}
         
          <div className="task-status">
            <span>%50</span>
          </div>
        </div>

        <div className="task-stats">
          <div className="stat-group">
            <div className="stat-icon">
              <img src={fork} alt="Fork icon" />
            </div>
            <div className="stat-text">{subtasks?.length}</div> {/* Burayı güncelledik */}
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

      {/* Task footer: Subtasks'ı açmak için */}
      {hasSubtasks && ( // Alt görev varsa footer'ı göster
        <div className="task-footer" onClick={toggleSubtasks} style={{ borderColor: color }}>
          <span className="footer-text"></span>
          <img src={isSubtasksVisible ? upArrow : downArrow} alt="Arrow icon" className="footer-icon" />
        </div>
      )}

      {/* Subtask'ları göstermek için */}
      {isSubtasksVisible && (
        <div className="subtasks-container">
          {subtasks?.map((subtask, index) => (
            <SubTaskCard
              key={index}
              colIndex={colIndex}
              taskIndex={taskIndex}
              subtask={subtask}
              color={color}
            />
          ))}
        </div>
      )}

      {isTaskModalOpen && (
        <TaskModal
          listId={colIndex}
          taskId={taskIndex}
          workspaceId={workspaceId}
          setIsTaskModalOpen={setIsTaskModalOpen}
        />
      )}
    </div>
  );
}

export default TaskCard;
