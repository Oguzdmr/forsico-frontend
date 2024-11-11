import { useState, useEffect } from "react";
import "../styles/sidebar.css";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedComponent } from "../store/selectedComponentSlice";
import SidebarHome from "../assets/sidebar-home-icon.svg";
import SidebarMyTasks from "../assets/sidebar-tasks-icon.svg";
import SidebarMyDocs from "../assets/sidebar-docs-icon.svg";
import SidebarPlus from "../assets/sidebar-plus-icon.svg";
import SidebarDot from "../assets/sidebar-dot-icon.svg";
import { fetchWorkspaces } from "../store/workspaceSlice";
import { useLocation, Link } from "react-router-dom";
import CreateBoardModal from "../components/WorkspaceAndBoard/CreateBoardModal";
import CreateWorkspaceModal from "../components/WorkspaceAndBoard/CreateWorkspaceModal"
const Sidebar = () => {

  const location = useLocation();  // Aktif sayfanın yolunu almak için

  // State to track which workspace dropdown is open
  const dispatch = useDispatch();
  const [openDropdown, setOpenDropdown] = useState({});
  const [showCreateBoardModal, setShowCreateBoardModal] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState();

  const {
    entities,
    status = "idle",
    error,
  } = useSelector((state) => {
    return state.workspaces || {};
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchWorkspaces());
    }
  }, [dispatch, status]);

  useEffect(() => {
    console.log("Entities updated:", entities);
    console.log(status);
  }, [entities]);

  // Function to toggle dropdown
  const toggleDropdown = (workspace) => {
    setOpenDropdown((prevState) => ({
      ...prevState,
      [workspace]: !prevState[workspace],
    }));
  };

  const handleClick = (comp) => {
    dispatch(
      setSelectedComponent({
        selectedComponent: comp,
      })
    );
  };

  const isActive = (path) => location.pathname === path; // Aktif sayfayı kontrol eder

  return (
    <div className="sidebar">
      {/* <a className="closeSideMenu" onClick={()=>{document.querySelector('.sidebar').classList.remove('active');}} >x</a> */}
      <div className={`sidebar-menu ${isActive("/workspaces/home") ? "active" : ""}`}>
        <img className="sidebar-home-icon" src={SidebarHome} alt="home" />
        <Link to="/workspaces/home" className="sidebar-blue-letter">Home</Link>
      </div>

      <div className={`sidebar-menu ${isActive("/workspaces/mytasks") ? "active" : ""}`}>
        <img className="sidebar-tasks-icon" src={SidebarMyTasks} alt="tasks" />
        <Link to="/workspaces/mytasks" className="sidebar-blue-letter">My Tasks</Link>
      </div>

      <div className={`sidebar-menu ${isActive("/workspaces/mydocs") ? "active" : ""}`}>
        <img className="sidebar-docs-icon" src={SidebarMyDocs} alt="docs" />
        <a href="/workspaces/mydocs" className="sidebar-blue-letter">My Docs</a>
      </div>

      <div className="sidebar-line"></div>

      <div className="sidebar-workspaces">
        <span className="add-workspace">WORKSPACES</span>
        <div  onClick={()=>setShowCreateWorkspaceModal(true)} className="sidebar-plus-icon">
          <img className="sidebar-home-icon" src={SidebarPlus} alt="plus" />
        </div>
      </div>

      {entities?.map((entity) => (
        <div key={entity._id} className="sidebar-workspaces-menu">
          <img
            className="sidebar-submenu-dot"
            src={SidebarDot}
            alt="dot"
            onClick={() => toggleDropdown(entity.name)}
          />
          <span className="sidebar-blue-letter workspaces-menu" onClick={() => toggleDropdown(entity.name)}>
            {entity.name}
          </span>
          <a className="sidebar-create-board-icon" type="button" onClick={() => { console.log("click", entity._id); setSelectedWorkspaceId(entity._id); setShowCreateBoardModal(true); }} >
                <img className="sidebar-home-icon" src={SidebarPlus} alt="plus" />
          </a>
          <div className="sidebar-line lower-line"></div>

          {openDropdown[entity.name] && (
            
            <div className="sidebar-submenu">
              
              {entity.boards.map((board) => (
                <Link
                  key={board._id}
                  to={`/workspaces/board/${entity._id}/${board._id}`}
                  className={`sidebar-blue-letter workspaces-submenu ${isActive(`/workspaces/board/${entity._id}/${board._id}`) ? "active" : ""}`}
                >
                  <img className={`sidebar-submenu-dot ${isActive(`/workspaces/board/${entity._id}/${board._id}`) ? "active" : ""}`} src={SidebarDot} alt="dot" />
                  {board.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}

      {showCreateBoardModal && (
        <CreateBoardModal onClose={() => setShowCreateBoardModal(false)} workspaceId={selectedWorkspaceId} />
      )}
      {showCreateWorkspaceModal && (
        <CreateWorkspaceModal onClose={() => setShowCreateWorkspaceModal(false)} />
      )}
    </div>
  );
};

export default Sidebar;