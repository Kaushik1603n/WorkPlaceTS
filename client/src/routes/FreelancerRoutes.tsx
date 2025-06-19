import {  Route, } from "react-router-dom";
import ProtectedFreelancer from "../utils/ProtectedRoutes/ProtectedFreelancer";
import FreelancerLayout from "../pages/freelancerPages/FreelancerLayout";
import FreelancerProfile from "../pages/freelancerPages/profile/FreelancerProfile";
import EditFreelancerProfile from "../pages/freelancerPages/profile/EditFreelancerProfile";
import FreelancerBit from "../pages/freelancerPages/proposal/FreelancerBit";
import FreelancerProject from "../pages/freelancerPages/project/projects";
import ProjectSubmittion from "../pages/freelancerPages/project/ProjectSubmittion";
import ClientList from "../pages/freelancerPages/clientListing/ClientList";
import MessagingPage from "../pages/message/MessagingPage";
import PaymentList from "../pages/freelancerPages/payment/PaymentList";

function FreelancerRoutes() {
    return (
        <>
            <Route element={<ProtectedFreelancer />}>
                <Route path="/freelancer-dashboard" element={<FreelancerLayout />}>
                    <Route index element={<FreelancerProject />} />
                    <Route path="project/project-details/:jobId" element={<ProjectSubmittion/>} />
                    <Route path="payments" element={<PaymentList />} />
                    <Route path="profile" element={<FreelancerProfile />} />
                    <Route path="profile/edit" element={<EditFreelancerProfile />} />
                    <Route path="message" element={<MessagingPage/>} />
                    <Route path="notification" element={<div>Notification Page</div>} />
                    <Route path="project" element={<div>project page</div>} />
                    <Route path="client" element={<ClientList/>} />
                    <Route
                        path="interview"
                        element={<div>Interview Scheduling Page</div>}
                    />
                    <Route path="proposals" element={<FreelancerBit/>} />
                    <Route
                        path="dispute"
                        element={<div>Dispute Resolution Page</div>}
                    />
                </Route>
            </Route>
        </>
    )
}

export default FreelancerRoutes
