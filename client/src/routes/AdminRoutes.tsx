import { Route, } from "react-router-dom";
import AdminLayout from "../pages/admin/AdminLayout";

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
                <Route path="freelancer" element={<div>Freelancer Page</div>} />
                <Route path="client" element={<div>client Page</div>} />
                <Route path="users" element={<div>users Page</div>} />
                
            </Route>
            {/* </Route> */}
        </>
    )
}

export default AdminRoutes
