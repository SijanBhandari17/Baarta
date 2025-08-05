import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SinglePoll from '../ui/Polls';

function RightAsideBar() {
  const [selectedPoll, setSelectedPoll] = useState(null);

  return (
    <aside className="bg-layout-elements top-20 flex h-[calc(100vh-5rem)] w-[15%] flex-col border border-l-white/10 p-6">
      <ActivePoll />
    </aside>
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
        console.log(data);
        if (response.ok) {
          console.log(data);
          setActivePolls(data.body);
        }
      } catch (err) {
        console.log(`Err: ${err}`);
      }
    };
    getActivePolls();
  }, []);
  console.log(activePolls);
  return (
    <div className="active-poll bg-layout-elements-focus rounded-button-round mb-8 w-full cursor-pointer border border-white/10">
      <h1 className="text-title text-font my-2 ml-5 font-semibold uppercase">Active Poll</h1>
      {activePolls.map((item, index) => (
        <SinglePoll poll={item} key={index} />
      ))}
    </div>
  );
}
export default RightAsideBar;
