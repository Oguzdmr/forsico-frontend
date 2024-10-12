import React, { useState } from "react";
import elipsis from "../icon-vertical-ellipsis.svg";
import AddEditTaskModal from "./AddEditTaskModal";
// import DeleteModal from "./DeleteModal";
// import ElipsisMenu from "../components/ElipsisMenu";
// import Subtask from "../components/Subtask";

function TaskModal({ taskIndex = 0, colIndex = 0, setIsTaskModalOpen }) {
  // Örnek varsayılan veriler
  const defaultBoards = [
    {
      isActive: true,
      columns: [
        {
          name: "To Do",
          tasks: [
            {
              title: "Task 1",
              description: "This is the first task.",
              status: "To Do",
              subtasks: [
                { isCompleted: true },
                { isCompleted: false },
              ],
            },
            {
              title: "Task 2",
              description: "This is the second task.",
              status: "In Progress",
              subtasks: [
                { isCompleted: false },
                { isCompleted: false },
              ],
            },
          ],
        },
        {
          name: "In Progress",
          tasks: [
            {
              title: "Task 3",
              description: "This is the third task.",
              status: "In Progress",
              subtasks: [
                { isCompleted: true },
                { isCompleted: true },
              ],
            },
          ],
        },
      ],
    },
  ];

  // Veriyi getiren fonksiyon
  const getTaskData = () => {
    const boards = defaultBoards; // Sabit veri kullanıyoruz
    const board = boards.find((board) => board.isActive === true);
    const columns = board.columns;
    const col = columns.find((col, i) => i === colIndex);
    const task = col.tasks.find((task, i) => i === taskIndex);

    return { board, columns, col, task };
  };

  const { columns, task } = getTaskData(); // Veriyi alıyoruz
  const subtasks = task.subtasks;

  let completed = 0;
  subtasks.forEach((subtask) => {
    if (subtask.isCompleted) {
      completed++;
    }
  });

  const [status, setStatus] = useState(task.status);
  const [newColIndex, setNewColIndex] = useState(columns.indexOf(columns[colIndex]));
  const [isElipsisMenuOpen, setIsElipsisMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const onChange = (e) => {
    setStatus(e.target.value);
    setNewColIndex(e.target.selectedIndex);
  };

  const onClose = (e) => {
    if (e.target !== e.currentTarget) {
      return;
    }
    setIsTaskModalOpen(false);
  };

  const onDeleteBtnClick = (e) => {
    if (e.target.textContent === "Delete") {
      setIsTaskModalOpen(false);
      setIsDeleteModalOpen(false);
    } else {
      setIsDeleteModalOpen(false);
    }
  };

  const setOpenEditModal = () => {
    setIsAddTaskModalOpen(true);
    setIsElipsisMenuOpen(false);
  };

  const setOpenDeleteModal = () => {
    setIsElipsisMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  return (
    <div
      onClick={onClose}
      className=" fixed right-0 top-0 px-2 py-4 overflow-scroll scrollbar-hide  z-50 left-0 bottom-0 justify-center items-center flex dropdown "
    >
      {/* MODAL SECTION */}

      <div className=" scrollbar-hide overflow-y-scroll max-h-[95vh]  my-auto  bg-white dark:bg-[#2b2c37] text-black dark:text-white font-bold shadow-md shadow-[#364e7e1a] max-w-md mx-auto  w-full px-8  py-8 rounded-xl">
        <div className=" relative flex   justify-between w-full items-center">
          <h1 className=" text-lg">{task.title}</h1>

          <img
            onClick={() => {
              setIsElipsisMenuOpen((prevState) => !prevState);
            }}
            src={elipsis}
            alt="elipsis"
            className=" cursor-pointer h-6"
          />
          {/* {isElipsisMenuOpen && (
            <ElipsisMenu
              setOpenEditModal={setOpenEditModal}
              setOpenDeleteModal={setOpenDeleteModal}
              type="Task"
            />
          )} */}
        </div>
        <p className=" text-gray-500 font-[600] tracking-wide text-xs pt-6">
          {task.description}
        </p>

        <p className=" pt-6 text-gray-500 tracking-widest text-sm">
          Subtasks ({completed} of {subtasks.length})
        </p>

        {/* Subtasks Section */}
        <div className=" mt-3 space-y-2">
          {/* {subtasks.map((subtask, index) => {
            return (
              <Subtask
                index={index}
                taskIndex={taskIndex}
                colIndex={colIndex}
                key={index}
              />
            );
          })} */}
        </div>

        {/* Current Status Section */}
        <div className="mt-8 flex flex-col space-y-3">
          <label className="  text-sm dark:text-white text-gray-500">
            Current Status
          </label>
          <select
            className=" select-status flex-grow px-4 py-2 rounded-md text-sm bg-transparent focus:border-0  border-[1px] border-gray-300 focus:outline-[#635fc7] outline-none"
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
      {/* {isDeleteModalOpen && (
        <DeleteModal
          onDeleteBtnClick={onDeleteBtnClick}
          type="task"
          title={task.title}
        />
      )} */}

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
