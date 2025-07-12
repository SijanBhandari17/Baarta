import Header from '../components/common/Header';
import RightAsideBar from '../components/common/RightAsideBar';
import LeftAsideBar from '../components/common/LeftAsideBar';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  return (
    <div className="flex h-svh flex-col">
      <Header />
      <div className="flex w-screen flex-1">
        <LeftAsideBar />
        <Outlet />
        <RightAsideBar />
      </div>
    </div>
  );
}

export default Dashboard;
