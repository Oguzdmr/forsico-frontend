import React, { useEffect, useState } from 'react';
import '../../styles/workspaceCss/workspaceAi.css';
import WorkspaceTitleİcon from "../../assets/workspaceAi-title-icon.svg";
import Tickİcon from "../../assets/ai-message-tick-icon.svg";
import Crossİcon from "../../assets/ai-message-cross-icon.svg";
import { useParams } from 'react-router-dom';
import WorkspaceApi from '../../api/BoardApi/workspace.js';
import ForsicoAiApi from '../../api/ForsicoAiApi/forsicoai.js';
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkspaces } from "../../store/workspaceSlice";
import { motion, AnimatePresence } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';

const WorkspaceAIPage = () => {

    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [workspaceDescription, setWorkspaceDescription] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const { workspaceId } = useParams();
    const [workspaceIdState, setWorkspaceIdState] = useState(null);
    const [workspaceName, setWorkspaceName] = useState('New Workspace');
    const [description, setDescription] = useState('New Workspace Desc');
    const [aiTasks, setAiTasks] = useState([]);
    const [visibleTasks, setVisibleTasks] = useState([]);
    const [taskStates, setTaskStates] = useState({}); // Her kartın durumunu tutmak için

    // Animasyon yapılandırması
    const staggerAnimation = {
        visible: {
            transition: {
                staggerChildren: 0.5, // Kartların arka arkaya gelme süresi
            },
        },
    };

    const cardAnimation = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };


    const dispatch = useDispatch();
    const token = useSelector((state) => {
        return state.auth.token.token || "";
    });
    const workspaceApi = new WorkspaceApi();
    const forsicoAiApi = new ForsicoAiApi();

    const getAiTasks = async () => {
        let res = await forsicoAiApi.generateAzureAIContent(workspaceDescription);
        if (res.success) {
            setAiTasks(res.data.result.tasks);
        }
    };

    useEffect(() => {
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

    const handleApprove = (taskId) => {
        setTaskStates((prev) => ({ ...prev, [taskId]: 'approved' }));
    };

    const handleReject = (taskId) => {
        setTaskStates((prev) => ({ ...prev, [taskId]: 'rejected' }));
    };


    const workspaceIdSetter = async () => {
        if (workspaceId === "new") {
            let response = await workspaceApi.createWorkspace(token, workspaceName, description);
            console.log(response);
            if (response.status === true) {
                setWorkspaceIdState(response.data._id);
                dispatch(fetchWorkspaces());
            }

        }
    }

    useEffect(() => {
        workspaceIdSetter();
    }, [workspaceId])
    // Workspace adı değişikliği


    const handleNameSaveClick = async () => {
        let response = await workspaceApi.updateWorkspace(token, workspaceIdState, workspaceName, description);
        console.log(response);
        if (response.status === true) {
            dispatch(fetchWorkspaces());
        }
        setIsEditingName(false);
    };

    const handleDescriptionSaveClick = async () => {
        let response = await workspaceApi.updateWorkspace(token, workspaceIdState, workspaceName, description);
        console.log(response);
        if (response.status === true) {
            dispatch(fetchWorkspaces());
        }
        setIsEditingName(false);
        setIsEditingDescription(false);
    };

    const handleNameChange = (e) => {
        setWorkspaceName(e.target.value);
    };

    const handleNameEditClick = () => {
        setIsEditingName(true);
    };

    const handleDescriptionEditClick = () => {
        setIsEditingDescription(true);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };




    return (
        <div className="workspaceAi-container">
            <div className="workspaceAi-top">
                <div className='workspaceAi-title-div'>
                    {isEditingName ? (
                        <>
                            <input
                                className="workspaceAi-title-input"
                                type="text"
                                placeholder="Workspace Name"
                                onChange={handleNameChange}
                                value={workspaceName}
                            />
                            <button className="workspaceAi-save-btn" onClick={handleNameSaveClick}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className="workspaceAi-title" onClick={handleNameEditClick}>{workspaceName}</span>
                            <img src={WorkspaceTitleİcon} alt="Workspace Icon" />
                        </>
                    )}
                </div>

                <div className='workspaceAi-description-div'>
                    {isEditingDescription ? (
                        <>
                            <input
                                className="workspaceAi-description-input"
                                type="text"
                                placeholder="Description"
                                onChange={handleDescriptionChange}
                                value={description}
                            />
                            <button className="workspaceAi-description-save-btn" onClick={handleDescriptionSaveClick}>Save</button>
                        </>
                    ) : (
                        <>
                            <span className="workspaceAi-description" onClick={handleDescriptionEditClick}>{description}</span>
                        </>
                    )}
                </div>

                <div className="workspaceAi-input-div">
                    <textarea
                        className="workspaceAi-input"
                        value={workspaceDescription}
                        onChange={(e) => setWorkspaceDescription(e.target.value)}
                        placeholder="Describe the job..."
                    />
                    <button
                        className="workspaceAi-generate-btn"
                        onClick={getAiTasks}
                        disabled={workspaceDescription.trim() === ''}
                    >
                        Generate
                    </button>
                </div>

                <motion.div
          className="workspaceAi-message"
          variants={staggerAnimation}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {visibleTasks.map((task) => (
              <div key={task.id}>
                <h1 className='blue-letter workspaceAi-response-title'>{task.name}</h1>

                {task.subtasks.map((subtask) => (
                  <motion.div
                    key={subtask.id}
                    variants={cardAnimation}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`workspaceAi-task ${taskStates[subtask.id] === 'rejected' ? 'rejected-task' : ''}`}
                  >
                    <div className="workspaceAi-task-card">
                      <div className="task-header">
                        <Typewriter words={[subtask.name]} cursor={false} typeSpeed={10} />
                      </div>
                      <div className="task-desc">
                        <Typewriter words={[subtask.description]} cursor={false} typeSpeed={10} />
                      </div>
                      <div className='task-tags'>
                        <span className='task-tag'>
                          {subtask.type.replace(/[^A-Z,a-z]/g, ' ')}
                        </span>
                        <span className='task-tag'>{subtask.assignee}</span>
                      </div>
                    </div>
                    <div className="task-icons">
                      {taskStates[subtask.id] !== 'approved' && (
                        <span className="task-icon" onClick={() => handleReject(subtask.id)}>
                          <img src={Crossİcon} alt="cross" />
                        </span>
                      )}
                      {taskStates[subtask.id] !== 'rejected' && (
                        <span className="task-icon" onClick={() => handleApprove(subtask.id)}>
                          <img src={Tickİcon} alt="tick" />
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </AnimatePresence>
        </motion.div>
            </div>
        </div>
    );
};

export default WorkspaceAIPage;