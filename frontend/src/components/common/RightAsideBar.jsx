import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import upcomingEventsArray from '../../utils/fetchUpcommingEvents';
import activePollArray from '../../utils/fetchActivePolls';
import CalenderIcon from '../../assets/icons/calendar.svg';
import PollModal from './nav/asidebar/pollmodal';
// import { communityStatus } from '../../utils/fetchCommnityStatus';

function RightAsideBar() {
  const [selectedPoll, setSelectedPoll] = useState(null);

  return (
    <aside className="bg-layout-elements top-20 flex w-[15%] flex-1 flex-col border border-l-white/10 p-6">
      <UpcommingEvents />
      <ActivePoll onPollClick={setSelectedPoll} />
      {selectedPoll && <PollModal poll={selectedPoll} onClose={() => setSelectedPoll(null)} />}
      {/* <CommunityStatus /> */}
    </aside>
  );
}

function UpcommingEvents() {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate('/upcommingevents')} className="upcomming-events mb-8 w-full">
      <h1 className="text-title text-font mb-4 font-semibold uppercase">Upcoming Events</h1>
      {upcomingEventsArray.map((item, index) => (
        <SingleEvent event={item} key={index} />
      ))}
    </div>
  );
}

function SingleEvent({ event }) {
  return (
    <div className="individual-upcoming-event hover:bg-layout-elements-focus rounded-button-round mb-4 flex cursor-pointer items-center gap-2 pl-1">
      <img src={CalenderIcon} alt="Calendar Icon" width="20px" height="20px" />
      <div className="upcoming-event-info">
        <h2 className="text-body text-font">{event.title}</h2>
        <p className="text-small text-font-light/50">
          {event.date} at {event.time}
        </p>
      </div>
    </div>
  );
}

function ActivePoll({ onPollClick }) {
  return (
    <div className="active-poll bg-layout-elements-focus rounded-button-round mb-8 w-full cursor-pointer border border-white/10">
      <h1 className="text-title text-font my-2 ml-5 font-semibold uppercase">Active Poll</h1>
      {activePollArray.map((item, index) => (
        <SinglePoll poll={item} key={index} onClick={() => onPollClick(item)} />
      ))}
    </div>
  );
}

function SinglePoll({ poll, onClick }) {
  const options = poll.options || [];
  const total = options.reduce((sum, opt) => sum + (opt.votes || 0), 0);

  return (
    <div
      className="hover:bg-layout-elements-hover flex w-full cursor-pointer flex-col items-center gap-2 px-3 py-2 transition"
      onClick={onClick}
    >
      <h2 className="text-body text-font m-2 text-center font-medium">{poll.title}</h2>
      {options.map((opt, idx) => {
        const percent = total > 0 ? ((opt.votes / total) * 100).toFixed(1) : 0;
        return (
          <div key={idx} className="mb-2 w-5/6">
            <div className="mb-1 flex justify-between text-sm text-white/60">
              <span>{opt.label}</span>
              <span>{percent}%</span>
            </div>
            <div className="relative h-2 w-full rounded-xl bg-gray-700">
              <div
                className="absolute top-0 left-0 h-2 rounded-xl bg-purple-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
      <div className="mb-2 text-center text-sm text-white/50">
        {total} votes · {poll.deadline}
      </div>
    </div>
  );
}

// Optional: Uncomment if you need it
// function CommunityStatus() {
//   return (
//     <div className="community-status width-full mt-2">
//       <h1 className="text-title text-font my-4 font-semibold">Community Status</h1>
//       <div>
//         {communityStatus.map((item, index) => (
//           <div key={index} className="mb-4 flex items-center gap-4">
//             <img src={item.imgSrc} alt="Community" />
//             <p className="text-body text-font">{item.title}</p>
//             <p className="text-font ml-auto font-semibold">{item.count}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

export default RightAsideBar;
