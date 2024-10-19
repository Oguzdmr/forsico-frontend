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
import { Link } from "react-router-dom";

const Sidebar = () => {
  // State to track which workspace dropdown is open
  const dispatch = useDispatch();
  const [openDropdown, setOpenDropdown] = useState({});
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
  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        <img className="sidebar-home-icon" src={SidebarHome} alt="home" />
        {/* <Link className="sidebar-home sidebar-blue-letter" to="/taskboardhomepage">Home</Link> */}
        <Link
          to="/workspaces/home"
          className="sidebar-home sidebar-blue-letter"
        >
          Home
        </Link>
      </div>
      <div className="sidebar-menu">
        <img className="sidebar-tasks-icon" src={SidebarMyTasks} alt="tasks" />
        <span className="sidebar-blue-letter">My Tasks</span>
      </div>
      <div className="sidebar-menu">
        <img className="sidebar-docs-icon" src={SidebarMyDocs} alt="docs" />
        <a href="/mydocs" className="sidebar-blue-letter">
          My Docs
        </a>
      </div>
      <div className="sidebar-line"></div>

      <div className="sidebar-workspaces">
        <span className="add-workspace">WORKSPACES</span>
        <Link
          to="/workspaces/ai/new"
          className="sidebar-plus-icon"
        >
          <img className="sidebar-home-icon" src={SidebarPlus} alt="plus" />
        </Link>
      </div>

      {entities?.map((entity, index) => (
        <div key={index} className="sidebar-workspaces-menu">
          <img
            className="sidebar-submenu-dot"
            src={SidebarDot}
            alt="dot"
            onClick={() => toggleDropdown(entity.name)}
          />
          <span
            className="sidebar-blue-letter"
            onClick={() => toggleDropdown(entity.name)}
          >
            {entity.name}
          </span>

          {openDropdown[entity.name] && (
            <div className="sidebar-submenu">
              {entity.boards.map((board, index) => (
                <Link
                  key={index}
                  to={"/workspaces/board/" + entity._id +"/"+board._id}
                  style={{textDecoration:"none"}}
                >
                  <span className="sidebar-blue-letter">
                    <img
                      className="sidebar-submenu-dot"
                      src={SidebarDot}
                      alt="dot"
                    />
                    {board?.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
