import { useState } from 'react';
import upcommingEventsArray from '../../utils/fetchUpcommingEvents';
import activePollArray from '../../utils/fetchActivePolls';
import CalenderIcon from '../../assets/icons/calendar.svg';
// import { communityStatus } from '../../utils/fetchCommnityStatus';
import PollModal from './nav/asidebar/pollmodal';

function RightAsideBar() {
  const [selectedPoll, setSelectedPoll] = useState(null);

  return (
    <aside className="bg-layout-elements flex w-1/2 flex-col border border-l-white/10 p-6">
      <UpcommingEvents />
<<<<<<< Updated upstream
      <ActivePoll />
      <CommunityStatus />
=======
      <ActivePoll onPollClick={setSelectedPoll} />

      {selectedPoll && (
        <PollModal poll={selectedPoll} onClose={() => setSelectedPoll(null)} />
      )}
      {/* <CommunityStatus /> */}
>>>>>>> Stashed changes
    </aside>
  );
}

function UpcommingEvents() {
  return (
    <div className="upcomming-events mb-8 w-full">
<<<<<<< Updated upstream
      <h1 className="text-title text-font mb-4 font-semibold">Upcomming Events</h1>
=======
      <h1 className="text-title text-font mb-4 font-semibold uppercase">Upcoming Events</h1>
>>>>>>> Stashed changes
      {upcommingEventsArray.map((item, index) => (
        <SingleEvent event={item} key={index} />
      ))}
    </div>
  );
}

function SingleEvent({ event }) {
  return (
<<<<<<< Updated upstream
    <div className="individual-upcomming-event mb-4 flex items-center gap-2">
      <img src={CalenderIcon} alt="Calender Icon" width="20px" height="20px" />
      <div className="upcomming-event-info">
        <h2 className="text-body text-font">{event.title}</h2>
        <p className="text-small text-font-light/50">
=======
    <div className="hover:bg-layout-elements-focus rounded-lg mb-4 flex cursor-pointer items-center gap-2 p-2 transition duration-200">
      <img src={CalenderIcon} alt="Calendar Icon" width="20px" height="20px" />
      <div>
        <h2 className="text-white">{event.title}</h2>
        <p className="text-sm text-white/50">
>>>>>>> Stashed changes
          {event.date} at {event.time}
        </p>
      </div>
    </div>
  );
}

function ActivePoll({ onPollClick }) {
  return (
<<<<<<< Updated upstream
    <div className="active-poll bg-layout-elements-focus rounded-button-round mb-8 w-full border border-white/10">
      <h1 className="text-title text-font my-2 ml-5 font-semibold">Active Poll</h1>
      {activePollArray.map((item, index) => {
        return <SinglePolls poll={item} key={index} />;
      })}
=======
    <div className="bg-layout-elements-focus rounded-xl mb-8 w-full border border-white/10">
      <h1 className="text-title text-font my-2 ml-5 font-semibold uppercase">Active Poll</h1>
      {activePollArray.map((item, index) => (
        <div
          key={index}
          onClick={() => onPollClick(item)}
          className="cursor-pointer hover:bg-layout-elements transition p-2 rounded-lg"
        >
          <SinglePoll poll={item} />
        </div>
      ))}
>>>>>>> Stashed changes
    </div>
  );
}

function SinglePoll({ poll }) {
  const options = poll.options || [];
  const total = options.reduce((sum, opt) => sum + (opt.votes || 0), 0);

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <h2 className="text-body text-font m-2 text-center font-medium">{poll.title}</h2>
      {options.map((opt, idx) => {
        const percent = total > 0 ? ((opt.votes / total) * 100).toFixed(1) : 0;
        return (
          <div key={idx} className="w-5/6 mb-2">
            <div className="flex justify-between text-sm text-white/60 mb-1">
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
      <div className="text-sm text-white/50 text-center mb-2">
        {total} votes · {poll.deadline}
      </div>
    </div>
  );
}

<<<<<<< Updated upstream
function CommunityStatus() {
  return (
    <div className="community-satus width-full mt-2">
      <h1 className="text-title text-font my-4 font-semibold">Community Status</h1>
      <div>
        {communityStatus.map((item, index) => {
          return (
            <div key={index} className="mb-4 flex items-center gap-4">
              <img src={item.imgSrc} />
              <p className="text-body text-font">{item.title}</p>
              <p className="text-font ml-auto font-semibold">{item.count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
=======

// Uncomment if you plan to use CommunityStatus later
// function CommunityStatus() {
//   return (
//     <div className="community-satus width-full mt-2">
//       <h1 className="text-title text-font my-4 font-semibold">Community Status</h1>
//       <div>
//         {communityStatus.map((item, index) => (
//           <div key={index} className="mb-4 flex items-center gap-4">
//             <img src={item.imgSrc} />
//             <p className="text-body text-font">{item.title}</p>
//             <p className="text-font ml-auto font-semibold">{item.count}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
>>>>>>> Stashed changes

export default RightAsideBar;
