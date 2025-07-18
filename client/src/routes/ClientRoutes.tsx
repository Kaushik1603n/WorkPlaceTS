// import React from 'react'
import {  Route,  } from "react-router-dom";
import ProtectedClientRoute from "../utils/ProtectedRoutes/ProtectedClientRoute";
import ClientLayout from "../pages/clientPages/ClientLayout";
import ClientProfile from "../pages/clientPages/profile/ClientProfile";
import EditClientProfile from "../pages/clientPages/profile/EditClientProfile";
import JobPostingForm from "../pages/clientPages/jobPosting/JobPostingForm";
import NotificationList from "../pages/clientPages/Notification";
import ProposalDetails from "../pages/clientPages/Proposal/ProposalDetails";
import ClientDashBoard from "../pages/clientPages/project/ClientDashBoard";
import ClientJobWithProposals from "../pages/clientPages/project/ClientProjectDetails";
import FreelancerList from "../pages/clientPages/freelancerListing/FreelancerList";
import ClientProjectPage from "../pages/clientPages/project/ClientProjectPage";
import MessagingPage from "../pages/message/MessagingPage";
import ActiveClinetProject from "../pages/clientPages/project/ActiveClinetProject";
import ClientTicketDashboard from "../pages/clientPages/ticket/ClientTicketDashboard";
import AllClientProject from "../pages/clientPages/project/AllProject";
import PaymentsTable from "../pages/clientPages/project/PaymentPage";


function ClientRoutes() {
  return (
    <>
      <Route element={<ProtectedClientRoute />}>
        <Route path="/client-dashboard" element={<ClientLayout />}>
          <Route index element={<ClientDashBoard/>} />
          <Route
            path="project"
            element={<AllClientProject/>}
          />
          <Route path="project/:jobId" element={<ClientJobWithProposals/>} />
          <Route
            path="jobs/:proposalId/proposals"
            element={<ProposalDetails/>}
          />
          <Route path="payments" element={<PaymentsTable/>} />
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
            element={<ClientTicketDashboard/>}
          />
        </Route>
      </Route>
    </>
  )
}

export default ClientRoutes
