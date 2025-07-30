import { useState } from 'react';
import PollModal from '../common/nav/asidebar/pollmodal';

function SinglePoll({ poll }) {
  const [selectedPoll, setSelectedPoll] = useState(null);

  const options = poll.option || [];
  const total = options.reduce((sum, opt) => sum + (opt.voter_Id.length || 0), 0);

  return (
    <>
      <div
        className="hover:bg-layout-elements-hover flex w-full cursor-pointer flex-col items-center gap-2 px-3 py-2 transition"
        onClick={() => setSelectedPoll(poll)}
      >
        <h2 className="text-body text-font m-2 text-center font-medium">{poll.title}</h2>
        {options.map(opt => {
          const percent = total > 0 ? ((opt.voter_Id.length / total) * 100).toFixed(1) : 0;
          return (
            <div key={opt._id} className="mb-2 w-5/6">
              <div className="mb-1 flex justify-between text-sm text-white/60">
                <span>{opt.name}</span>
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
      {selectedPoll && <PollModal poll={selectedPoll} onClose={() => setSelectedPoll(null)} />}
    </>
  );
}
export default SinglePoll;
