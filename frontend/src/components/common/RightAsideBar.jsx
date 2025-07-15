import upcommingEventsArray from '../../utils/fetchUpcommingEvents';
import CalenderIcon from '../../assets/icons/calendar.svg';
import activePollArray from '../../utils/fetchActivePolls';
import { communityStatus } from '../../utils/fetchCommnityStatus';
import { useNavigate } from 'react-router-dom';

function RightAsideBar() {
  return (
    <aside className="bg-layout-elements sticky top-20 flex h-[calc(100vh-5rem)] w-[15%] flex-col border border-l-white/10 p-6">
      <UpcommingEvents />
      <ActivePoll />
      {/* <CommunityStatus /> */}
    </aside>
  );
}

function UpcommingEvents() {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate('/upcommingevents')} className="upcomming-events mb-8 w-full">
      <h1 className="text-title text-font mb-4 font-semibold uppercase">Upcomming Events</h1>
      {upcommingEventsArray.map((item, index) => (
        <SingleEvents event={item} key={index} />
      ))}
    </div>
  );
}

function SingleEvents({ event }) {
  return (
    <div className="individual-upcomming-event hover:bg-layout-elements-focus rounded-button-round mb-4 flex cursor-pointer items-center gap-2 pl-1">
      <img src={CalenderIcon} alt="Calender Icon" width="20px" height="20px" />
      <div className="upcomming-event-info">
        <h2 className="text-body text-font">{event.title}</h2>
        <p className="text-small text-font-light/50">
          {event.date} at {event.time}
        </p>
      </div>
    </div>
  );
}

function ActivePoll() {
  return (
    <div className="active-poll bg-layout-elements-focus rounded-button-round mb-8 w-full cursor-pointer border border-white/10">
      <h1 className="text-title text-font my-2 ml-5 font-semibold uppercase">Active Poll</h1>
      {activePollArray.map((item, index) => {
        return <SinglePolls poll={item} key={index} />;
      })}
    </div>
  );
}

function SinglePolls({ poll }) {
  return (
    <div className="active-polls mb-2 flex w-full flex-col items-center gap-2">
      <h2 className="text-body text-font m-5">{poll.title}</h2>

      <div className="relative mb-2 h-2 w-5/6 rounded-2xl bg-[#E0B0FF]">
        <div
          className="bg-royalpurple-dark absolute top-0 left-0 h-2 rounded-2xl"
          style={{ width: `${poll.yesCountPercentage}%` }}
        />
      </div>

      <div className="relative mb-2 h-2 w-5/6 rounded-2xl bg-blue-300">
        <div
          className="absolute top-0 left-0 h-2 rounded-2xl bg-[#2F77FF]"
          style={{ width: `${poll.noCountPercentage}%` }}
        />
      </div>

      <div className="text-small text-font-light/50 text-center">
        {poll.votesCount} votes · {poll.deadline}
      </div>
    </div>
  );
}

// function CommunityStatus() {
//   return (
//     <div className="community-satus width-full mt-2">
//       <h1 className="text-title text-font my-4 font-semibold">Community Status</h1>
//       <div>
//         {communityStatus.map((item, index) => {
//           return (
//             <div key={index} className="mb-4 flex items-center gap-4">
//               <img src={item.imgSrc} />
//               <p className="text-body text-font">{item.title}</p>
//               <p className="text-font ml-auto font-semibold">{item.count}</p>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

export default RightAsideBar;
