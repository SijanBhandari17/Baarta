import Header from '../components/common/Header';
import RightAsideBar from '../components/common/RightAsideBar';
import LeftAsideBar from '../components/common/LeftAsideBar';
import DashboardContent from '../components/common/DashboardContent';

function Dashboard() {
  return (
    <div className="flex h-svh flex-col">
      <Header />
      <div className="flex w-screen flex-1">
        <LeftAsideBar />
        <DashboardContent />
        <RightAsideBar />
      </div>
    </div>
  );
}

export default Dashboard;
