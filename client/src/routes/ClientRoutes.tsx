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
import ClientJobWithProposals from "../pages/clientPages/project/ClientProjectDetails";
import FreelancerList from "../pages/clientPages/freelancerListing/FreelancerList";
import ClientProjectPage from "../pages/clientPages/project/ClientProjectPage";
import PendingPaymentListing from "../pages/clientPages/project/PaymentPage";
import MessagingPage from "../pages/message/MessagingPage";
import ActiveClinetProject from "../pages/clientPages/project/ActiveClinetProject";


function ClientRoutes() {
  return (
  
    <>
      <Route element={<ProtectedClientRoute />}>
        <Route path="/client-dashboard" element={<ClientLayout />}>
          <Route index element={<ClientProject/>} />
          <Route path="job-details/:jobId" element={<ClientJobWithProposals/>} />
          <Route
            path="job-details/:jobId/all-proposal"
            element={<>job-proposal</>}
          />
          <Route
            path="jobs/:proposalId/proposals"
            element={<ProposalDetails/>}
          />
          <Route path="payments" element={<PendingPaymentListing/>} />
          <Route path="profile" element={<ClientProfile/>} />
          <Route path="profile/edit" element={<EditClientProfile/>} />
          <Route path="message" element={<MessagingPage/>} />
          <Route path="notification" element={<NotificationList/>} />
          <Route path="active-project" element={<ActiveClinetProject/>} />
          <Route path="active-project/:jobId" element={<ClientProjectPage/>} />
          <Route path="posting" element={<JobPostingForm/>} />
          <Route path="freelancer" element={<FreelancerList/>} />
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
