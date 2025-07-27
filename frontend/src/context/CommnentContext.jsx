import { useState, useMemo, createContext, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useParams } from 'react-router-dom';
import { usePost } from './PostContext';
import buildTree from '../utils/buildCommentTree';

const CommentContext = createContext();

const CommentProvider = ({ children }) => {
  const { postId } = useParams();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAndBuildComments = async () => {
      if (!postId) return;

      const comments = await fetchComments(postId);
      if (comments) {
        const nestedComments = await buildTree(comments.body);
        setComments(nestedComments);
        setLoading(false);
        console.log(comments);
      }
    };

    getAndBuildComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:5000/comment?postId=${postId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setComments(data.body);
        return data;
      } else {
        console.error('Failed to fetch comments:', data.error);
      }
    } catch (err) {
      console.error(`Err: ${err.message}`);
    }
  };

  const addCommentInContext = commentData => {
    setComments(prev => [commentData, ...prev]);
  };

  const updateCommentInContext = updatedComment => {
    console.log(updatedComment);
    setComments(prev => prev.map(c => (c._id === updatedComment._id ? updatedComment : c)));
  };

  const deleteCommentInContext = commentIdToDelete => {
    setComments(prev => prev.filter(c => c._id !== commentIdToDelete));
  };

  return (
    <CommentContext.Provider
      value={{
        comments,
        loading,
        addCommentInContext,
        updateCommentInContext,
        deleteCommentInContext,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};

const useComment = () => {
  return useContext(CommentContext);
};

export { CommentProvider, useComment };
