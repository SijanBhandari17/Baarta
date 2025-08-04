import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SingleEvent from '../ui/SingleEvent';

function RightAsideBar() {
  const [selectedPoll, setSelectedPoll] = useState(null);

  return (
    <aside className="bg-layout-elements top-20 flex h-[calc(100vh-5rem)] w-[15%] flex-col border border-l-white/10 p-6">
      <UpcommingEvents />
    </aside>
  );
}

function UpcommingEvents() {
  const navigate = useNavigate();
  const [discussions, setdiscussions] = useState([]);

  useEffect(() => {
    const getUpcommingEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/all/discussion', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok) {
          setdiscussions(data.body);
          console.log(data);
        } else {
          console.error('Upload failed:', data.error);
        }
      } catch (err) {
        console.log(`Err: ${err}`);
      }
    };
    getUpcommingEvents();
  }, []);

  return (
    <div className="upcomming-events mb-8 w-full">
      <h1 className="text-title text-font mb-4 font-semibold uppercase">Upcoming Events</h1>
      {discussions.map((item, index) => (
        <SingleEvent event={item} key={index} />
      ))}
    </div>
  );
}

export default RightAsideBar;
