import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ForsicoAiApi from "../../api/ForsicoAiApi/forsicoai.js";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/workspaceCss/TaskModal.css";
import Plus from "../../assets/sidebar-plus-icon.svg";
import Assignees from "../../assets/taskcard-info-assignees.svg";
import DueDate from "../../assets/taskcard-info-duedate.svg";
import DeleteIcon from "../../assets/delete-comment.svg";
import EditIcon from "../../assets/edit-comment.svg";
import Status from "../../assets/taskcard-info-status.svg";
import Priority from "../../assets/taskcard-info-priority.svg";
import RightArrow from "../../assets/taskcard-info-rightarrow.svg";
import Comment from "../../assets/taskcard-info-comment.svg";
import Cross from "../../assets/taskcard-info-cross.svg";
import TextEditor from "../Editor/TextEditor";
import AddMemberIcon from "../../assets/addMemberIcon.svg";
import ModalPlus from "../../assets/status-modal-plus.svg";
import UrgentFlag from "../../assets/redFlag.svg";
import HighFlag from "../../assets/blueFlag.svg";
import NormalFlag from "../../assets/taskcard-info-priority.svg";
import { motion, AnimatePresence } from "framer-motion";
import Tickİcon from "../../assets/ai-message-tick-icon.svg";
import Crossİcon from "../../assets/ai-message-cross-icon.svg";
import { fetchTask, updateTaskStatus } from "../../store/taskSlice.js";
import { RotatingLines } from "react-loader-spinner";
import TaskApi from "../../api/BoardApi/task.js"

