import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SinglePoll from '../ui/Polls';
import { useForum } from '../../context/ForumContext';

function RightAsideBar() {
  const [selectedPoll, setSelectedPoll] = useState(null);

  return (
    <aside className="bg-layout-elements top-20 flex h-[calc(100vh-5rem)] w-[15%] flex-col justify-center border border-l-white/10 p-6">
      <ActivePoll />
    </aside>
  );
}
function ActivePoll() {
  const { allActivePolls, updateAllPollInContext } = useForum();
  return (
    <div className="active-poll bg-layout-elements-focus rounded-button-round mb-8 w-full cursor-pointer border border-white/10">
      <h1 className="text-title text-font my-2 ml-5 font-semibold uppercase">Active Poll</h1>
      {allActivePolls.length === 0 ? (
        <div className="text-body flex h-40 w-full items-center justify-center text-xl text-white">
          You haven't added any polls
        </div>
      ) : (
        allActivePolls?.map((item, index) => (
          <SinglePoll updateAllPollInContext={updateAllPollInContext} poll={item} key={index} />
        ))
      )}
    </div>
  );
}
export default RightAsideBar;
