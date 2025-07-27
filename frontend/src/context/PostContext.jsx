import { useState, useMemo, createContext, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useForum } from './ForumContext';

const PostContext = createContext();

const PostProvider = ({ children }) => {
  const { forumTitle, postId } = useParams();

  const decodedTitle = decodeURIComponent(forumTitle || '');

  const { forum, loading } = useForum();

  const [posts, setPosts] = useState([]);

  const forumToShow = useMemo(
    () => forum?.find(item => item.forum_name === decodedTitle),
    [forum, decodedTitle],
  );

  const forumId = forumToShow?._id || '';

  useEffect(() => {
    if (forumId) fetchPosts();
  }, [forumId]);

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

  const addPostInContext = postData => {
    setPosts(prev => [postData, ...prev]);
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
        forumToShow,
        loading,
        deletePostInContext,
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
