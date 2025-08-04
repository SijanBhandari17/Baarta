import { useNavigate } from 'react-router-dom';
import liveDiscussion from '../../../../utils/fetchLiveDiscussions';

function LiveDiscussions() {
  const navigate = useNavigate();
  const handleClick = discussionId => {
    navigate(`/livediscussions/${encodeURIComponent(discussionId)}`);
  };
  return (
    <div className="grid grid-cols-2 place-content-stretch gap-4">
      {liveDiscussion.map((item, index) => {
        return (
          <div
            key={index}
            className="bg-layout-elements-focus rounded-button-round flex flex-col gap-3 px-4 py-6"
          >
            <h1
              onClick={() => handleClick(item.id)}
              className="text-font text-title cursor-pointer font-semibold"
            >
              {item.title}
            </h1>
            <p className="text-font-light/60">{item.genre}</p>
            <div className="flex gap-4">
              <p className="text-font before:mr-1 before:inline-block before:size-[10px] before:rounded-full before:bg-green-500 before:content-['']">
                {item.participations} participants
              </p>
              <p className="text-font-light before:mr-4 before:inline-block before:size-[10px] before:content-['🕛']">
                {item.duration}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LiveDiscussions;
