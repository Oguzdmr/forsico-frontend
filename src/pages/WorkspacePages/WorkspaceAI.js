import React, { useEffect, useState } from "react";
import "../../styles/workspaceCss/workspaceAi.css";
import "../../styles/workspaceCss/TaskModal.css";
import WorkspaceTitleIcon from "../../assets/workspaceAi-title-icon.svg";
import TickIcon from "../../assets/ai-message-tick-icon.svg";
import CrossIcon from "../../assets/ai-message-cross-icon.svg";
import { useParams } from "react-router-dom";
import WorkspaceApi from "../../api/BoardApi/workspace.js";
import ForsicoAiApi from "../../api/ForsicoAiApi/forsicoai.js";
import TaskApi from "../../api/BoardApi/task.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkspaces } from "../../store/workspaceSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { RotatingLines } from "react-loader-spinner";

const WorkspaceAIPage = () => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const { workspaceId } = useParams();
  const [workspaceName, setWorkspaceName] = useState("New Workspace");
  const [description, setDescription] = useState("New Desc");
  const [aiTasks, setAiTasks] = useState([]);
  const [visibleTasks, setVisibleTasks] = useState([]);
  const [taskStates, setTaskStates] = useState({});
  const [isFetchingTasks, setIsFetchingTasks] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState({});
  const [error, setError] = useState(null); // Hata mesajı için yeni state

  const _workspaceName = useSelector((state) =>
    state.workspaces.entities.find((workspace) => workspace._id === workspaceId)?.name || ""
  );

  const _workspaceDesc = useSelector((state) =>
    state.workspaces.entities.find((workspace) => workspace._id === workspaceId)?.description || ""
  );

  const _boardId = useSelector((state) =>
    state.workspaces.entities.find((workspace) => workspace._id === workspaceId)?.boards[0]?._id || ""
  );

  const _listId = useSelector((state) =>
    state.workspaces.entities.find((workspace) => workspace._id === workspaceId)?.boards[0]?.lists[0]?._id || ""
  );

  const ownerId = useSelector((state) => state.auth.user.id || "");

  useEffect(() => {
    setWorkspaceName(_workspaceName);
  }, [_workspaceName]);

  useEffect(() => {
    setDescription(_workspaceDesc);
  }, [_workspaceDesc]);

  const staggerAnimation = {
    visible: {
      transition: {
        staggerChildren: 0.5,
      },
    },
  };

  const cardAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token.token || "");
  const workspaceApi = new WorkspaceApi();
  const forsicoAiApi = new ForsicoAiApi();
  const taskApi = new TaskApi();

  const getAiTasks = async () => {
    setIsFetchingTasks(true);
    setError(null); // Hata mesajını sıfırla

    try {
      const res = await forsicoAiApi.generateAzureAIContent(workspaceDescription);
      if (res.success) {
        setVisibleTasks([]);
        setAiTasks(res.data.result.tasks);
      } else {
        setVisibleTasks([]);
        setError("An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("AI task fetch error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsFetchingTasks(false);
    }
  };

  useEffect(() => {
    if (aiTasks.length === 0) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < aiTasks.length) {
        setVisibleTasks((prev) => [...prev, aiTasks[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [aiTasks]);

  const handleApprove = async (task) => {
    if (taskStates[task.id] === "approved") return;

    setLoadingTasks((prev) => ({ ...prev, [task.id]: true }));
    try {
      await taskApi.createTask(token, workspaceId, {
        name: task.name,
        description: task.description,
        listId: _listId,
        boardId: _boardId,
        ownerId: ownerId,
        assignee: ownerId,
      });
      setTaskStates((prev) => ({ ...prev, [task.id]: "approved" }));
    } catch (error) {
      console.error("Task creation failed:", error);
    } finally {
      setLoadingTasks((prev) => ({ ...prev, [task.id]: false }));
    }
  };

  const handleReject = (taskId) => {
    setTaskStates((prev) => ({ ...prev, [taskId]: "rejected" }));
  };

  const handleNameSaveClick = async () => {
    await workspaceApi.updateWorkspace(token, workspaceId, workspaceName, description);
    dispatch(fetchWorkspaces());
    setIsEditingName(false);
  };

  const handleDescriptionSaveClick = async () => {
    await workspaceApi.updateWorkspace(token, workspaceId, workspaceName, description);
    dispatch(fetchWorkspaces());
    setIsEditingName(false);
    setIsEditingDescription(false);
  };

  return (
    <div className="workspaceAi-container">
      <div className="workspaceAi-top">
        <div className="workspaceAi-title-div">
          {isEditingName ? (
            <>
              <input
                className="workspaceAi-title-input"
                type="text"
                placeholder="Workspace Name"
                onChange={(e) => setWorkspaceName(e.target.value)}
                value={workspaceName}
              />
              <button className="workspaceAi-save-btn" onClick={handleNameSaveClick}>
                Save
              </button>
            </>
          ) : (
            <>
              <span className="workspaceAi-title" onClick={() => setIsEditingName(true)}>
                {workspaceName}
              </span>
              <img src={WorkspaceTitleIcon} alt="Workspace Icon" />
            </>
          )}
        </div>

        <div className="workspaceAi-description-div">
          {isEditingDescription ? (
            <>
              <input
                className="workspaceAi-description-input"
                type="text"
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />
              <button className="workspaceAi-description-save-btn" onClick={handleDescriptionSaveClick}>
                Save
              </button>
            </>
          ) : (
            <span className="workspaceAi-description" onClick={() => setIsEditingDescription(true)}>
              {description}
            </span>
          )}
        </div>

        <div className="textarea-container">
          <textarea
            className="workspaceAi-input"
            value={workspaceDescription}
            onChange={(e) => setWorkspaceDescription(e.target.value)}
            placeholder="Describe the job..."
          />
          <div className="textarea-icons">
            <button
              className="workspaceAi-generate-btn"
              onClick={getAiTasks}
              disabled={workspaceDescription.trim() === "" || isFetchingTasks}
            >
              {isFetchingTasks ? (
                <RotatingLines height="20" width="20" strokeColor="#36C5F0" />
              ) : (
                "Generate"
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="workspaceAi-error">
            <p>{error}</p>
          </div>
        )}

        <motion.div
          className="workspaceAi-message"
          variants={staggerAnimation}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {visibleTasks.map((task) => (
              <div key={task.id}>
                <h1 className="blue-letter workspaceAi-response-title">
                  {task.name}
                </h1>
                {task.subtasks ? (
                  <>
                    {task.subtasks.map((subtask) => (
                      <motion.div
                        key={subtask.id}
                        variants={cardAnimation}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`workspaceAi-task ${
                          taskStates[subtask.id] === "rejected" ? "rejected-task" : ""
                        }`}
                      >
                        <div className="workspaceAi-task-card">
                          <div className="task-header">
                            <Typewriter words={[subtask.name]} cursor={false} typeSpeed={10} />
                          </div>
                          <div className="task-desc">
                            <Typewriter words={[subtask.description]} cursor={false} typeSpeed={10} />
                          </div>
                          <div className="task-tags">
                            <span className="task-tag">
                              {subtask.type?.replace(/[^A-Z,a-z]/g, " ")}
                            </span>
                            <span className="task-tag">{subtask.assignee}</span>
                          </div>
                        </div>
                        <div className="task-icons">
                          {taskStates[subtask.id] !== "approved" && (
                            <span className="task-icon" onClick={() => handleReject(subtask.id)}>
                              <img src={CrossIcon} alt="cross" />
                            </span>
                          )}
                          {taskStates[subtask.id] !== "rejected" && (
                            <span className="task-icon" onClick={() => handleApprove(subtask)}>
                              {loadingTasks[subtask.id] ? (
                                <RotatingLines height="20" width="20" strokeColor="#36C5F0" />
                              ) : (
                                <img src={TickIcon} alt="tick" />
                              )}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </>
                ) : (
                  <motion.div
                    key={task.id}
                    variants={cardAnimation}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`workspaceAi-task ${
                      taskStates[task.id] === "rejected" ? "rejected-task" : ""
                    }`}
                  >
                    <div className="workspaceAi-task-card">
                      <div className="task-header">
                        <Typewriter words={[task.name]} cursor={false} typeSpeed={10} />
                      </div>
                      <div className="task-desc">
                        <Typewriter words={[task.description]} cursor={false} typeSpeed={10} />
                      </div>
                      <div className="task-tags">
                        <span className="task-tag">{task.type?.replace(/[^A-Z,a-z]/g, " ")}</span>
                        <span className="task-tag">{task.assignee}</span>
                      </div>
                    </div>
                    <div className="task-icons">
                        {loadingTasks[task.id] ? (
                          <RotatingLines height="20" width="20" strokeColor="#36C5F0" />
                        ) : (
                          <>
                            {taskStates[task.id] === "approved" ? (
                              <span className="task-icon" style={{ pointerEvents: "none" }}>
                                <img src={TickIcon} alt="tick" />
                              </span>
                            ) : taskStates[task.id] === "rejected" ? (
                              <span className="task-icon" style={{ pointerEvents: "none" }}>
                                <img src={CrossIcon} alt="cross" />
                              </span>
                            ) : (
                              <>
                                <span className="task-icon" onClick={() => handleReject(task.id)}>
                                  <img src={CrossIcon} alt="cross" />
                                </span>
                                <span className="task-icon" onClick={() => handleApprove(task)}>
                                  <img src={TickIcon} alt="tick" />
                                </span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                  </motion.div>
                )}
              </div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkspaceAIPage;
