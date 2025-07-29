import { useState, createContext, useEffect, useContext } from 'react';
const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchInviteNotifications = async () => {
      try {
        const response = await fetch('http://localhost:5000/notification/getInvite', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok) {
          console.log(data);
          setNotifications(prev => [...prev, data.body]);
        } else {
          console.error('Upload failed:', data.error);
        }
      } catch (err) {
        console.log(`Err: ${err}`);
      }
    };
    const fetchJoinInvitaions = async () => {
      try {
        const response = await fetch('http://localhost:5000/miscallenuous/withForumRequest', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok) {
          setNotifications(prev => [...prev, data.body]);
          console.log(data);
        } else {
          console.error('Upload failed:', data.error);
        }
      } catch (err) {
        console.log(`Err: ${err}`);
      }
    };
    fetchInviteNotifications();
    fetchJoinInvitaions();
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

const useNotification = () => {
  return useContext(NotificationContext);
};

export { NotificationProvider, useNotification };
