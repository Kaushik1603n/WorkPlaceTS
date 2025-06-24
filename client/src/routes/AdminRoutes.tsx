import { Route, } from "react-router-dom";
import AdminLayout from "../pages/admin/AdminLayout";
import Freelancer from "../pages/admin/Freelancer";
import Client from "../pages/admin/Client";
import AllUsers from "../pages/admin/AllUsers";
import FreelancerVerifyProfile from "../components/admin/userProfile/FreelancerProfile";
import ClentVerifyProfile from "../components/admin/userProfile/ClentProfile";
import ProtectedAdmin from "../utils/ProtectedRoutes/ProtectedAdmin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminTicketDashboard from "../pages/admin/AdminTicketDashboard";
import PaymentLising from "../pages/admin/PaymentLising";
import AllProjectListing from "../pages/admin/AllProject";
import AdminProjectDetails from "../pages/admin/ProjectDetails";

function AdminRoutes() {
    return (
        <>
            <Route element={<ProtectedAdmin />}>
                <Route path="/admin-dashboard" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard/>} />
                    <Route path="projects" element={<AllProjectListing/>} />
                    <Route path="projects/:jobId" element={<AdminProjectDetails/>} />
                    <Route path="payments" element={<PaymentLising/>} />
                    <Route path="Report-Resolution" element={<AdminTicketDashboard/>} />
                    <Route path="analytics-dashboard" element={<>analytics-dashboard</>} />
                    <Route path="notification" element={<div>Notification Page</div>} />
                    <Route path="freelancer" element={<Freelancer />} />
                    <Route path="freelancer/:userId" element={<FreelancerVerifyProfile />} />
                    <Route path="client" element={<Client />} />
                    <Route path="client/:userId" element={<ClentVerifyProfile />} />
                    <Route path="users" element={<AllUsers />} />

                </Route>
            </Route>
        </>

    )
}

export default AdminRoutes
