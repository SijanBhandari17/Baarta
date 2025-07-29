import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import ShowNotificationPopUp from '../ui/ShowNotificationPopUp';
import { useNotification } from '../../context/NotificationContext';

function Notification() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const { notifications } = useNotification();

  const handleNotificationClick = item => {
    setSelectedItem(item);
    setShowPopUp(true);
  };

  const handleClosePopUp = () => {
    setShowPopUp(false);
    setSelectedItem(null);
  };

  return (
    <div className="rounded-button-round notification-section absolute top-20 right-5 z-10 flex max-h-[50vh] w-[500px] flex-col bg-gray-600 p-4">
      <div className="border-b border-b-white/10 px-4 py-2">
        <h1 className="text-font text-title font-bold uppercase">Notifications</h1>
      </div>
      <div className="flex flex-col justify-evenly overflow-y-auto">
        {notifications.length !== 0 &&
          notifications.map(item => {
            if (item.type === 'forum_invite') {
              return (
                <div
                  key={item._id}
                  onClick={() => handleNotificationClick(item)}
                  className="rounded-button-round my-2 flex cursor-pointer flex-col gap-2 px-4 py-2 hover:bg-gray-500"
                >
                  <p className="text-font text-title">
                    {item.senderName} has invited you to join {item.forumName}
                  </p>
                  <p className="text-font-light/80 text-body">
                    {formatDistanceToNow(Number(item.date), { addSuffix: true })}
                  </p>
                </div>
              );
            } else if (item.type === 'promotion_to_moderator') {
              return (
                <div
                  key={item._id}
                  onClick={() => handleNotificationClick(item)}
                  className="rounded-button-round my-2 flex cursor-pointer flex-col gap-2 px-4 py-2 hover:bg-gray-500"
                >
                  <p className="text-font text-title">
                    {item.senderName} has requested you to become moderator for {item.forumName}
                  </p>
                  <p className="text-font-light/80 text-body">
                    {formatDistanceToNow(Number(item.date), { addSuffix: true })}
                  </p>
                </div>
              );
            }
            return null;
          })}
      </div>
      {showPopUp && selectedItem && (
        <ShowNotificationPopUp item={selectedItem} onClose={handleClosePopUp} />
      )}
    </div>
  );
}
export default Notification;
