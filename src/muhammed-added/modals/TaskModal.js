import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ElipsisMenu from "../components/ElipsisMenu";
import elipsis from "../icon-vertical-ellipsis.svg";
import authSlice from "../../store/authSlice";
import Subtask from "../components/Subtask";
import AddEditTaskModal from "./AddEditTaskModal";
import DeleteModal from "./DeleteModal";
import "../css/TaskModal.css";

function TaskModal({ taskIndex, colIndex, setIsTaskModalOpen }) {
  const dispatch = useDispatch();
  const [isElipsisMenuOpen, setIsElipsisMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const boards = useSelector((state) => state.auth.boards); // authSlice'dan boards'ı al
  const board = boards.find((board) => board.isActive === true);
  
  if (!board) return null; // Eğer aktif bir board yoksa render edilmesin

  const columns = board.columns;
  const col = columns[colIndex];
  const task = col ? col.tasks[taskIndex] : null;

  if (!task) return null; // Eğer görev yoksa render edilmesin

  const subtasks = task.subtasks;

  let completed = 0;
  subtasks.forEach((subtask) => {
    if (subtask.isCompleted) {
      completed++;
    }
  });

  const [status, setStatus] = useState(task.status);
  const [newColIndex, setNewColIndex] = useState(columns.indexOf(col));

  const onChange = (e) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  };

  const onClose = (e) => {
    if (e.target !== e.currentTarget) {
      return;
    }
    dispatch(
      authSlice.actions.setTaskStatus({
        taskIndex,
        colIndex,
        newColIndex,
        status,
      })
    );
    setIsTaskModalOpen(false);
  };

  const onDeleteBtnClick = (e) => {
    if (e.target.textContent === "Delete") {
      dispatch(authSlice.actions.deleteTask({ taskIndex, colIndex }));
      setIsTaskModalOpen(false);
      setIsDeleteModalOpen(false);
    } else {
      setIsDeleteModalOpen(false);
    }
  };

  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const setOpenEditModal = () => {
    setIsAddTaskModalOpen(true);
    setIsElipsisMenuOpen(false);
  };

  const setOpenDeleteModal = () => {
    setIsElipsisMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  return (
    <div onClick={onClose} className="modal-wrapper">
      <div className={`modal-content-trello ${isDeleteModalOpen ? "dark-mode" : ""}`}>
        <div className="modal-header">
          <h1>{task.title}</h1>

          <img
            onClick={() => setIsElipsisMenuOpen((prevState) => !prevState)}
            src={elipsis}
            alt="elipsis"
            className="elipsis-icon"
          />
          {isElipsisMenuOpen && (
            <ElipsisMenu
              setOpenEditModal={setOpenEditModal}
              setOpenDeleteModal={setOpenDeleteModal}
              type="Task"
            />
          )}
        </div>
        <p className="modal-description">{task.description}</p>

        <p className="subtasks-info">
          Subtasks ({completed} of {subtasks.length})
        </p>

        <div className="subtasks-wrapper">
          {subtasks.map((subtask, index) => (
            <Subtask
              index={index}
              taskIndex={taskIndex}
              colIndex={colIndex}
              key={index}
            />
          ))}
        </div>

        <div className="status-section">
          <label className="status-label">Current Status</label>
          <select
            className="select-status"
            value={status}
            onChange={onChange}
          >
            {columns.map((col, index) => (
              <option className="status-options" key={index}>
                {col.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isDeleteModalOpen && (
        <DeleteModal
          onDeleteBtnClick={onDeleteBtnClick}
          type="task"
          title={task.title}
        />
      )}

      {isAddTaskModalOpen && (
        <AddEditTaskModal
          setIsAddTaskModalOpen={setIsAddTaskModalOpen}
          setIsTaskModalOpen={setIsTaskModalOpen}
          type="edit"
          taskIndex={taskIndex}
          prevColIndex={colIndex}
        />
      )}
    </div>
  );
}

export default TaskModal;