const TaskModal = ({ taskId, listId, workspaceId, boardId, setIsTaskModalOpen }) => {

  const taskApi = new TaskApi();
  
  const {
    entities,
    status = "idle",
    error,
  } = useSelector((state) => {
    return state.task || {};
  });

  const priorityOptions = [
    { label: "Urgent", icon: UrgentFlag },
    { label: "High", icon: HighFlag },
    { label: "Normal", icon: NormalFlag },
  ];
  const board = useSelector((state) => state.board.entities);
  const selectedTask = entities.selectedtask || {};
  const [description, setDescription] = useState(
    entities.selectedtask?.description || ""
  );
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const [subtaskStates, setSubtaskStates] = useState({});
  const [generatedSubtasks, setGeneratedSubtasks] = useState([]);
  const [visibleSubtasks, setVisibleSubtasks] = useState([]);
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [tempDescription, setTempDescription] = useState(description);
  const [isGeneratingSubtask, setIsGeneratingSubtask] = useState(false);
  const [comments, setComments] = useState([]);
  const [tempComment, setTempComment] = useState("");
  const [isCommentEditing, setIsCommentEditing] = useState(false);
  const [isAssigneeModalOpen, setAssigneeModalOpen] = useState(false);
  const [isStatusModalOpen, setStatusModalOpen] = useState(false);
  const [isPriorityModalOpen, setPriorityModalOpen] = useState(false); // New state for Priority Modal
  const [isRightArrowModalOpen, setIsRightArrowModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSubtaskMessage, setShowSubtaskMessage] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(
    entities.selectedtask?.statusId?.name || ""
  );
  const [selectedAssignee, setSelectedAssignee] = useState({
    id: entities.selectedtask?.assignee?._id || "",
    avatar: entities.selectedtask?.assignee?.profilePicture || "",
    name: entities.selectedtask?.assignee?.firstName || "",
  });
  const [selectedPriority, setSelectedPriority] = useState(
    entities.selectedtask?.priority
      ? priorityOptions[entities.selectedtask.priority]
      : { label: "", icon: "" }
  );
  const assigneeModalRef = useRef(null);
  const statusModalRef = useRef(null);
  const priorityModalRef = useRef(null); // Ref for priority modal
  const rightArrowModalRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(
    entities.selectedtask.dueDate || null
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState(entities.selectedtask?.name || "");
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // Track index of comment being edited
  const [editedComment, setEditedComment] = useState("");
  
  const [statusOptions, setStatusOptions] = useState([]);
  const forsicoAiApi = new ForsicoAiApi();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token.token || "");

  useEffect(() => {
    setDescription(selectedTask.description || "");
    setTaskTitle(selectedTask.name || "");
    setSelectedStatus(selectedTask.statusId?.name || "");
    setSelectedAssignee({
      id: selectedTask.assignee?._id || "",
      avatar: selectedTask.assignee?.profilePicture || "",
      name: selectedTask.assignee?.firstName || "",
    });
    setSelectedPriority(selectedTask.priority || "");
    setSelectedDate(selectedTask.dueDate || null);
  }, [selectedTask]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTask({ token, workspaceId, taskId }));
    }
  }, [dispatch, status]);

  useEffect(() => {
    dispatch(updateTaskStatus({ status: "idle" }));
    getTaskStatuses();
    getComments();

  }, [taskId]);

  const getTaskStatuses = async () => {
    try {
      if(taskId){
        let statuses = await taskApi.getTaskStatus(token, workspaceId, boardId);
        if(statuses.status){
          setStatusOptions(statuses.data)
        }
        
        console.log("statuses", statuses)
        
      }
      
    } catch (error) {
     
    }
  }

  const getComments = async () => {
    try {
      
      if(taskId){
        
        let commentsApi = await taskApi.getTaskComments(token, workspaceId, taskId);
        if(commentsApi.status){
          setComments(commentsApi.data)
        }
        
        console.log("comments",commentsApi)
      }
    } catch (error) {
      console.log("comment error")
    }
  }

  const addComment = (newComment) => {
    try {
      taskApi.postTaskComment(token, workspaceId, taskId, newComment)
    } catch (error) {
      
    }
  }
  const generateSubtasks = async (subtaskTitle) => {
    if (!subtaskTitle.trim()) {
      console.log("Please enter a valid subtask title");
      setIsLoading(false); // Hata durumunda loading'i false yap
      return;
    }

    try {
      let response = await forsicoAiApi.generateAzureAIContent(subtaskTitle);
      if (response.success) {
        setGeneratedSubtasks(response.data.result.tasks);
        setVisibleSubtasks([]); // Yeni cevap geldiğinde listeyi temizle
      } else {
        console.error("Error in generating subtasks:", response.error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Cevap geldiğinde loading durumunu false yap
    }
  };

  const staggerAnimation = {
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const cardAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };
  // Retrieve user info from Redux store
  const boardMembers = useSelector((state) => state.board.entities.members);


  const sendOptions = ["UX/UI Board", "Markenting Board", "Social Media Board"]; // Status options

  const handleFieldUpdate = async (field, value) => {
    try {
      await taskApi.updateTask(token, workspaceId, taskId, { [field]: value });
      dispatch(fetchTask({ token, workspaceId, taskId }));
    } catch (error) {
      console.error(`Error updating task ${field}:`, error);
    }
  };

  const handleSaveDescription = () => {
    if (tempDescription.trim() !== "") {
      // Check if the new description is not just whitespace
      setDescription(tempDescription); // Update the main description state
      handleFieldUpdate("description", tempDescription);
    }
    setIsDescriptionEditing(false); // Exit editing mode
  };

  const handleSaveComment = () => setIsCommentEditing(false);

  // const handleGenerateSubtask = () => {
  //   console.log("Generated Subtask:", subtaskTitle); // Here, you can add logic to save the subtask
  //   setIsGeneratingSubtask(false); // Close input box after generating
  // };

  const toggleAssigneeModal = () => {
    console.log("Toggled Assignee Modal");
    setAssigneeModalOpen(!isAssigneeModalOpen);
  };

  const toggleStatusModal = () => {
    console.log("Toggled Status Modal");
    setStatusModalOpen(!isStatusModalOpen);
  };

  const togglePriorityModal = () => {
    console.log("Toggled Priority Modal");
    setPriorityModalOpen(!isPriorityModalOpen);
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status.name);
    handleFieldUpdate("statusId", status._id)
    setStatusModalOpen(false);
  };

  const handleRoot = () => { };

  const handlePrioritySelect = (priority) => {
    setSelectedPriority(priority); // Save both label and icon
    setPriorityModalOpen(false);
  };

  const toggleDescriptionEditing = () => {
    setIsDescriptionEditing((prev) => !prev); // Düzenleme modunu tersine çevir
  };

  const handleAssigneeSelect = (userInfo) => {
    handleFieldUpdate("assignee", userInfo._id)
    setSelectedAssignee({
      id: userInfo._id,
      avatar: userInfo.profilePicture,
      name: `${userInfo.firstName} ${userInfo.lastName}`,
    });
    setAssigneeModalOpen(false);
  };

  const toggleRightArrowModal = () => {
    setIsRightArrowModalOpen(!isRightArrowModalOpen);
  };

  const handleToggleSubtaskGeneration = () => {
    setIsLoading(true); // Butona tıklanınca loading durumunu true yap
    setShowSubtaskMessage(false); // Butona tıklanınca mesaj kaybolsun
    setVisibleSubtasks([]); // Önceki cevapları temizle
    generateSubtasks(description); // Description alanındaki değeri kullanarak generateSubtasks fonksiyonunu çağır
    console.log("Subtask generation triggered with description:", description);
  };

  const handleSaveTitle = (name) => {
    handleFieldUpdate("name", name)
    setIsTitleEditing(false);
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "Urgent":
        return UrgentFlag;
      case "High":
        return HighFlag;
      case "Normal":
      default:
        return NormalFlag;
    }
  };

  const handleDatePickerToggle = () => {
    setIsDatePickerOpen((prev) => !prev); // Toggle date picker visibility
  };

  const handleDateChange = (date) => {
    handleFieldUpdate("dueDate", date)
    setSelectedDate(date);
    setIsDatePickerOpen(false); // Close date picker after selection
  };

  const handleAddComment = () => {
    if (tempComment.trim()) {
      addComment(tempComment);
      setComments([...comments, tempComment]); // Yeni yorumu ekle
      setTempComment(""); // Geçici durumu sıfırla
      setIsCommentEditing(false); // Düzenleme modunu kapat
    }
  };

  const handleEditComment = (index) => {
    setEditingIndex(index); // Set the comment to edit mode
    setEditedComment(comments[index]); // Load the existing comment text into temp storage
  };

  const handleSaveEditedComment = (index) => {
    const updatedComments = comments.map((comment, i) =>
      i === index ? editedComment : comment
    );
    setComments(updatedComments); // Update the comments list
    setEditingIndex(null); // Exit edit mode
    setEditedComment(""); // Clear temp storage
  };

  const handleDeleteComment = (index) => {
    console.log(`Delete comment at index ${index}`);
  };

  const handleApprove = (subtask) => {
    setSubtaskStates((prev) => ({ ...prev, [subtask.id]: "approved" }));
  };

  const handleReject = (subtaskId) => {
    setSubtaskStates((prev) => ({ ...prev, [subtaskId]: "rejected" }));
  };

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < generatedSubtasks.length) {
        setVisibleSubtasks((prev) => [...prev, generatedSubtasks[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [generatedSubtasks]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close modals on outside click
      if (
        assigneeModalRef.current &&
        !assigneeModalRef.current.contains(event.target)
      ) {
        setAssigneeModalOpen(false);
      }
      if (
        statusModalRef.current &&
        !statusModalRef.current.contains(event.target)
      ) {
        setStatusModalOpen(false);
      }
      if (
        priorityModalRef.current &&
        !priorityModalRef.current.contains(event.target)
      ) {
        setPriorityModalOpen(false);
      }
      if (
        rightArrowModalRef.current &&
        !rightArrowModalRef.current.contains(event.target)
      ) {
        setIsRightArrowModalOpen(false); // Close Right Arrow modal
      }
      if (isDatePickerOpen && !event.target.closest(".datepicker-wrapper")) {
        setIsDatePickerOpen(false); // Close date picker
      }

      // Check if clicking outside the description or comment editing areas
      if (
        !event.target.closest(".taskcard-info-description-area") &&
        isDescriptionEditing
      ) {
        setIsDescriptionEditing(false); // Exit description editing mode
      }

      if (
        !event.target.closest(".taskcard-info-comment-area") &&
        isCommentEditing
      ) {
        setIsCommentEditing(false); // Exit comment editing mode
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    assigneeModalRef,
    statusModalRef,
    priorityModalRef,
    rightArrowModalRef,
    isDatePickerOpen,
    isDescriptionEditing,
    isCommentEditing,
  ]);

  if (status === "loading") {
    return (
      <div className="modal-wrapper">
        <div className="modal-content-trello">
          <div className="loader-container">
            <RotatingLines height="50" width="50" strokeColor="#36C5F0" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-wrapper">
      <div className={`modal-content-trello`}>
        <div className="taskcard-info-upper-area">
          <div className="taskcard-info-left-upper">
            <span>Forsico/General</span>
          </div>
          <div className="taskcard-info-right-upper">
            <img
              src={RightArrow}
              alt="taskcard-info-right-arrow"
              onClick={toggleRightArrowModal}
            />
            <img
              src={Cross}
              alt="taskcard-info-cross"
              onClick={() => setIsTaskModalOpen(false)}
              style={{ cursor: "pointer" }}
            />

            {isRightArrowModalOpen && (
              <div className="right-arrow-modal" ref={rightArrowModalRef}>
                <div className="right-arrow-modal-header">
                  <h3 className="right-arrow-modal-title">
                    Send from board General to...
                  </h3>
                </div>
                <div className="right-arrow-options">
                  {sendOptions.map((board) => (
                    <div
                      key={board}
                      className="right-arrow-option"
                      onClick={() => handleRoot(board)}
                    >
                      {board}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="taskcard-info-line"></div>
        <div className="taskcard-info-lower-area">
          <div className="taskcard-info-left-lower">
            <div className="taskcard-info-title-area">
              {isTitleEditing ? (
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  onBlur={(e) => handleSaveTitle(e.target.value)}
                  autoFocus
                  className="task-title-input" // Add a custom class for styling
                />
              ) : (
                <p
                  className="taskcard-info-title"
                  onClick={() => setIsTitleEditing(true)}
                >
                  {taskTitle}
                </p>
              )}
            </div>

            {/* Description Section */}
            <div className="taskcard-info-description-area">
              {isDescriptionEditing ? (
                <div>
                  <TextEditor
                    value={tempDescription} // Düzenleme alanındaki değer
                    setValue={setTempDescription} // Değeri güncelleme fonksiyonu
                  />
                  <button
                    onClick={
                      isDescriptionEditing
                        ? handleSaveDescription
                        : toggleDescriptionEditing
                    }
                    className="save-description-button"
                  >
                    {isDescriptionEditing ? "Save" : "Edit"} {/* Buton metni */}
                  </button>
                </div>
              ) : (
                <div
                  className="taskcard-info-textarea"
                  onClick={toggleDescriptionEditing} // Düzenleme moduna geçiş
                  dangerouslySetInnerHTML={{ __html: description }} // HTML içeriğini güvenli bir şekilde göster
                />
              )}
            </div>

            {/* Comment Section */}
            <div className="taskcard-info-comment-area">
              {isCommentEditing ? (
                <TextEditor value={tempComment} setValue={setTempComment} />
              ) : (
                <div
                  className="taskcard-info-textarea"
                  onClick={() => setIsCommentEditing(true)}
                >
                  <div className="add-comment-prompt">Add New Comment!!</div>
                </div>
              )}

              {isCommentEditing && (
                <button
                  onClick={handleAddComment}
                  className="save-description-button"
                >
                  Save
                </button>
              )}

              {/* Comments section title */}
              <h3 className="comments-title">Comments</h3>

              {/* Display list of comments */}
              <div className="taskcard-info-comments-list">
                {comments.map((comment, index) => (
                  <div
                    key={index}
                    className="taskcard-info-textarea comment-item"
                  >
                    {editingIndex === index ? (
                      <>
                        <TextEditor
                          value={editedComment}
                          setValue={setEditedComment}
                        />
                        <button
                          onClick={() => handleSaveEditedComment(index)}
                          className="save-description-button"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <div
                          className="comment-content"
                          dangerouslySetInnerHTML={{ __html: comment.content }}
                        />
                        <div className="comment-icons">
                          <img
                            src={EditIcon}
                            alt="edit icon"
                            className="comment-icon"
                            onClick={() => handleEditComment(index)}
                          />
                          <img
                            src={DeleteIcon}
                            alt="delete icon"
                            className="comment-icon"
                            onClick={() => handleDeleteComment(index)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Render Generated Subtasks */}
            {/* Subtask Generation Section */}
            <div className="taskcard-info-subtask-area">
              {showSubtaskMessage && (
                <p className="subtask-message">Create subtasks of this task</p>
              )}
              {isLoading ? (
                <div className="loader-container-top-left">
                  <RotatingLines height="30" width="30" strokeColor="#36C5F0" />
                </div>
              ) : (
                <button
                  onClick={handleToggleSubtaskGeneration}
                  className="generate-subtask-button"
                >
                  Generate Subtasks
                </button>
              )}

              {/* Display generated subtasks */}
              <motion.div
                className="workspaceAi-message"
                variants={staggerAnimation}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {visibleSubtasks.map((task) => (
                    <div key={task.id}>
                      <motion.div
                        key={task.id}
                        variants={cardAnimation}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`workspaceAi-task ${subtaskStates[task.id] === "rejected"
                            ? "rejected-task"
                            : ""
                          }`}
                      >
                        <div className="workspaceAi-task-card">
                          <div className="task-header">{task.name}</div>
                          <div className="task-desc">{task.description}</div>
                          <div className="task-tags">
                            <span className="task-tag">{task.type}</span>
                            <span className="task-tag">{task.assignee}</span>
                          </div>
                        </div>
                        <div className="task-icons">
                          <span
                            className="task-icon"
                            onClick={() => handleReject(task.id)}
                          >
                            <img src={Crossİcon} alt="Reject" />
                          </span>
                          <span
                            className="task-icon"
                            onClick={() => handleApprove(task)}
                          >
                            <img src={Tickİcon} alt="Approve" />
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            <div className="taskcard-info-checklist-area">
              <input className="checklist-checkbox" type="checkbox" />
              <p className="taskcard-info-gray-letter">
                Create a checklist for this task
              </p>
            </div>
          </div>

          <div className="taskcard-info-right-lower">
            <div className="taskcard-info-assignees">
              <a className="td-none" href="#" onClick={toggleAssigneeModal}>
                <img
                  src={Assignees}
                  alt="assignees"
                  className="assignees-icon"
                />
                Assignees
              </a>

              {selectedAssignee.avatar ? (
                <img
                  src={selectedAssignee.avatar}
                  alt="selected assignee avatar"
                  className="selected-assignee-avatar"
                />
              ) : (
                <img src={Plus} alt="plus" onClick={toggleAssigneeModal} />
              )}

              {isAssigneeModalOpen && (
                <div className="assignee-modal" ref={assigneeModalRef}>
                  <div className="assignee-modal-header">
                    <h3 className="assignee-modal-title">Assignees</h3>
                    <img
                      src={AddMemberIcon}
                      alt="Add Member"
                      className="add-member-icon"
                      onClick={() => setAssigneeModalOpen(false)}
                    />
                  </div>
                  <div className="assignee-modal-divider"></div>
                  {boardMembers.map((member) => (
                    <div
                      className="assignee-modal-content"
                      onClick={() => handleAssigneeSelect(member)}
                    >
                      <img
                        src={member.profilePicture}
                        alt="Profile"
                        className="assignee-avatar"
                      />
                      <div className="assignee-name">
                        {member.firstName} {member.lastName}
                      </div>
                    </div>
                  ))}

                </div>
              )}
            </div>

            <div className="taskcard-info-due-date">
              <a
                className="td-none"
                href="#"
                onClick={() => setIsDatePickerOpen(true)}
              >
                <img src={DueDate} alt="duedate" />
                Due Date
              </a>
              {selectedDate ? (
                <a
                  className="taskmodal-selected-date"
                  onClick={() => setIsDatePickerOpen(true)}
                >
                  {format(selectedDate, "MMMM dd")}
                </a>
              ) : (
                <img
                  src={Plus}
                  alt="plus"
                  onClick={() => setIsDatePickerOpen(true)}
                />
              )}
              {isDatePickerOpen && (
                <div className="datepicker-wrapper">
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="dd MMMM"
                    className="custom-datepicker"
                    popperPlacement="bottom"
                    inline
                  />
                </div>
              )}
            </div>

            <div className="taskcard-info-status">
              <a className="td-none" href="#" onClick={toggleStatusModal}>
                <img src={Status} alt="status" />
                Status
              </a>
              {selectedStatus ? (
                <span className="status-text">{selectedStatus}</span>
              ) : (
                <img src={Plus} alt="plus" onClick={toggleStatusModal} />
              )}

              {isStatusModalOpen && (
                <div className="status-modal" ref={statusModalRef}>
                  <div className="status-modal-header">
                    <h3 className="status-modal-title">Status</h3>
                  </div>
                  <div className="status-modal-divider"></div>
                  <div className="status-options">
                    {statusOptions.map((status) => (
                      <div
                        key={status._id}
                        className="status-option"
                        onClick={() => handleStatusSelect(status)}
                      >
                        {status.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="taskcard-info-priority">
              <a className="td-none" href="#" onClick={togglePriorityModal}>
                <img src={Priority} alt="priority icon" />
                Priority
              </a>

              {selectedPriority.label ? (
                <div className="selected-priority">
                  <img
                    src={selectedPriority.icon}
                    alt="selected priority icon"
                    className="priority-icon"
                  />
                  <span className="priority-label">
                    {selectedPriority.label}
                  </span>{" "}
                  {/* Show the priority label */}
                </div>
              ) : (
                <img src={Plus} alt="plus" onClick={togglePriorityModal} />
              )}

              {isPriorityModalOpen && (
                <div className="priority-modal" ref={priorityModalRef}>
                  <div className="priority-modal-header">
                    <h3 className="priority-modal-title">Priority</h3>
                  </div>
                  <div className="priority-modal-divider"></div>
                  <div className="priority-options">
                    {priorityOptions.map((priority) => (
                      <div
                        key={priority.label}
                        className="priority-option"
                        onClick={() => handlePrioritySelect(priority)}
                      >
                        <img
                          src={priority.icon}
                          alt={`${priority.label} icon`}
                        />
                        {priority.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
