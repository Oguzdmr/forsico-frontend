import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../SideBar";
import Navbar from "../../components/LandingPage/Navbar";
import "../../styles/workspaceCss/mainpage.css";

const MainPage = () => {
  const location = useLocation();
  const [isSidebarActive,setIsSidebarActive] = useState(false);

  return (
    <div className="main-container">
      <Navbar />
      <div className="content-container">
        <a className="openMobileSideMenu" onClick={()=> {if(isSidebarActive){
            document.querySelector('.sidebar').classList.remove('active'); 
            setIsSidebarActive(false);
        }else {
          document.querySelector('.sidebar').classList.add('active');
          setIsSidebarActive(true);
        }}} ><span className="ico"></span></a>
        <Sidebar />
        <div className="outlet-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
