import { useState, createContext, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
const ForumContext = createContext();

const ForumProvider = ({ children }) => {
  const [forum, setForum] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [allActivePolls, setAllActivePolls] = useState([]);
  useEffect(() => {
    if (user) {
      fetchForums();
      fetchAllActivePolls();
    }
  }, [user]);

  const fetchAllActivePolls = async () => {
    try {
      const response = await fetch('http://localhost:5000/all/poll', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data.body);
      if (response.ok) {
        console.log(data.body);
        setAllActivePolls(data.body);
      }
    } catch (err) {
      console.log(`Err: ${err}`);
    }
  };
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

  const updateAllPollInContext = updatedPoll => {
    setAllActivePolls(prev =>
      prev.map(poll => (poll._id === updatedPoll._id ? { ...updatedPoll } : poll)),
    );
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
      value={{
        allActivePolls,
        forum,
        loading,
        fetchForums,
        deleteForumInContext,
        updateAllPollInContext,
        addForum,
        updateForumInContext,
      }}
    >
      {children}
    </ForumContext.Provider>
  );
};

const useForum = () => {
  return useContext(ForumContext);
};

export { ForumProvider, useForum };
