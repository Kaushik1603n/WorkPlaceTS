// src/routes/AuthRoutes.js
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "../pages/authPages/Login";
import Registration from "../pages/authPages/Register";
import OTPVerification from "../pages/authPages/OTPVerification";
import ForgotPassword from "../pages/authPages/ForgotPassword";
import ChangePassOtp from "../pages/authPages/ChangePassOtp";
import ChangePass from "../pages/authPages/ChangePass";
import LoginSuccess from "../pages/authPages/LoginSuccess";
import type { RootState } from "../app/store";
import { useSelector } from "react-redux";

const AuthRoutes = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const location = useLocation();

    const authPaths = [
        "/login",
        "/register",
        "/verify-otp",
        "/forgot-pass",
        "/otp",
        "/change-pass",
        "/success-login"
    ];

    if (isAuthenticated && authPaths.includes(location.pathname)) {
         <Route >
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/register" element={<Navigate to="/" />} />
          <Route path="/verify-otp" element={<Navigate to="/" />} />
          <Route path="/forgot-pass" element={<Navigate to="/" />} />
          <Route path="/otp" element={<Navigate to="/" />} />
          <Route path="/change-pass" element={<Navigate to="/" />} />
        </Route>
    }



    return (
        <Routes>
            {!isAuthenticated && (
                <>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<Registration />} />
                    <Route path="/verify-otp" element={<OTPVerification />} />
                    <Route path="/forgot-pass" element={<ForgotPassword />} />
                    <Route path="/otp" element={<ChangePassOtp />} />
                    <Route path="/change-pass" element={<ChangePass />} />
                </>)}
                    <Route path="/success-login" element={<LoginSuccess />} />
        </Routes>
    );
};

export default AuthRoutes;
