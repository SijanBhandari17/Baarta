import { formatDistanceToNow } from 'date-fns';
import { X } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useForum } from '../../context/ForumContext';

function ShowNotificationPopUp({ item, onClose }) {
  const { updateNotificationInContext } = useNotification();
  const { fetchForums } = useForum();

  const onAccept = async () => {
    console.log('Called here', item);
    if (item.type === 'forum_invite') {
      console.log(item);
      try {
        const response = await fetch('http://localhost:5000/notification/acceptInvite', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ notificationId: item._id }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log(data);
          fetchForums();
          updateNotificationInContext(item._id, 1);
          return data.body;
        } else {
          console.error('Upload failed:', data.error);
        }
      } catch (err) {
        console.log(`Err: ${err}`);
      }
    } else if (item.type === 'join_request') {
      try {
        const response = await fetch('http://localhost:5000/notification/acceptJoinInvite', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ notificationId: item._id }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log(data);
          fetchForums();
          updateNotificationInContext(item._id, 1);
          return data.body;
        } else {
          console.error('Upload failed:', data.error);
        }
      } catch (err) {
        console.log(`Err: ${err}`);
      }
    } else if (item.type === 'promote_to_moderator') {
      try {
        const response = await fetch('http://localhost:5000/notification/acceptInvite', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ notificationId: item._id }),
        });

        const data = await response.json();
        if (response.ok) {
          console.log(data);
          updateNotificationInContext(item._id, 1);

          return data.body;
        } else {
          console.error('Upload failed:', data.error);
        }
      } catch (err) {
        console.log(`Err: ${err}`);
      }
    }
  };

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

        {item.type === 'forum_invite' && (
          <>
            <div className="flex gap-8">
              <img
                src={item.fromUserProfilePicLink}
                className="h-25 w-25 cursor-pointer rounded-full object-cover object-center"
                alt={`${item.fromUserName}'s profile`}
              />

              <div className="flex flex-col">
                <p className="text-font text-title">
                  {item.fromUserName} has invited you to join {item.forumName}
                </p>
                <p className="text-font-light/80 text-small">
                  {formatDistanceToNow(Number(item.date), { addSuffix: true })}
                </p>
              </div>
            </div>
          </>
        )}
        {item.type === 'join_request' && (
          <>
            <div className="flex gap-8">
              <img
                src={item.fromUserProfilePicLink}
                className="h-25 w-25 cursor-pointer rounded-full object-cover object-center"
                alt={`${item.fromUserName}'s profile`}
              />

              <div className="flex flex-col">
                <p className="text-font text-title">
                  {item.fromUserName} has requested to join {item.forumName}
                </p>
                <p className="text-font-light/80 text-small">
                  {formatDistanceToNow(Number(item.date), { addSuffix: true })}
                </p>
              </div>
            </div>
          </>
        )}
        {item.type === 'promote_to_moderator' && (
          <>
            <div className="flex gap-8">
              <img
                src={item.fromUserProfilePicLink}
                className="h-25 w-25 cursor-pointer rounded-full object-cover object-center"
                alt={`${item.fromUserName}'s profile`}
              />

              <div className="flex flex-col">
                <p className="text-font text-title">
                  {item.fromUserName} has requested you to be moderator for {item.forumName}
                </p>
                <p className="text-font-light/80 text-small">
                  {formatDistanceToNow(Number(item.date), { addSuffix: true })}
                </p>
              </div>
            </div>
          </>
        )}
        <div className="flex justify-end space-x-6">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-gray-800 px-8 py-3 text-lg text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={async () => {
              await onAccept();
              onClose();
            }}
            className="cursor-pointer rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShowNotificationPopUp;
