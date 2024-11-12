import React, { useState, useEffect } from "react";
import "../../styles/workspaceCss/homepage.css";
import HomePagePen from "../../assets/homepage-pen-icon.svg";
import DoughnutChart from "../DoughnutChart";
import BarChart from "../BarChart";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyTasks } from "../../store/myTasksSlice";
import UserAvatar from "../../components/WorkspaceAndBoard/UserAvatar.js";

const HomePage = () => {
  const [percentageForCompletedTasks, setPercentageForCompletedTasks] =
    useState(0);
  const [percentageForWorkSpaces, setPercentageForWorkSpaces] = useState(0);
  const [percentageForTasks, setPercentageForTasks] = useState(0);
  const dispatch = useDispatch();

  const animateCounter = (endValue, setState, duration = 800) => {
    endValue = parseInt(endValue) || 0;

    let startValue = -1;
    const stepTime = Math.abs(Math.floor(duration / endValue));

    const timer = setInterval(() => {
      startValue += 1;
      setState(startValue);
      if (startValue === endValue) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  };

  const {
    entities,
    status = "idle",
    error,
  } = useSelector((state) => {
    return state.workspaces || {};
  });

  const { taskCount, completedTasks } = useSelector((state) => {
    return state.myTasks || {};
  });

  const userTasksStatus = useSelector((state) => state.myTasks.status);

  useEffect(() => {
    if (userTasksStatus === "idle" && entities?.length > 0) {
      dispatch(fetchMyTasks({ workspaceId: (entities || [])[0]?._id }));
    }
  }, [dispatch, userTasksStatus, entities]);

  useEffect(() => {
    if (entities?.length > 0) {
      animateCounter(
        (completedTasks * 100) / taskCount,
        setPercentageForCompletedTasks
      );
      animateCounter(entities?.length, setPercentageForWorkSpaces);
      animateCounter(taskCount, setPercentageForTasks);
    }
  }, [taskCount]);

  return (
    <>
      <div className="taskboard-main-container">
        <div className="taskboard-homepage-layout">
          <div className="meet-message">
            <span>Welcome!</span>
          </div>
          <div className="workspace-general-info">
            <div className="general-info-leftside">
              <div className="double-card">
                <div className="active-workspaces">
                  <h2 className="fs-96 blue-letter">
                    {percentageForWorkSpaces}
                  </h2>
                  <span className="active-workspace-title blue-letter-title">
                    workspaces
                  </span>
                </div>
                <div className="active-task">
                  <h2 className="fs-96 turquoise-letter">
                    {percentageForTasks}
                  </h2>
                  <span className="active-task-title turquoise-letter-title">
                    tasks
                  </span>
                </div>
              </div>
              <div className="percent-of-completed">
                <div className="completed-title">
                  <span className="green-letter fs-24">You have</span>
                  <span className="green-letter fs-24">completed</span>
                  <span className="blue-letter fs-24">of your tasks</span>
                </div>
                <div>
                  <span className="completed-tasks-percentage pink-letter fs-96">
                    %{percentageForCompletedTasks}
                  </span>
                </div>
              </div>
            </div>
            <div className="general-info-middleside">
              <DoughnutChart />
            </div>
            <div className="general-info-middleside">
              <BarChart
                workspaceCount="3"
                taskCount="26"
                completedTaskCount="30"
              />
            </div>
          </div>

          <div className="workspaces-info">
            <div className="workspace-general-info-title">
              <span className="workspacearea-title blue-letter">
                Your workspaces
              </span>
            </div>

            {entities?.map((workspace, index) => (
              <div key={index} className="workspace">
                <span className="workspace-title blue-letter">
                  {workspace.name}
                </span>
                <div className="workspace-sections">
                  {workspace.boards.map((board) => (
                    <div key={board._id} className="workspace-card">
                      <div className="workspace-card-upperside">
                        <span className="workspace-card-title gray-letter">
                          {board.name}
                        </span>
                        <span className="workspace-card-icon">
                          <img src={HomePagePen} alt={board.name} />
                        </span>
                      </div>
                      <div className="workspace-card-middleside">
                        <div className="workspace-card-line"></div>
                      </div>
                      <div className="workspace-card-lowerside">
                        <div className="members-image">
                          {board.members.map((member) => (
                             <UserAvatar firstName={member?.firstName} lastName={member?.lastName} profilePicture={member.profilePicture}/>
                          ))}
                        </div>
                        <span className="total-members">
                          +{board.members.length}
                        </span>
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
