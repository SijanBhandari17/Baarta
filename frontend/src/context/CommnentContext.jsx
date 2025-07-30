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
        return data;
      } else {
        console.error('Failed to fetch comments:', data.error);
      }
    } catch (err) {
      console.error(`Err: ${err.message}`);
    }
  };

  const addReply = (comments, commentId, replyResponse) => {
    return comments.map(comment => {
      if (comment._id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), replyResponse],
        };
      } else {
        return {
          ...comment,
          replies: [...addReply(comment.replies, commentId, replyResponse)],
        };
      }
    });
  };

  const updateReply = (comments, updatedText, commentId) => {
    return comments.map(comment => {
      if (comment._id === commentId) {
        return {
          ...comment,
          text: updatedText,
        };
      } else if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateReply(comment.replies, updatedText, commentId),
        };
      } else {
        return comment;
      }
    });
  };
  const deleteReply = (comments, commentId) => {
    return comments
      .filter(comment => comment._id !== commentId)
      .map(comment => {
        return {
          ...comment,
          replies: comment.replies ? deleteReply(comment.replies, commentId) : [],
        };
      });
  };

  const addCommentInContext = ({ commentId, replyResponse }) => {
    setComments(prev => addReply(prev, commentId, replyResponse));
  };

  const addRootCommentInContext = commentData => {
    setComments(prev => [commentData, ...prev]);
  };

  const updateCommentInContext = ({ updatedComment, commentId }) => {
    setComments(prev => updateReply(prev, updatedComment, commentId));
  };

  const deleteCommentInContext = commentIdToDelete => {
    setComments(prev => deleteReply(prev, commentIdToDelete));
  };

  return (
    <CommentContext.Provider
      value={{
        comments,
        loading,
        addRootCommentInContext,
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
