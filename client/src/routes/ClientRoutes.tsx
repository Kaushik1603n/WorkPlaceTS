// import React from 'react'
import {  Route,  } from "react-router-dom";
import ProtectedClientRoute from "../utils/ProtectedRoutes/ProtectedClientRoute";
import ClientLayout from "../pages/clientPages/ClientLayout";
import ClientProfile from "../pages/clientPages/profile/ClientProfile";
import EditClientProfile from "../pages/clientPages/profile/EditClientProfile";
import JobPostingForm from "../pages/clientPages/jobPosting/JobPostingForm";
import NotificationList from "../pages/clientPages/Notification";
import ProposalDetails from "../pages/clientPages/Proposal/ProposalDetails";
import ClientProject from "../pages/clientPages/project/ClientProject";


function ClientRoutes() {
  return (
  
    <>
      <Route element={<ProtectedClientRoute />}>
        <Route path="/client-dashboard" element={<ClientLayout />}>
          <Route index element={<ClientProject/>} />
          <Route path="job-details/:jobId" element={<>job-details</>} />
          <Route
            path="job-details/:jobId/all-proposal"
            element={<>job-proposal</>}
          />
          <Route
            path="jobs/:proposalId/proposals"
            element={<ProposalDetails/>}
          />
          <Route path="payments" element={<div>Payment Page</div>} />
          <Route path="profile" element={<ClientProfile/>} />
          <Route path="profile/edit" element={<EditClientProfile/>} />
          <Route path="message" element={<div>Message Page</div>} />
          <Route path="notification" element={<NotificationList/>} />
          <Route path="posting" element={<JobPostingForm/>} />
          <Route path="freelancer" element={<div>Freelancer Page</div>} />
          <Route
            path="interview"
            element={<div>Interview Scheduling Page</div>}
          />
          <Route
            path="dispute"
            element={<div>Dispute Resolution Page</div>}
          />
        </Route>
      </Route>
    </>
  )
}

export default ClientRoutes
