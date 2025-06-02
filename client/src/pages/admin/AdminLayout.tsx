import { Outlet } from 'react-router-dom';
import Navbar from '../../components/admin/Navbar';
import Sidebar from '../../components/admin/Sidebar';

const AdminLayout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
