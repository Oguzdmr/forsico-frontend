import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { Playground } from "../pages/Playground";

const LandingPage = lazy(() => import("../pages/LandingPage"));
const ResetPasswordPage = lazy(() => import("../pages/ResetPasswordPage"));
const ConfirmEmailPage = lazy(() => import("../pages/ConfirmEmailPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const HomePage = lazy(() => import("../pages/WorkspacePages/HomePage"));
const ThirdPartyLogin = lazy(() => import("../pages/ThirdPartyLogin"));
const ConfirmEmailUpdatePage = lazy(() => import("../pages/ConfirmEmailUpdatePage"));
const WorkspaceAI = lazy(() => import("../pages/WorkspacePages/WorkspaceAI"));
const MainPage = lazy(() => import("../pages/WorkspacePages/MainPage"));
const Board = lazy(() => import("../pages/WorkspacePages/Board"));
const MyDocs = lazy(() => import("../pages/MyDocs"));
const MyTasks = lazy(() => import("../pages/MyTasks"));

const LoadingFallback = () => <div>Loading...</div>;

const AppRoutes = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/resetPassword" element={<ResetPasswordPage />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/confirmEmail" element={<ConfirmEmailPage />} />
          <Route path="/thirdpartylogin" element={<ThirdPartyLogin />} />
          <Route path="/confirmchangeemail" element={<ConfirmEmailUpdatePage />} />
          <Route
            path="/profilepage"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workspaces"
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="home" />} />
            <Route path="home" element={<HomePage />} />
            <Route path="ai/:workspaceId" element={<WorkspaceAI />} />
            <Route path="board/:workspaceId/:boardId" element={<Board />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="mytasks" element={<MyTasks />} />
            <Route path="mydocs" element={<MyDocs />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
