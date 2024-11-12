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
import TEditor from "../Editor/TEditor.js";
import AddMemberIcon from "../../assets/addMemberIcon.svg";
import ModalPlus from "../../assets/status-modal-plus.svg";
import UrgentFlag from "../../assets/redFlag.svg";
import HighFlag from "../../assets/blueFlag.svg";
import NormalFlag from "../../assets/taskcard-info-priority.svg";
import { motion, AnimatePresence } from "framer-motion";
import Tickİcon from "../../assets/ai-message-tick-icon.svg";
import Crossİcon from "../../assets/ai-message-cross-icon.svg";
import { fetchTask, updateTaskStatus, reset } from "../../store/taskSlice.js";
import { fetchBoard, updateStatus } from "../../store/boardSlice";
import { RotatingLines } from "react-loader-spinner";
import TaskApi from "../../api/BoardApi/task.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { addTask } from "../../store/boardSlice.js";
import UserAvatar from "../../components/WorkspaceAndBoard/UserAvatar.js";

const TaskModal = ({
  taskId,
  listId,
  workspaceId,
  boardId,
  setIsTaskModalOpen,
}) => {
  const taskApi = new TaskApi();

  const {
    entities,
    status = "idle",
    error,
  } = useSelector((state) => {
    return state.task || {};
  });

  const priorityOptions = [
    { label: "Urgent", icon: UrgentFlag, index: 0 },
    { label: "High", icon: HighFlag, index: 1 },
    { label: "Normal", icon: NormalFlag, index: 2 },
  ];

  const board = useSelector((state) => state.board.entities);
  const selectedTask = entities.selectedtask || {};
  const [description, setDescription] = useState(
    entities.selectedtask?.description || ""
  );
  const [loadingTasks, setLoadingTasks] = useState({});
  const workspaceField = useSelector((state) => {
    return state.workspaces.entities;
  })?.filter((x) => x._id === workspaceId)[0];
  const userField = useSelector((state) => state.auth.user || {});
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
    lastname: entities.selected?.assignee?.lastName || "",
  });
  const [selectedPriority, setSelectedPriority] = useState(
    entities.selectedtask?.priority
      ? priorityOptions[entities.selectedtask.priority]
      : { label: "", icon: "" }
  );

  console.log("selected prio", selectedPriority);
  const assigneeModalRef = useRef(null);
  const statusModalRef = useRef(null);
  const priorityModalRef = useRef(null);
  const rightArrowModalRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(
    entities?.selectedtask?.dueDate || null
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState(entities.selectedtask?.name || "");
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedComment, setEditedComment] = useState("");

  const [statusOptions, setStatusOptions] = useState([]);
  const forsicoAiApi = new ForsicoAiApi();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token.token || "");

  useEffect(() => {
    setDescription(selectedTask.description || "");
    setTempDescription(selectedTask.description || "");
    setTaskTitle(selectedTask.name || "");
    setSelectedStatus(selectedTask.statusId?.name || "");
    setSelectedAssignee({
      id: selectedTask.assignee?._id || "",
      avatar: selectedTask.assignee?.profilePicture || "",
      name: selectedTask.assignee?.firstName || "",
      lastname: selectedTask.assignee?.lastName || "",
    });

    setSelectedPriority(priorityOptions[selectedTask.priority]);
    setSelectedDate(selectedTask.dueDate || null);
  }, [selectedTask]);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTask({ token, workspaceId, taskId })).finally(() => {
        getTaskStatuses();
        getComments();
      });
    }
  }, [dispatch, status]);

  useEffect(() => {
    dispatch(updateTaskStatus({ status: "idle" }));
  }, [taskId]);

  const getTaskStatuses = async () => {
    try {
      if (taskId) {
        let statuses = await taskApi.getTaskStatus(token, workspaceId, boardId);
        if (statuses.status) {
          setStatusOptions(statuses.data);
        }

        console.log("statuses", statuses);
      }
    } catch (error) {}
  };

  const getComments = async () => {
    try {
      if (taskId) {
        let commentsApi = await taskApi.getTaskComments(
          token,
          workspaceId,
          taskId
        );
        if (commentsApi.status) {
          setComments(commentsApi.data);
        }

        console.log("comments", commentsApi);
      }
    } catch (error) {
      console.log("comment error");
    }
  };

  const addComment = (newComment) => {
    try {
      taskApi.postTaskComment(token, workspaceId, taskId, newComment);
    } catch (error) {}
  };
  const generateSubtasks = async (subtaskTitle) => {
    if (!subtaskTitle.trim()) {
      console.log("Please enter a valid subtask title");
      setIsLoading(false);
      return;
    }

    try {
      let response = await forsicoAiApi.generateAzureAISubTaskContent(subtaskTitle);
      if (response.success) {
        setGeneratedSubtasks(response.data.result.tasks);
        setVisibleSubtasks([]);
      } else {
        console.error("Error in generating subtasks:", response.error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
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
  const boardMembers = useSelector((state) => state.board.entities.members);

  const handleFieldUpdate = async (field, value) => {
    try {
      await taskApi.updateTask(token, workspaceId, taskId, { [field]: value });
    } catch (error) {
      console.error(`Error updating task ${field}:`, error);
    }
  };
  const handleRoot = async (newBoardField) => {
    taskApi
      .changeTaskBoard(token, workspaceId, taskId, {
        listId: newBoardField.lists[0]._id,
        boardId: newBoardField._id,
      })
      .then(() => {
        window.location.replace(
          `/workspaces/board/${workspaceId}/${newBoardField._id}`
        );
      });
  };

  const handleSaveDescription = () => {
    if (tempDescription.trim() !== "") {
      console.log("temp desc", tempDescription);
      setDescription(tempDescription);
      handleFieldUpdate("description", tempDescription);
    }
    setIsDescriptionEditing(false);
  };

  const handleSaveComment = () => {};

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
    handleFieldUpdate("statusId", status._id);
    setStatusModalOpen(false);
  };

  const handlePrioritySelect = (priority) => {
    handleFieldUpdate("priority", priority.index);
    setSelectedPriority(priority);
    setPriorityModalOpen(false);
  };

  const toggleDescriptionEditing = () => {
    if (selectedTask._id) {
      setIsDescriptionEditing((prev) => !prev);
    }
  };

  const handleAssigneeSelect = async (userInfo) => {
    await taskApi.changeAssignee(
      token,
      workspaceId,
      selectedTask._id,
      userInfo.id
    );
    setSelectedAssignee({
      id: userInfo._id,
      avatar: userInfo.profilePicture,
      name: userInfo.firstName,
      lastname: userInfo.lastName,
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
    handleFieldUpdate("name", name);
    setIsTitleEditing(false);
  };

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
    handleFieldUpdate("dueDate", date);
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
    const comment = comments[index];
    if (comment && comment.content) {
      setEditingIndex(index);
      setEditedComment(comment.content);
    } else {
      console.warn(`Comment at index ${index} is undefined or has no content`);
    }
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

  const handleApprove = async (subtask) => {
    setLoadingTasks((prev) => ({ ...prev, [subtask.id]: true }));
    let responseCreateSubtask = await taskApi.createTask(token, workspaceId, {
      name: subtask.name,
      description: subtask.description,
      boardId: selectedTask.boardId,
      listId: selectedTask.listId,
      assignee: userField.id,
      ownerId: userField.id,
      priority: 2,
      parentTask: selectedTask._id,
    });
    console.log(subtask);
    console.log("res subtask", responseCreateSubtask);
    if (responseCreateSubtask.status) {
      setSubtaskStates((prev) => ({ ...prev, [subtask.id]: "approved" }));
      setLoadingTasks((prev) => ({ ...prev, [subtask.id]: false }));
      dispatch(
        addTask({
          name: subtask.name,
          description: subtask.description,
          boardId: selectedTask.boardId,
          listId: selectedTask.listId,
          userId: userField.id,
          parentId: selectedTask._id,
          taskId: responseCreateSubtask.data._id,
        })
      );
      dispatch(fetchBoard({ workspaceId, boardId }));
    }
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
        setIsRightArrowModalOpen(false);
      }
      if (isDatePickerOpen && !event.target.closest(".datepicker-wrapper")) {
        setIsDatePickerOpen(false);
      }

      if (
        !event.target.closest(".taskcard-info-comment-area") &&
        isCommentEditing
      ) {
        setIsCommentEditing(false);
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
        <div className="modal-content-task">
          <div className="loader-container">
            <RotatingLines height="50" width="50" strokeColor="#36C5F0" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-wrapper">
      <div className={`modal-content-task`}>
        <div className="taskcard-info-upper-area">
          <div className="taskcard-info-left-upper">
            <span>{workspaceField?.name}</span>
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
              onClick={() => {
                setIsTaskModalOpen(false);
                dispatch(fetchBoard({ workspaceId, boardId }));
              }}
              style={{ cursor: "pointer" }}
            />

            {isRightArrowModalOpen && (
              <div className="right-arrow-modal" ref={rightArrowModalRef}>
                <div className="right-arrow-modal-header">
                  <h3 className="right-arrow-modal-title">
                    Send from board to...
                  </h3>
                </div>
                <div className="right-arrow-options">
                  {workspaceField?.boards?.map((boardField) => {
                    if (boardField.name !== board.name) {
                      return (
                        <div
                          key={boardField._id}
                          className="right-arrow-option"
                          onClick={() => handleRoot(boardField)}
                        >
                          {boardField.name}
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="taskcard-info-line"></div>
        <div className="row">
          <div className="col-lg-8">
            <div className="taskcard-info-title-area mb-4">
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
                  className="taskcard-info-title m-0"
                  onClick={() => setIsTitleEditing(true)}
                >
                  {taskTitle}
                </p>
              )}
            </div>

            {/* Description Section */}
            <div
              className={
                "taskcard-info-description-area" +
                (isDescriptionEditing ? " -isEditing" : "")
              }
            >
              {isDescriptionEditing ? (
                <div>
                  <TEditor
                    Outsidevalue={tempDescription}
                    setValue={setTempDescription}
                    saveCallback={
                      isDescriptionEditing
                        ? handleSaveDescription
                        : toggleDescriptionEditing
                    }
                    minHeight={300}
                    cancelCallback={() => {
                      setTempDescription(description);
                      setIsDescriptionEditing(false);
                    }}
                    setEditingMode={setIsDescriptionEditing}
                  />
                </div>
              ) : (
                <div
                  className="taskcard-info-textarea -description"
                  onClick={() => {
                    setIsDescriptionEditing(true);
                  }}
                  dangerouslySetInnerHTML={{ __html: description }} // HTML içeriğini güvenli bir şekilde göster
                />
              )}
            </div>

            <div className="taskcard-info-comment-area">
              {isCommentEditing ? (
                <TEditor
                  Outsidevalue={tempComment}
                  setValue={setTempComment}
                  saveCallback={handleAddComment}
                  minHeight={150}
                  cancelCallback={() => {
                    setIsCommentEditing(false);
                  }}
                  setEditingMode={setIsCommentEditing}
                />
              ) : (
                <div
                  className="taskcard-info-textarea -comment"
                  onClick={() => setIsCommentEditing(true)}
                >
                  <div className="add-comment-prompt">Add New Comment!!</div>
                </div>
              )}

              <h3 className="comments-title">Comments</h3>

              <div className="taskcard-info-comments-list mb-4">
                {comments.map((comment, index) => (
                  <div
                    key={index}
                    className={`taskcard-info-textarea ${
                      editingIndex === index ? "comment-editing" : ""
                    }`}
                  >
                    {editingIndex === index ? (
                      <>
                        <TEditor
                          Outsidevalue={editedComment}
                          setValue={setEditedComment}
                          saveCallback={handleEditComment}
                          minHeight={150}
                          cancelCallback={() => {
                            handleEditComment(-1);
                          }}
                          setEditingMode={setIsCommentEditing}
                        />
                      </>
                    ) : (
                      <>
                        {comment && comment.content ? (
                          <>
                            <div className="comment-header d-flex align-items-center text-align-center">
                              <UserAvatar
                                firstName={comment.userId?.firstName}
                                lastName={comment?.userId?.lastName}
                                profilePicture={comment?.userId?.profilePicture}
                                size="36"
                              />
                              <p className="mb-0 ms-1">{`${comment.userId?.firstName} ${comment.userId?.lastName} `}</p>
                            </div>
                            <hr></hr>
                            <div
                              className="comment-content mt-3"
                              dangerouslySetInnerHTML={{
                                __html: comment.content,
                              }}
                            />
                          </>
                        ) : (
                          <div className="comment-content">
                            We couldn't load this comment. Please refresh the
                            page to see comment content.
                          </div>
                        )}
                        {/* <div className="comment-icons">
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
                        </div> */}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Render Generated Subtasks */}
            {/* Subtask Generation Section */}
            {selectedTask.parentTask ? (
              <></>
            ) : (
              <div className="taskcard-info-subtask-area mb-4">
                {showSubtaskMessage && (
                  <p className="subtask-message">
                    Create subtasks of this task
                  </p>
                )}
                {isLoading ? (
                  <div className="loader-container-top-left">
                    <RotatingLines
                      height="30"
                      width="30"
                      strokeColor="#36C5F0"
                    />
                  </div>
                ) : (
                  <button
                    onClick={handleToggleSubtaskGeneration}
                    className="generate-subtask-button"
                    style={{
                      marginTop: visibleSubtasks.length > 3 ? "25px" : "10px",
                      marginBottom:
                        visibleSubtasks.length > 3 ? "25px" : "10px",
                    }}
                  >
                    Generate Subtasks
                  </button>
                )}

                <div className="generated-subtasks">
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
                            className={`workspaceAi-task ${
                              subtaskStates[task.id] === "rejected"
                                ? "rejected-task"
                                : ""
                            }`}
                          >
                            <div className="workspaceAi-task-card">
                              <div className="task-header">{task.name}</div>
                              <div className="task-desc">
                                {task.description}
                              </div>
                              <div className="task-tags">
                                <span className="task-tag">{task.type}</span>
                                <span className="task-tag">
                                  {task.assignee}
                                </span>
                              </div>
                            </div>
                            <div className="task-icons">
                              {loadingTasks[task.id] ? (
                                <RotatingLines
                                  height="20"
                                  width="20"
                                  strokeColor="#36C5F0"
                                />
                              ) : (
                                <>
                                  {subtaskStates[task.id] === "approved" ? (
                                    <span
                                      className="task-icon"
                                      style={{ pointerEvents: "none" }}
                                    >
                                      <img src={Tickİcon} alt="tick" />
                                    </span>
                                  ) : subtaskStates[task.id] === "rejected" ? (
                                    <span
                                      className="task-icon"
                                      style={{ pointerEvents: "none" }}
                                    >
                                      <img src={Crossİcon} alt="cross" />
                                    </span>
                                  ) : (
                                    <>
                                      <span
                                        className="task-icon"
                                        onClick={() => handleReject(task.id)}
                                      >
                                        <img src={Crossİcon} alt="cross" />
                                      </span>
                                      <span
                                        className="task-icon"
                                        onClick={() => handleApprove(task)}
                                      >
                                        <img src={Tickİcon} alt="tick" />
                                      </span>
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </motion.div>
                        </div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>
            )}

            {/* <div className="taskcard-info-checklist-area mb-4 mb-lg-0">
              <input className="checklist-checkbox" type="checkbox" />
              <p className="taskcard-info-gray-letter m-0">
                Create a checklist for this task
              </p>
            </div> */}
          </div>

          <div className="col-lg-4">
            <div className="taskcard-info-right-lower">
              <div className="taskcard-info-assignees mb-4">
                <a className="td-none" href="#" onClick={toggleAssigneeModal}>
                  <img
                    src={Assignees}
                    alt="assignees"
                    className="assignees-icon"
                  />
                  Assignees
                </a>

                {selectedAssignee.name ? (
                  <UserAvatar
                    firstName={selectedAssignee?.name}
                    lastName={selectedAssignee?.lastname}
                    profilePicture={selectedAssignee.avatar}
                    size="36"
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
                        <UserAvatar
                          firstName={member?.firstName}
                          lastName={member?.lastName}
                          profilePicture={member.profilePicture}
                          size="36"
                        />
                        <div className="assignee-name ms-1">
                          {member.firstName} {member.lastName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="taskcard-info-due-date mb-4">
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

              <div className="taskcard-info-status mb-4">
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

              <div className="taskcard-info-priority mb-4">
                <a className="td-none" href="#" onClick={togglePriorityModal}>
                  <img src={Priority} alt="priority icon" />
                  Priority
                </a>

                {selectedPriority?.label ? (
                  <div className="selected-priority">
                    <img
                      src={selectedPriority?.icon}
                      alt="selected priority icon"
                      className="priority-icon"
                    />
                    <span className="priority-label">
                      {selectedPriority?.label}
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
    </div>
  );
};

export default TaskModal;
