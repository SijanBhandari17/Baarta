import { useState, useMemo, createContext, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForum } from './ForumContext';

const PostContext = createContext();

const PostProvider = ({ children }) => {
  const { forumTitle, postId } = useParams();

  const decodedTitle = decodeURIComponent(forumTitle || '');

  const { forum, loading } = useForum();

  const [moderators, setModerators] = useState([]);
  const [posts, setPosts] = useState([]);
  const [polls, setPolls] = useState([]);

  const forumToShow = useMemo(
    () => forum?.find(item => item.forum_name === decodedTitle),
    [forum, decodedTitle],
  );

  const forumId = forumToShow?._id || '';

  useEffect(() => {
    if (forumId) {
      fetchPosts();
      for (const members of forumToShow.moderator_id) {
        getModerators(members);
      }
      fetchPolls();
    }
  }, [forumId]);

  const fetchPolls = async () => {
    try {
      const response = await fetch(`http://localhost:5000/poll?forumId=${forumId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setPolls(prev => [...prev, ...data.body]);
      }
    } catch (err) {
      console.log(`Err: ${err}`);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/post?forumId=${forumId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setPosts(data.body);
      } else {
        console.error('Failed to fetch posts:', data.error);
      }
    } catch (err) {
      console.error(`Err: ${err.message}`);
    }
  };

  const getModerators = async userId => {
    try {
      const response = await fetch(`http://localhost:5000/all/singleuserprofile?userId=${userId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setModerators(prev => {
          if (prev.some(item => item._id === data.body._id)) return [...prev];
          return [...prev, data.body];
        });
      } else {
        console.error('Upload failed:', data.error);
      }
    } catch (err) {
      console.log(`Err: ${err}`);
    }
  };

  const addPollInContext = poll => {
    setPolls(prev => [poll, ...prev]);
  };

  const deletePollInContext = pollId => {
    setPolls(prev => prev.filter(poll => poll._id !== pollId));
  };

  const updatePollInContext = updatedPoll => {
    setPolls(prev => prev.map(poll => (poll._id === updatedPoll._id ? { ...updatedPoll } : poll)));
  };
  const addPostInContext = postData => {
    setPosts(prev => [postData, ...prev]);
  };

  const updateUsingConsineSimilarity = posts => {
    setPosts(posts);
  };

  const updatePostInContext = updatedPost => {
    setPosts(prev => prev.map(f => (f._id === updatedPost._id ? updatedPost : f)));
  };

  const deletePostInContext = postIdToDelete => {
    setPosts(prev => prev.filter(f => f._id !== postIdToDelete));
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        polls,
        loading,
        moderators,
        forumToShow,
        addPollInContext,
        updateUsingConsineSimilarity,
        deletePostInContext,
        deletePollInContext,
        updatePollInContext,
        addPostInContext,
        updatePostInContext,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

const usePost = () => {
  return useContext(PostContext);
};

export { PostProvider, usePost };
