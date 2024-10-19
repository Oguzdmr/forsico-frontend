import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ConfirmEmailPage from "../pages/ConfirmEmailPage";
import ProfilePage from "../pages/ProfilePage";
import HomePage from "../pages/WorkspacePages/HomePage";
import ThirdPartyLogin from "../pages/ThirdPartyLogin";
import ConfirmEmailUpdatePage from "../pages/ConfirmEmailUpdatePage";
import WorkspaceAI from "../pages/WorkspacePages/WorkspaceAI";
import MainPage from "../pages/WorkspacePages/MainPage";
import Board from "../pages/WorkspacePages/Board";
import MyDocs from "../pages/MyDocs";
import ProtectedRoute from "./ProtectedRoute";
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/resetPassword" element={<ResetPasswordPage />} />
        <Route path="/confirmEmail" element={<ConfirmEmailPage />} />
        <Route path="/thirdpartylogin" element={<ThirdPartyLogin />} />
        <Route
          path="/confirmchangeemail"
          element={<ConfirmEmailUpdatePage />}
        />
        <Route
          path="/workspaces"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        >
          <Route path="home" element={<HomePage />} />
          <Route path="ai" element={<WorkspaceAI />} /> {/*TODO ai a'da parametre geçerek ayırmak gerekebilir*/}
          <Route path="board/:workspaceId/:boardId" element={<Board />} /> {/*TODO boardlar workspaceid/boardId path paramlarıyla kullanılacak*/}
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route
          path="/mydocs"
          element={
            <ProtectedRoute>
              <MyDocs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profilepage"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
