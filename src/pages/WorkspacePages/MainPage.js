import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../SideBar";
import Navbar from "../../components/LandingPage/Navbar";
import "../../styles/workspaceCss/mainpage.css";

const MainPage = () => {
  const location = useLocation();

  return (
    <div className="main-container">
      <Navbar />
      <div className="content-container">
        <Sidebar />
        <div className="outlet-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
