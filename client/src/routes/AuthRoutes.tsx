// src/routes/AuthRoutes.js
import { Route, Navigate } from "react-router-dom";
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


    return (
        <>
            <>                
                <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
                <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Registration />} />
                <Route path="/verify-otp" element={isAuthenticated ? <Navigate to="/" /> : <OTPVerification />} />
                <Route path="/forgot-pass" element={isAuthenticated ? <Navigate to="/" /> : <ForgotPassword />} />
                <Route path="/otp" element={isAuthenticated ? <Navigate to="/" /> : <ChangePassOtp />} />
                <Route path="/change-pass" element={isAuthenticated ? <Navigate to="/" /> : <ChangePass />} />
                <Route path="/success-login" element={<LoginSuccess />} />
                <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
            </>

        </>
    );
};

export default AuthRoutes;
