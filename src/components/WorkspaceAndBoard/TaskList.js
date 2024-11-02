import React from "react";
import { useDispatch, useSelector } from "react-redux";
import TaskCard from "./TaskCard";
import authSlice from "../../store/authSlice";
import "../../styles/workspaceCss/TaskList.css";
import { dragTask } from '../../store/boardSlice';
import TaskApi from '../../api/BoardApi/task.js'

function TaskList({ list, colIndex, workspaceId, boardId }) {
  const token =  useSelector((state) => {
    return state.auth.token.token || "";
  })
  
  const taskData = {
   
    workspaceId: workspaceId,
    name: "New Task",
    description: "This is a new task",
    boardId: boardId,
    listId: "list123",
    assignee: "user123",
    ownerId: "user123",
    priority: 3,
    dueDate: "2024-12-10"
  };
  const taskApi = new TaskApi();

  const dispatch = useDispatch();
  
  const handleOnDrop = async (e) => {
    const { prevColIndex, taskIndex } = JSON.parse(
      e.dataTransfer.getData("text")
    );
      console.log("taskindex", taskIndex)
    if (colIndex !== prevColIndex) {
      dispatch(
        dragTask({ colIndex, prevColIndex, taskIndex })
      );
      const responseDrag = await taskApi.updateTask(token , workspaceId, taskIndex, {listId:colIndex});
      console.log("responseDrag",responseDrag)
      if(responseDrag.status === false){
        dispatch(
          dragTask({ colIndex:prevColIndex, prevColIndex:colIndex, taskIndex })
        );
      }
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
        className={`column-header`} style={{backgroundColor:list.color}}
      >
        <div className={`rounded-circle `} style={{backgroundColor:list.color}} />
        {list.name} ({list.tasks.length})
      </p>

      {(list.tasks || []).map((task, index) => {
        if(!task.parentTask){
          return (
            <TaskCard key={index} list={list} task={task} taskIndex={task._id} workspaceId={workspaceId} colIndex={list._id} color={list.color} />
          )
        }
      })}
    </div>
  );
}

export default TaskList;
