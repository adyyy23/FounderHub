import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex">
      <Sidebar />
      <div className="flex-1 ml-[210px] flex flex-col">
        <Header />
        <main className="flex-1 mt-[60px] overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
