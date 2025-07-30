import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function NewForums({ onClose }) {
  const [forums, setForums] = useState([]);
  useEffect(() => {
    const fetchAllForums = async () => {
      try {
        const response = await fetch('http://localhost:5000/all/forum', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setForums(data.body);
        }
      } catch (err) {
        console.log(`Err: ${err}`);
      }
    };

    fetchAllForums();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex max-h-[80vh] w-full max-w-2xl flex-col space-y-6 overflow-hidden rounded-xl bg-zinc-900 p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">Join New Forum</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-white"
            aria-label="Close"
          >
            <X size={28} className="cursor-pointer" />
          </button>
        </div>
        {forums.map(item => {
          return <IndividualForums key={item._id} item={item} />;
        })}
      </div>
    </div>
  );
}
function IndividualForums({ item }) {
  const [requestSent, setRequestSent] = useState(false);
  const { user } = useAuth();
  const handleRequestJoin = async () => {
    const type = 'join_request';
    const userId = user._id;
    try {
      const response = await fetch('http://localhost:5000/notification/sendInvite', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, type, forumId: item._id }),
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
    <div
      key={item._id}
      className="mb-4 flex items-center gap-8 rounded-lg border border-zinc-700 bg-zinc-800 p-6 text-white shadow-sm transition-shadow duration-200 hover:shadow-md"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          <span className="text-font text-xl font-semibold">{item?.forum_name}</span>
          <span className="text-yellow-800">{item?.genre}</span>
        </div>
      </div>
      {!requestSent ? (
        <button
          onClick={async () => {
            await handleRequestJoin();
            setRequestSent(true);
          }}
          className="text-body flex cursor-pointer items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-gray-700 active:bg-blue-600"
        >
          Send Join Request
        </button>
      ) : (
        <button className="text-body flex cursor-pointer items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-gray-700 active:bg-blue-600">
          Request Sent
        </button>
      )}
    </div>
  );
}

export default NewForums;
