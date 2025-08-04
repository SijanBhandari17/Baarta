import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import upcomingEventsArray from '../../utils/fetchUpcommingEvents';
import SinglePoll from '../ui/Polls';
import upCommingEvents from '../../utils/fetchPoll';
import getActivePolls from '../../utils/fetchPoll';
import LoadingSpinner from './LoadingSpinner';
import SingleEvent from '../ui/SingleEvent';

// import { commuityStatus } from '../../utils/fetchCommnityStatus';

function RightAsideBar() {
  const [selectedPoll, setSelectedPoll] = useState(null);

  return (
    <aside className="bg-layout-elements top-20 flex h-[calc(100vh-5rem)] w-[15%] flex-col border border-l-white/10 p-6">
      <UpcommingEvents />
      {/* <ActivePoll /> */}
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

function ActivePoll() {
  const [activePolls, setActivePolls] = useState([]);

  useEffect(() => {
    const getActivePolls = async () => {
      try {
        const response = await fetch('http://localhost:5000/all/poll', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          setActivePolls(data.body);
        }
      } catch (err) {
        console.log(`Err: ${err}`);
      }
    };

    getActivePolls();
  }, []);

  useEffect(() => {}, [activePolls]);

  if (!activePolls.length > 0) return <LoadingSpinner />;

  return (
    <div className="active-poll bg-layout-elements-focus rounded-button-round mb-8 w-full cursor-pointer border border-white/10">
      <h1 className="text-title text-font my-2 ml-5 font-semibold uppercase">Active Poll</h1>
      {!activePolls.length && <LoadingSpinner />}
      {activePolls.map((item, index) => (
        <SinglePoll poll={item} key={index} updateInAsideBar={setActivePolls} />
      ))}
    </div>
  );
}

export default RightAsideBar;
