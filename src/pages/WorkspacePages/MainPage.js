import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../SideBar";
import Navbar from "../../components/LandingPage/Navbar";
import "../../styles/workspaceCss/homepage.css";

const MainPage = () => {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <div className="workspaceai-main" style={{ display: "flex" }}>
        <div>
          <Sidebar />
        </div>
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MainPage;
