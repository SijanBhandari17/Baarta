import { UserPlus, UserRoundCog, X } from 'lucide-react';
import { usePost } from '../../context/PostContext';
import { useEffect, useState } from 'react';

function ShowForumsMembers({ forum, onClose }) {
  const [members, setMembers] = useState([]);
  const { forumToShow } = usePost();

  useEffect(() => {
    const getAllMembers = async userId => {
      try {
        const response = await fetch(
          `http://localhost:5000/all/singleuserprofile?userId=${userId}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        const data = await response.json();
        if (response.ok) {
          console.log(data);
          setMembers(prev => {
            if (prev.some(item => item._id === data.body._id)) return prev;
            return [...prev, data.body];
          });
        } else {
          console.error('Upload failed:', data.error);
        }
      } catch (err) {
        console.log(`Err: ${err}`);
      }
    };
    console.log(forum);
    for (const members of forum.member_id) {
      console.log(members);
      getAllMembers(members);
    }
  }, []);

  const handlePromoteClick = async userId => {
    const type = 'promote_to_moderator';
    try {
      const response = await fetch('http://localhost:5000/notification/sendInvite', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, type, forumId: forumToShow._id }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
      } else {
        console.error('Upload failed:', data.error);
      }
    } catch (err) {
      console.log(`Err: ${err}`);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex max-h-[80vh] w-full max-w-2xl flex-col space-y-6 overflow-hidden rounded-xl bg-zinc-900 p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">Select Moderator</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-white"
            aria-label="Close"
          >
            <X size={28} className="cursor-pointer" />
          </button>
        </div>
        {members.map(item => {
          return <DisplayUser user={item} key={item._id} handlePromoteClick={handlePromoteClick} />;
        })}
      </div>
    </div>
  );
}
function DisplayUser({ user, handlePromoteClick }) {
  const { forumToShow } = usePost();
  const [moderaterRequestSent, setModeratorRequestSent] = useState(false);
  return (
    <div className="mb-4 flex items-center gap-8 rounded-lg border border-zinc-700 bg-zinc-800 p-6 text-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      <img
        src={user?.userProfilePicLink}
        alt={user?.username}
        className="h-16 w-16 rounded-full border-2 border-gray-200 object-cover shadow-sm"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <span className="text-font text-xl font-semibold">{user?.username}</span>
        </div>
      </div>
      {!moderaterRequestSent ? (
        <button
          onClick={async () => {
            await handlePromoteClick(user._id);
            setModeratorRequestSent(true);
          }}
          className="text-body flex cursor-pointer items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-gray-700 active:bg-blue-600"
        >
          <UserPlus size={16} />
          Promote to Moderator
        </button>
      ) : (
        <button
          onClick={async () => {
            await handlePromoteClick(user._id);
          }}
          className="text-body flex cursor-pointer items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-gray-700 active:bg-blue-600"
        >
          Moderator Request Sent
        </button>
      )}
    </div>
  );
}
export default ShowForumsMembers;
