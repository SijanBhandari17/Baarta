import { useState } from 'react';
import { navbarInfo } from '../../utils/navLists';

const userName = 'Alonso';
const usersThreadCount = '150';
const usersRepliesCount = '500';

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
  return (
    <aside className="bg-layout-elements w-[15%] border border-l-white/10 p-6">
      <DisplayUserInfo />
      <DisplayNavButtons />
    </aside>
  );
}

function DisplayUserInfo() {
  return (
    <div>
      <h1 className="text-font mb-8 text-[28px] font-semibold">Welcome Back, {userName}</h1>
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
          <div
            key={index}
            onClick={() => setActiveIcon(index)}
            className={`${
              index === activeIcon ? activeStyle : ''
            } hover:bg-layout-elements-focus rounded-button-round my-2 flex cursor-pointer items-center px-2 py-4`}
          >
            <img src={item.imgSrc} className="mr-4" />
            <h1 className="text-font text-title">{item.label}</h1>
          </div>
        );
      })}
    </div>
  );
}

export default LeftAsideBar;
