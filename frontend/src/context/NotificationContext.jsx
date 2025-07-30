import { useState, createContext, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [inviteRes, joinRes] = await Promise.all([
          fetch('http://localhost:5000/notification/getInvite', {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          }),
          fetch('http://localhost:5000/miscallenuous/withForumRequest', {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          }),
        ]);

        const inviteData = await inviteRes.json();
        const joinData = await joinRes.json();

        if (inviteRes.ok && joinRes.ok) {
          const merged = [...inviteData.body, ...joinData.body];
          setNotifications(merged);
        } else {
          if (!inviteRes.ok) console.error('Invite fetch failed:', inviteData.error);
          if (!joinRes.ok) console.error('Join fetch failed:', joinData.error);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    if (user) fetchNotifications();
  }, [user]);

  const updateNotificationInContext = notificationId => {
    setNotifications(prev => prev.filter(item => item._id !== notificationId));
  };

  return (
    <NotificationContext.Provider value={{ notifications, updateNotificationInContext }}>
      {children}
    </NotificationContext.Provider>
  );
};

const useNotification = () => {
  return useContext(NotificationContext);
};

export { NotificationProvider, useNotification };
