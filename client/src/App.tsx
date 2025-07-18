import {
  BrowserRouter as Router,
  Routes,
  Route,

} from "react-router-dom";
import './App.css'
import HomePage from "./pages/HomePage";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import AuthRoutes from "./routes/AuthRoutes";
import ClientRoutes from "./routes/ClientRoutes";
import FreelancerRoutes from "./routes/FreelancerRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import MarketPlace from "./pages/MarketPlace/project/MarketPlace";
import JobDetails from "./pages/MarketPlace/projectDetails/JobDetails";
import ApplyJob from "./pages/MarketPlace/applyBid/ApplyJob";
import type { AppDispatch, RootState } from "./app/store";
import { useSelector } from "react-redux";
import { SocketProvider } from './context/SocketContext.tsx'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserDetails } from "./features/auth/authSlice.ts";


function App() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const userId = user?.id as string

  useEffect(() => {
    dispatch(getUserDetails())
      .catch((error) => {
        console.error(error?.message);
      });
  }, [dispatch])
  return (
    <SocketProvider userId={userId}>
      <>
        <ToastContainer />
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/about" element={<>About</>} />
            <Route path="/market-place" element={<MarketPlace />}></Route>
            <Route path="/market-place/job-details/:jobId" element={<JobDetails />}></Route>
            <Route path="/market-place/job-details/:jobId/apply-job" element={<ApplyJob />}></Route>

            {AuthRoutes()}
            {ClientRoutes()}
            {FreelancerRoutes()}
            {AdminRoutes()}
          </Routes>
        </Router>
      </>
    </SocketProvider>
  )
}

export default App
