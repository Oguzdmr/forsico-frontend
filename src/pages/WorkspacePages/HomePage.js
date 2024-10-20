import React, { useState, useEffect } from "react";
import '../../styles/workspaceCss/homepage.css'; // CSS dosyasını ayrı tutuyoruz
import HomePagePen from "../../assets/homepage-pen-icon.svg"
import Member1 from "../../assets/alper.jpeg"
import Member2 from "../../assets/furkan.jpeg"
import Member3 from "../../assets/murat.jpeg"
import DoughnutChart from "../DoughnutChart";
import BarChart from "../BarChart";
import { useDispatch, useSelector } from "react-redux";


const HomePage = () => {
    const [percentageForCompletedTasks, setPercentageForCompletedTasks] = useState(0);
    const [percentageForWorkSpaces, setPercentageForWorkSpaces] = useState(0);
    const [percentageForTasks, setPercentageForTasks] = useState(0);


    // Sayım işlemi için fonksiyon
    const animateCounter = (endValue, setState, duration = 800) => {
        let startValue = 0;
        const stepTime = Math.abs(Math.floor(duration / endValue));

        const timer = setInterval(() => {
            startValue += 1;
            setState(startValue);
            if (startValue === endValue) clearInterval(timer);
        }, stepTime);

        return () => clearInterval(timer); // Temizleme işlemi
    };

    useEffect(() => {
        // Tamamlanan görevler için animasyonu başlat
        animateCounter(30, setPercentageForCompletedTasks);

        // Workspace sayısı için animasyonu başlat
        animateCounter(3, setPercentageForWorkSpaces);

        // Task sayısı için animasyonu başlat
        animateCounter(26, setPercentageForTasks);
    }, []);


    const [workspaces, setWorkspaces] = useState([
        {
            name: "Forsico",
            sections: [
                { id: "general", name: "General", members: 8 },
                { id: "uxui", name: "UX/UI", members: 8 },
                { id: "software", name: "Software", members: 8 },
                { id: "socialmedia", name: "Social Media", members: 8 },
            ]
        },
        
    ]);

    const {
        entities,
        status = "idle",
        error,
      } = useSelector((state) => {

        return state.workspaces || {};
      });

    return (
        <>


                <div className="taskboard-main-container">
                    <div className="taskboard-homepage-layout">
                        <div className="meet-message">
                            <span>Good Morning, Murat!</span>
                        </div>
                        <div className="workspace-general-info">
                            <div className="general-info-leftside">
                                <div className="double-card">
                                    <div className="active-workspaces">
                                        <h2 className="fs-96 blue-letter">{percentageForWorkSpaces}</h2>
                                        <span className="active-workspace-title blue-letter-title">workspaces</span>
                                    </div>
                                    <div className="active-task">
                                        <h2 className="fs-96 turquoise-letter">{percentageForTasks}</h2>
                                        <span className="active-task-title turquoise-letter-title">tasks</span>
                                    </div>
                                </div>
                                <div className="percent-of-completed">
                                    <div className="completed-title">
                                        <span className="green-letter fs-24">You have</span>
                                        <span className="green-letter fs-24">completed</span>
                                        <span className="blue-letter fs-24">of your tasks</span>
                                    </div>
                                    <div>
                                        <span className="completed-tasks-percentage pink-letter fs-96">%{percentageForCompletedTasks}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="general-info-middleside">
                                <DoughnutChart/>
                            </div>
                            <div className="general-info-middleside">
                                <BarChart workspaceCount="10" taskCount="20" completedTaskCount="40" />
                            </div>
                        </div>

                        <div className="workspaces-info">
                            <div className="workspace-general-info-title">
                                <span className="workspacearea-title blue-letter">Your workspaces</span>
                            </div>

                            {entities.map((workspace, index) => (
                                <div key={index} className="workspace">
                                    <span className="workspace-title blue-letter">{workspace.name}</span>
                                    <div className="workspace-sections">
                                        {workspace.boards.map(board => (
                                            <div key={board._id} className="workspace-card">
                                                <div className="workspace-card-upperside">
                                                    <span className="workspace-card-title gray-letter">{board.name}</span>
                                                    <span className="workspace-card-icon">
                                                        <img src={HomePagePen} alt={board.name} />
                                                    </span>
                                                </div>
                                                <div className="workspace-card-middleside">
                                                    <div className="workspace-card-line"></div>
                                                </div>
                                                <div className="workspace-card-lowerside">
                                                    <div className="members-image">
                                                        {/* Placeholder for member images */}
                                                        {board.members.map((member)=>(
                                                            <img className="member-image" src={member.profilePicture} alt="member" />
                                                        ))}
                                                        
                                                        
                                                    </div>
                                                    <span className="total-members">+{board.members.length}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>



        </>
    );
};

export default HomePage;