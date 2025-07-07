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
// import ProtectedAuthRoutes from "../utils/ProtectedRoutes/ProtectedAuthRoutes";
// import HomePage from "../pages/HomePage";

const AuthRoutes = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);


    return (
        <>
            {/* <Route element={<ProtectedAuthRoutes />}> */}
            {/* </Route> */}

            {/* {isAuthenticated && (
                <>
                    <Route path="/login" element={<Navigate to="/" />} />
                    <Route path="/register" element={<Navigate to="/" />} />
                    <Route path="/verify-otp" element={<Navigate to="/" />} />
                    <Route path="/forgot-pass" element={<Navigate to="/" />} />
                    <Route path="/otp" element={<Navigate to="/" />} />
                    <Route path="/change-pass" element={<Navigate to="/" />} />
                    <Route path="/home" element={<HomePage />} />
                </>)}
            {!isAuthenticated && (
                <>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<Registration />} />
                    <Route path="/verify-otp" element={<OTPVerification />} />
                    <Route path="/forgot-pass" element={<ForgotPassword />} />
                    <Route path="/otp" element={<ChangePassOtp />} />
                    <Route path="/change-pass" element={<ChangePass />} />
                </>)}
            <Route path="/success-login" element={<LoginSuccess />} /> */}


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
