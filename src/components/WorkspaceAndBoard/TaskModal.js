import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/workspaceCss/TaskModal.css";
import Plus from "../../assets/sidebar-plus-icon.svg";
import Assignees from "../../assets/taskcard-info-assignees.svg";
import DueDate from "../../assets/taskcard-info-duedate.svg";
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

const TaskModal = ({ taskIndex, colIndex, setIsTaskModalOpen }) => {
  const [description, setDescription] = useState("Task description here...");
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const [tempDescription, setTempDescription] = useState(description);
  const [comments, setComments] = useState([]);
  console.log("comments", comments);
  const [tempComment, setTempComment] = useState('');
  const [isCommentEditing, setIsCommentEditing] = useState(false);
  const [isAssigneeModalOpen, setAssigneeModalOpen] = useState(false);
  const [isStatusModalOpen, setStatusModalOpen] = useState(false);
  const [isPriorityModalOpen, setPriorityModalOpen] = useState(false); // New state for Priority Modal
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPriority, setSelectedPriority] = useState(""); // State for selected priority
  const assigneeModalRef = useRef(null);
  const statusModalRef = useRef(null);
  const priorityModalRef = useRef(null); // Ref for priority modal
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("Task Title");
  const [isTitleEditing, setIsTitleEditing] = useState(false);

  // Retrieve user info from Redux store
  const userInfo = useSelector((state) => state.auth.user);
  console.log("userInfo.profilePictureUrl", userInfo.profilePictureUrl);

  const statusOptions = ["To Do", "In progress", "Done"]; // Status options
  const priorityOptions = [
    { label: "Urgent", icon: UrgentFlag },
    { label: "High", icon: HighFlag },
    { label: "Normal", icon: NormalFlag },
  ];

  const handleSaveDescription = () => {
    if (tempDescription.trim() !== "") { // Check if the new description is not just whitespace
      setDescription(tempDescription); // Update the main description state
    }
    setIsDescriptionEditing(false); // Exit editing mode
  };

  const handleSaveComment = () => setIsCommentEditing(false);

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
    setSelectedStatus(status);
    setStatusModalOpen(false);
  };

  const handlePrioritySelect = (priority) => {
    setSelectedPriority(priority);
    setPriorityModalOpen(false);
  };

  const toggleDescriptionEditing = () => {
    setIsDescriptionEditing(prev => !prev); // Düzenleme modunu tersine çevir
  };



  const handleSaveTitle = () => setIsTitleEditing(false);

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
    setSelectedDate(date);
    setIsDatePickerOpen(false); // Close date picker after selection
  };

  const handleAddComment = () => {
    if (tempComment.trim()) {
      setComments([...comments, tempComment]); // Yeni yorumu ekle
      setTempComment(''); // Geçici durumu sıfırla
      setIsCommentEditing(false); // Düzenleme modunu kapat
    }
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close modals on outside click
      if (assigneeModalRef.current && !assigneeModalRef.current.contains(event.target)) {
        setAssigneeModalOpen(false);
      }
      if (statusModalRef.current && !statusModalRef.current.contains(event.target)) {
        setStatusModalOpen(false);
      }
      if (priorityModalRef.current && !priorityModalRef.current.contains(event.target)) {
        setPriorityModalOpen(false);
      }
      if (isDatePickerOpen && !event.target.closest(".datepicker-wrapper")) {
        setIsDatePickerOpen(false); // Close date picker
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [assigneeModalRef, statusModalRef, priorityModalRef, isDatePickerOpen]);

  return (
    <div className="modal-wrapper">
      <div className={`modal-content-trello`}>
        <div className="taskcard-info-upper-area">
          <div className="taskcard-info-left-upper">
            <span>Forsico/General</span>
          </div>
          <div className="taskcard-info-right-upper">
            <img src={RightArrow} alt="taskcard-info-right-arrow" />
            <img
              src={Cross}
              alt="taskcard-info-cross"
              onClick={() => setIsTaskModalOpen(false)}
              style={{ cursor: "pointer" }}
            />
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
                  onBlur={handleSaveTitle}
                  autoFocus
                  className="task-title-input" // Add a custom class for styling
                />
              ) : (
                <p className="taskcard-info-title" onClick={() => setIsTitleEditing(true)}>
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
                    onClick={isDescriptionEditing ? handleSaveDescription : toggleDescriptionEditing}
                    className="save-description-button"
                  >
                    {isDescriptionEditing ? 'Save' : 'Edit'} {/* Buton metni */}
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
                <TextEditor
                  value={tempComment} // Yorum yazma alanındaki değer
                  setValue={setTempComment} // Değeri güncelleme fonksiyonu
                />
              ) : (
                <div className="taskcard-info-textarea" onClick={() => setIsCommentEditing(true)}>
                  <div className="add-comment-prompt">Add New Comment!!</div>
                </div>
              )}

              {/* Save butonunu kaldırdık */}
              {isCommentEditing && (
                <button
                  onClick={handleAddComment}
                  className="save-description-button"
                >
                  Save
                </button>
              )}

              {/* Yorumların tam listesini göstermek için ayrı bir alan */}
              <div className="taskcard-info-comments-list">
                {comments.map((comment, index) => (
                  <div key={index} className="taskcard-info-textarea comment-item">
                    <div dangerouslySetInnerHTML={{ __html: comment }} /> {/* Her yorumu göster */}
                  </div>
                ))}
              </div>
            </div>





            {/* <div className="taskcard-info-subtask-area">
              <div className="taskcard-info-subtask-inside">
                <p className="taskcard-info-gray-letter">
                  Create subtask of this task
                </p>
                <button className="generate-subtask-button">
                  Generate Subtask
                </button>
              </div>
            </div> */}

            {/* <div className="taskcard-info-checklist-area">
              <input className="checklist-checkbox" type="checkbox" />
              <p className="taskcard-info-gray-letter">
                Create a checklist for this task
              </p>
            </div> */}
          </div>

          <div className="taskcard-info-right-lower">
            <div className="taskcard-info-assignees" onClick={toggleAssigneeModal}>
              <a className="td-none" href="#">
                <img src={Assignees} alt="assignees" />
                Assignees
              </a>
              <img src={Plus} alt="plus" />
            </div>

            {isAssigneeModalOpen && (
              <div className="assignee-modal" ref={assigneeModalRef}>
                <div className="assignee-modal-header">
                  <h3 className="assignee-modal-title">Assignees</h3>
                  <img
                    src={AddMemberIcon}
                    alt="Add Member"
                    className="add-member-icon"
                  />
                </div>
                <div className="assignee-modal-divider"></div>
                <div className="assignee-modal-content">
                  <img
                    src={userInfo.profilePictureUrl}
                    alt="Profile"
                    className="assignee-avatar"
                  />
                  <div className="assignee-name">
                    {userInfo.firstName} {userInfo.lastName}
                  </div>
                </div>
                <div className="assignee-modal-content">
                  <img
                    src={userInfo.profilePictureUrl}
                    alt="Profile"
                    className="assignee-avatar"
                  />
                  <div className="assignee-name">
                    {userInfo.firstName} {userInfo.lastName}
                  </div>
                </div>
              </div>
            )}

            <div className="taskcard-info-due-date">
              <a className="td-none" href="#" onClick={() => setIsDatePickerOpen(true)}>
                <img src={DueDate} alt="duedate" />
                Due Date
              </a>
              {selectedDate ? (
                <a className="taskmodal-selected-date" onClick={() => setIsDatePickerOpen(true)}>
                  {format(selectedDate, "MMMM dd")}
                </a>
              ) : (
                <img src={Plus} alt="plus" onClick={() => setIsDatePickerOpen(true)} />
              )}
              {isDatePickerOpen && (
                <div className="datepicker-wrapper"> {/* Wrapper for styling purposes */}
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="dd MMMM"
                    className="custom-datepicker" // Custom styling
                    popperPlacement="bottom" // Ensure the calendar opens below the button
                    inline // Display the calendar inline
                  />
                </div>
              )}
            </div>

            <div className="taskcard-info-status" onClick={toggleStatusModal}>
              <a className="td-none" href="#">
                <img src={Status} alt="status" />
                Status
              </a>
              {selectedStatus ? (
                <span className="status-text">{selectedStatus}</span>
              ) : (
                <img src={Plus} alt="plus" />
              )}
            </div>

            {isStatusModalOpen && (
              <div className="status-modal" ref={statusModalRef}>
                <div className="status-modal-header">
                  <h3 className="status-modal-title">Status</h3>
                  <img src={ModalPlus} alt="Plus" className="add-status-icon" />
                </div>
                <div className="status-modal-divider"></div>
                <div className="status-options">
                  {statusOptions.map((status) => (
                    <div key={status} className="status-option" onClick={() => handleStatusSelect(status)}>
                      {status}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="taskcard-info-priority" onClick={togglePriorityModal}>
              <a className="td-none" href="#">
                <img src={Priority} alt="priority icon" className="priority-icon" />
                Priority
              </a>
              {selectedPriority ? (
                <img src={selectedPriority.icon} alt="selected priority" />
              ) : (
                <img src={Plus} alt="plus" />
              )}
            </div>

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
                      <img src={priority.icon} alt={`${priority.label} icon`} />
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
  );
};

export default TaskModal;
