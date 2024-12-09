import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import TaskModal from "./TaskModal";
import SubTaskCard from "./SubTaskCard";
import "../../styles/workspaceCss/TaskCard.css";
import { useSelector, useDispatch } from "react-redux";
import rightButton from "../../assets/right-button.svg";
import miniCalendar from "../../assets/mini-calendar.svg";
import fork from "../../assets/fork-blue.svg";
import people from "../../assets/people-blue.svg";
import flag from "../../assets/flag.svg";
import downArrow from "../../assets/down-arrow.svg";
import upArrow from "../../assets/up-arrow.svg";
import moment from "moment";
import UrgentFlag from "../../assets/redFlag.svg";
import HighFlag from "../../assets/blueFlag.svg";
import NormalFlag from "../../assets/taskcard-info-priority.svg";


function TaskCard({
  list,
  task,
  colIndex,
  workspaceId,
  boardId,
  taskIndex,
  color,
}) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSubtasksVisible, setIsSubtasksVisible] = useState(false);
  const [subtasks, setSubtasks] = useState(
    task.subtasks.map((sub) => {
      return list.tasks.filter((tsk) => tsk._id === sub)[0];
    }) || []
  );
  const navigate = useNavigate();
  const location = useLocation();
  const priorityOptions = [
    { label: "Urgent", icon: UrgentFlag, index: 0 },
    { label: "High", icon: HighFlag, index: 1 },
    { label: "Normal", icon: NormalFlag, index: 2 },
  ];

  console.log("Taskcard prio", task.priority)

  useEffect(() => {
    setSubtasks(
      task.subtasks.map((sub) => {
        return list.tasks.filter((tsk) => tsk._id === sub)[0];
      }) || []
    );
  }, [task]);

  useEffect(() => {
    if (isTaskModalOpen) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('selectedTask', taskIndex);
  
      navigate(`${location.pathname}?${searchParams.toString()}`);
    }
  }, [isTaskModalOpen]);


  const dispatch = useDispatch();
  const handleOnDrag = (e) => {
    e.dataTransfer.setData(
      "text",
      JSON.stringify({ taskIndex, prevColIndex: colIndex })
    );
  };

  const toggleSubtasks = () => {
    setIsSubtasksVisible(!isSubtasksVisible);
  };

  const hasSubtasks = task.subtasks?.length > 0;
  console.log(subtasks);
  return (
    <div>
      <div
        onClick={() => {
          setIsTaskModalOpen(true);
        }}
        draggable
        onDragStart={handleOnDrag}
        className={`task-container ${!hasSubtasks ? "no-subtasks" : ""}`} // Alt görev yoksa sınıf ekle
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
              <span className="date-text">
                {moment(task.dueDate).format("MMMM-DD")}
              </span>
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
            <div className="stat-text">{subtasks?.length}</div>{" "}
          </div>

          <div className="stat-group">
            <div className="stat-icon">
              <img src={people} alt="People icon" />
            </div>
            <div className="stat-text">1</div>
          </div>
          <div className="task-extra">
            <img src={priorityOptions[task.priority]?.icon} alt="Priority" />
          </div>
        </div>
      </div>

      {/* Task footer: Subtasks'ı açmak için */}
      {hasSubtasks && ( // Alt görev varsa footer'ı göster
        <div
          className="task-footer"
          onClick={toggleSubtasks}
          style={{ borderColor: color }}
        >
          <span className="footer-text"></span>
          <img
            src={isSubtasksVisible ? upArrow : downArrow}
            alt="Arrow icon"
            className="footer-icon"
          />
        </div>
      )}

      {/* Subtask'ları göstermek için */}
      {isSubtasksVisible && (
        <div className="subtasks-container">
          {subtasks?.map((subtask, index) => (
            <SubTaskCard
              key={index}
              listId={colIndex}
              taskId={taskIndex}
              subtask={subtask}
              workspaceId={workspaceId}
              boardId={boardId}
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
          boardId={boardId}
          setIsTaskModalOpen={setIsTaskModalOpen}
        />
      )}
    </div>
  );
}

export default TaskCard;
