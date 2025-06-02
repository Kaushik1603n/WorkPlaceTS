import { Route, } from "react-router-dom";
import AdminLayout from "../pages/admin/AdminLayout";
import Freelancer from "../pages/admin/Freelancer";
import Client from "../pages/admin/Client";
import AllUsers from "../pages/admin/AllUsers";

function AdminRoutes() {
    return (
        <>
            {/* <Route element={<></>}> */}
            <Route path="/admin-dashboard" element={<AdminLayout />}>
                <Route index element={<>gvgv</>} />
                <Route path="projects" element={<div>project Page</div>} />
                <Route path="payments" element={<div>Payment Page</div>} />
                <Route path="Report-Resolution" element={<>Report-Resolution</>} />
                <Route path="analytics-dashboard" element={<>analytics-dashboard</>} />
                <Route path="notification" element={<div>Notification Page</div>} />
                <Route path="freelancer" element={<Freelancer/>} />
                <Route path="client" element={<Client />} />
                <Route path="users" element={<AllUsers/>} />
                
            </Route>
            {/* </Route> */}
        </>
    )
}

export default AdminRoutes
