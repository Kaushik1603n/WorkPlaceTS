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
// import type { RootState } from "./app/store";
// import { useSelector } from "react-redux";


function App() {
  // const {  user } = useSelector((state: RootState) => state.auth);
  // console.log(user);

  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<>About</>} />
          <Route path="/market-place" element={<MarketPlace />}></Route>
          <Route path="/market-place/job-details/:jobId" element={<JobDetails />}></Route>

          {/* <Route path="/admin-dashboard" element={<AdminLayout/>} /> */}


          {AuthRoutes()}
          {ClientRoutes()}
          {FreelancerRoutes()}
          {AdminRoutes()}
        </Routes>
      </Router>
    </>
  )
}

export default App
