import { Outlet } from 'react-router-dom';
import NavigationBar from '../../components/navigationBar/NavigationBar';
import Sidebar from '../../components/client/Sidebar';

const ClientLayout = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <NavigationBar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
