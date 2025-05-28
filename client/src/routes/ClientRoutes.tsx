// import React from 'react'
import { Routes, Route,  } from "react-router-dom";
import ProtectedClientRoute from "../utils/ProtectedRoutes/ProtectedClientRoute";
import ClientLayout from "../pages/clientPages/ClientLayout";


function ClientRoutes() {
  return (
  
    <Routes>
      <Route element={<ProtectedClientRoute />}>
        <Route path="/client-dashboard" element={<ClientLayout />}>
          <Route index element={<>gvgv</>} />
          <Route path="job-details/:jobId" element={<>job-details</>} />
          <Route
            path="job-details/:jobId/all-proposal"
            element={<>job-proposal</>}
          />
          <Route
            path="job-details/:jobId/all-proposal/propisal-details/:proposalId"
            element={<>proposalId</>}
          />
          <Route path="payments" element={<div>Payment Page</div>} />
          <Route path="profile" element={<>profile</>} />
          <Route path="profile/edit" element={<>profile edit</>} />
          <Route path="message" element={<div>Message Page</div>} />
          <Route path="notification" element={<div>Notification Page</div>} />
          <Route path="posting" element={<>posting</>} />
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
    </Routes>
  )
}

export default ClientRoutes
