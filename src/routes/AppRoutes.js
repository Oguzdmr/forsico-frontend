import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import ConfirmEmailPage from '../pages/ConfirmEmailPage';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/resetPassword" element={<ResetPasswordPage />} />
                <Route path="/confirmEmail" element={<ConfirmEmailPage />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
