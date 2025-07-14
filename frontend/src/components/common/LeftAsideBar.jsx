import { useState } from 'react';
import { navbarInfo } from '../../utils/navLists';
import { Navigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const usersThreadCount = 10;
const usersRepliesCount = 20;
const statsData = [
  {
    label: 'Threads',
    value: usersThreadCount,
  },
  {
    label: 'Replies',
    value: usersRepliesCount,
  },
];

function LeftAsideBar() {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/landingpage" replace />;
  }
  return (
    <aside className="bg-layout-elements w-[15%] border border-r-white/10 p-4">
      <DisplayUserInfo />
      <DisplayNavButtons />
    </aside>
  );
}

function DisplayUserInfo() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-font mb-8 text-[28px] font-semibold">
        Welcome Back, {user.info.username}
      </h1>
      <div className="flex gap-2">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className={'bg-layout-elements-focus rounded-button-round w-1/2 px-2 py-4'}
          >
            <p className="text-font-light">{stat.label}</p>
            <p className="text-font text-title font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DisplayNavButtons() {
  const [activeIcon, setActiveIcon] = useState(0);
  const activeStyle = 'bg-layout-elements-focus';

  return (
    <div className="my-8">
      {navbarInfo.map((item, index) => {
        return (
          <NavLink
            key={index}
            to={'/' + item.label.toLowerCase()}
            onClick={() => setActiveIcon(index)}
            className={`${
              index === activeIcon ? activeStyle : ''
            } hover:bg-layout-elements-focus rounded-button-round my-2 flex cursor-pointer items-center px-2 py-4 no-underline`}
          >
            <img src={item.imgSrc} alt={item.label} className="mr-4" />
            <h1 className="text-font text-title">{item.label}</h1>
          </NavLink>
        );
      })}
    </div>
  );
}

export default LeftAsideBar;
