import { X, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePost } from '../../context/PostContext';

function InvitePeople({ onClose }) {
  const [allUsers, setAllUsers] = useState([]);
  const { forumToShow } = usePost();
  const forumId = forumToShow._id;
  console.log(forumToShow);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`http://localhost:5000/all/userProfile?forumId=${forumId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (response.ok) {
          setAllUsers(data.body);
        } else {
          console.error('Upload failed:', data.error);
        }
      } catch (err) {
        console.log(`Err: ${err}`);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex max-h-[80vh] w-full max-w-2xl flex-col space-y-6 overflow-hidden rounded-xl bg-zinc-900 p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">Invite People</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-white"
            aria-label="Close"
          >
            <X size={28} className="cursor-pointer" />
          </button>
        </div>
        {allUsers.length === 0 ? (
          <p className="text-lg text-white">No users found</p>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <ul className="space-y-3 text-white">
              {allUsers.map(user => (
                <DisplayUser key={user._id} setUsers={setAllUsers} user={user} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function DisplayUser({ user, setUsers }) {
  const { forumToShow } = usePost();
  const handleInviteClick = async () => {
    const userId = user._id;
    const type = 'forum_invite';
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
    <div className="mb-4 flex items-center gap-8 rounded-lg border border-zinc-700 bg-zinc-800 p-6 text-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      <img
        src={user?.profilePicLink}
        alt={user?.username}
        className="h-16 w-16 rounded-full border-2 border-gray-200 object-cover shadow-sm"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          <span className="text-font text-xl font-semibold">{user?.username}</span>
        </div>
      </div>
      <button
        onClick={() => handleInviteClick()}
        className="text-body flex cursor-pointer items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-gray-700 active:bg-blue-600"
      >
        <UserPlus size={16} />
        Invite
      </button>{' '}
    </div>
  );
}
export default InvitePeople;
