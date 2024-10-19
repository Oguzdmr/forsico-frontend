import React, { useEffect, useState } from 'react';
import '../../styles/workspaceCss/workspaceAi.css';
import WorkspaceTitleİcon from "../../assets/workspaceAi-title-icon.svg"
import Tickİcon from "../../assets/ai-message-tick-icon.svg"
import Crossİcon from "../../assets/ai-message-cross-icon.svg"
import { useParams } from 'react-router-dom';
import WorkspaceApi from '../../api/BoardApi/workspace.js';
import ForsicoAiApi from '../../api/ForsicoAiApi/forsicoai.js';
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkspaces } from "../../store/workspaceSlice";


const WorkspaceAIPage = () => {
    const { workspaceId} = useParams();
    const [workspaceIdState, setWorkspaceIdState] = useState(null)
    const [workspaceName, setWorkspaceName] = useState('New Workspace');
    const [description, setDescription] = useState('New Workspace Desc');
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [workspaceDescription, setWorkspaceDescription] = useState('');
    const [aiTasks, setAiTasks] = useState([])
    const dispatch = useDispatch();
    const token = useSelector((state) => {
        return state.auth.token.token || "";
      });
    
    const workspaceApi = new WorkspaceApi();
    const forsicoAiApi = new ForsicoAiApi();

    const [tasks, setTasks] = useState([
        { id: 1, name: 'Create design system for Forsico', tags: ['ui design', 'marketing'] },
        { id: 2, name: 'Create content strategy for Forsico', tags: ['content', 'marketing'] }
    ]);

    useEffect(async () => {
        if(workspaceId === "new"){
            let response = await workspaceApi.createWorkspace(token,workspaceName,description);
            console.log(response);
            if(response.status === true){
                setWorkspaceIdState(response.data._id);
                dispatch(fetchWorkspaces());
            }
            
        }
    },[workspaceId])
    // Workspace adı değişikliği

    const getAiTasks = async () => {
        let res = await forsicoAiApi.generateAzureAIContent(workspaceDescription);
        console.log(res)
        if(res.success){
            setAiTasks(res.data.result.tasks)
        }
    }
    const handleNameChange = (e) => {
        setWorkspaceName(e.target.value);
    };

    const handleNameEditClick = () => {
        setIsEditingName(true);
    };

    const handleNameSaveClick = async () => {
        let response = await workspaceApi.updateWorkspace(token, workspaceIdState, workspaceName, description);
            console.log(response);
            if(response.status === true){
                dispatch(fetchWorkspaces());
            }
        setIsEditingName(false);
    };

    // Description değişikliği
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleDescriptionEditClick = () => {
        setIsEditingDescription(true);
    };

    const handleDescriptionSaveClick = async () => {
        let response = await workspaceApi.updateWorkspace(token, workspaceIdState, workspaceName, description);
            console.log(response);
            if(response.status === true){
                dispatch(fetchWorkspaces());
            }
        setIsEditingName(false);
        setIsEditingDescription(false);
    };

    return (
        <>

                <div className="workspaceAi-container">
                    <div className='workspaceAi-top'>
                        {/* Workspace adı ve description alanı */}
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

                        {/* Description alanı */}
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

                        {/* Kullanıcı girdisi */}
                        <div className='workspaceAi-input-div'>
                            <div className='textarea-container'>
                                <textarea
                                    className='workspaceAi-input'
                                    value={workspaceDescription}
                                    onChange={(e) => setWorkspaceDescription(e.target.value)}
                                    placeholder="Describe the job you want to do in a few sentences. You can upload visuals or documents related to your business idea so that you can get a more detailed plan."
                                />
                                <div className='textarea-icons'>
                                    <img className='workspaceAi-icon' src="./workspaceAi-image-icon.svg" alt="Upload Image" />
                                    <img className='workspaceAi-icon' src="./workspaceAi-link-icon.svg" alt="Attach Link" />
                                    <img className='workspaceAi-icon' src="./workspaceAi-file-icon.svg" alt="Attach File" />
                                    <button className="workspaceAi-generate-btn" disabled={workspaceDescription.trim() === ''} onClick={() => getAiTasks()} >Generate</button>
                                </div>
                            </div>
                        </div>

                        {/* Girdi ve çıktı alanı textarea'nın altında */}
                        <div className='workspaceAi-message'>
                            {aiTasks.map((task) => (
                                <div key={task.id}>
                                    <p>{task.name}</p>
                                    {task.subtasks.map((subtask)=>(
                                        <div key={subtask.id} className='workspaceAi-task'>
                                            <div className='workspaceAi-task-card'>
                                                <div className='task-header'>
                                                    <p>{subtask.name}</p>
                                                </div>
                                                <div className='task-desc'>
                                                    <p>{subtask.description}</p>
                                                </div>
                                                <div className='task-tags'>
                                                   
                                                        <span className='task-tag'>{subtask.type}</span>
                                                        <span className='task-tag'>{subtask.assignee}</span>
                            
                                                </div>
                                            </div>
                                            <div className='task-icons'>
                                                <span className='task-icon'><img src={Tickİcon} alt="tick" /></span>
                                                <span className='task-icon'><img src={Crossİcon} alt="cross" /></span>
                                            </div>
                                        </div>
                                    ))}
                                
                                </div>
                            ))}
                            <div>

                            </div>
                        </div>
                    </div>
                </div>
            
        </>
    );
};

export default WorkspaceAIPage;