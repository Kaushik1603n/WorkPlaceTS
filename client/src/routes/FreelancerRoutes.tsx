import {  Route, } from "react-router-dom";
import ProtectedFreelancer from "../utils/ProtectedRoutes/ProtectedFreelancer";
import FreelancerLayout from "../pages/freelancerPages/FreelancerLayout";
import FreelancerProfile from "../pages/freelancerPages/profile/FreelancerProfile";
import EditFreelancerProfile from "../pages/freelancerPages/profile/EditFreelancerProfile";
import FreelancerBit from "../pages/freelancerPages/proposal/FreelancerBit";
import FreelancerProject from "../pages/freelancerPages/project/projects";
import ProjectSubmittion from "../pages/freelancerPages/project/ProjectSubmittion";

function FreelancerRoutes() {
    return (
        <>
            <Route element={<ProtectedFreelancer />}>
                <Route path="/freelancer-dashboard" element={<FreelancerLayout />}>
                    <Route index element={<FreelancerProject />} />
                    <Route path="project/project-details/:jobId" element={<ProjectSubmittion/>} />
                    <Route path="payments" element={<div>Payment Page</div>} />
                    <Route path="profile" element={<FreelancerProfile />} />
                    <Route path="profile/edit" element={<EditFreelancerProfile />} />
                    <Route path="message" element={<div>Message Page</div>} />
                    <Route path="notification" element={<div>Notification Page</div>} />
                    <Route path="project" element={<div>project page</div>} />
                    <Route path="client" element={<div>Client Page</div>} />
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
