import { useState, createContext, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
const ForumContext = createContext();

const ForumProvider = ({ children }) => {
  const [forum, setForum] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchForums();
    }
  }, [user]);

  const fetchForums = async () => {
    try {
      const response = await fetch('http://localhost:5000/forum', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();

      if (response.ok) {
        setForum(data.body);
      }
    } catch (err) {
      console.log(`error:${err} `);
    } finally {
      setLoading(false);
    }
  };

  const addForum = forumData => {
    setForum(prev => [...prev, forumData]);
  };

  const updateForumInContext = updatedForum => {
    setForum(prev => prev.map(f => (f._id === updatedForum._id ? updatedForum : f)));
  };

  const deleteForumInContext = formIdToDelete => {
    setForum(prev => prev.filter(f => f._id !== formIdToDelete));
  };

  return (
    <ForumContext.Provider
      value={{ forum, loading, deleteForumInContext, addForum, updateForumInContext }}
    >
      {children}
    </ForumContext.Provider>
  );
};

const useForum = () => {
  return useContext(ForumContext);
};

export { ForumProvider, useForum };
