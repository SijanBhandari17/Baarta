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
    <aside className="bg-layout-elements max-w-80 p-6">
      <DisplayUserInfo />
      {/* <DisplayNavButtons /> */}
    </aside>
  );
}

function DisplayUserInfo() {
  return (
    <div>
      <h1 className="text-font mb-4 text-[28px] font-semibold">Welcome Back, {userName}</h1>
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
export default LeftAsideBar;
