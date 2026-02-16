import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import AppSidebar from './AppSidebar';

const AppLayout = () => {
  return (
    <div className="h-screen flex flex-col">
      <AppHeader />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <main className="flex-1 flex overflow-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
