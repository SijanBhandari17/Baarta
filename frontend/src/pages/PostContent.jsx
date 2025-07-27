import { useParams } from 'react-router-dom';
import CreateComment from '../form/CreateComment';
import { useState, useEffect, useMemo } from 'react';
import { Eye, MessageCircle, Users, Clock, SendHorizonal, MoreHorizontal } from 'lucide-react';
import { MoreVertical } from 'lucide-react';
import { sidebarInfo, commentsBySlug, postsBySlug } from '../utils/threadExtras';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { format } from 'date-fns';
import EditOptionsPost from '../components/ui/EditOptionsPosts';
import EditOptionsComment from '../components/ui/EditOptionsComments';
import { usePost } from '../context/PostContext';
import { useComment } from '../context/CommnentContext';
import { formatDistanceToNow } from 'date-fns';

export default function PostContent() {
  const { postId } = useParams();
  const decodedPostId = decodeURIComponent(postId || '');
  const { posts } = usePost();
  const { addCommentInContext, comments, loading } = useComment();
  const [isEditOptionsOpen, setIsEditOptionsOpen] = useState(false);
  const [textArea, setTextArea] = useState('');
  const { deleteCommentInContext } = useComment();
  const [editing, setEditing] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState(null);

  const toggleEditOptionsForComment = commentId => {
    setActiveCommentId(prevId => (prevId === commentId ? null : commentId));
  };

  const handleEditComment = (comment, commentId) => {
    setEditing(commentId);
    deleteCommentInContext(commentId);
    setTextArea(comment);
    setActiveCommentId(null);
  };
  const postToShow = useMemo(() => posts.find(item => item._id === decodedPostId));

  const handleUpdateComment = async e => {
    const formData = new FormData(e.target);
    const comment = formData.get('comment');

    try {
      const response = await fetch('http://localhost:5000/comment', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId: editing, text: comment }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data);
        addCommentInContext(data.body);
        setEditing(null);
        setTextArea('');
      } else {
        console.error('Upload failed:', data.error);
      }
    } catch (err) {
      console.log(`Err: ${err}`);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (editing) {
      handleUpdateComment(e);
    } else {
      handleAddComment(e);
    }
  };

  const handleAddComment = async e => {
    const formData = new FormData(e.target);
    const comment = formData.get('comment');
    console.log(comment);

    try {
      const response = await fetch('http://localhost:5000/comment', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, comment }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data);
        addCommentInContext(data.body[0]);
        setTextArea('');
      } else {
        console.error('Upload failed:', data.error);
      }
    } catch (err) {
      console.log(`Err: ${err}`);
    }

    e.target.reset();
  };

  if (!postToShow) return <LoadingSpinner />;

  return (
    <div className="text-font-light/80 flex w-full flex-col gap-10 lg:flex-row">
      {/* Main Content */}
      <main className="flex-1 space-y-8">
        <article className="bg-layout-elements-focus rounded-button-round border-layout-elements-focus border p-6">
          {/* Post Badge */}
          <div className="mb-4">
            <span className="rounded-full bg-[#4169E1] px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase">
              {postToShow.genre}
            </span>
          </div>
          <div className="flex justify-between">
            <h1 className="text-font mb-2 text-[26px] font-bold">{postToShow.title}</h1>
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditOptionsOpen(prev => !prev)}
                className="hover:bg-layout-elements-focus cursor-pointer rounded p-2 text-white"
              >
                <MoreVertical />
              </button>
              {isEditOptionsOpen && (
                <EditOptionsPost
                  post={postToShow}
                  isOpen={isEditOptionsOpen}
                  onClose={() => setIsEditOptionsOpen(false)}
                />
              )}
            </div>
          </div>
          {/* Post Metadata */}
          <div className="text-font-light/80 mb-4 flex flex-wrap items-center gap-3 text-sm">
            <span>👤 {postToShow.authorName}</span>
            <span className="flex items-center gap-2">
              <Clock size={14} className="inline-block" />
              {format(new Number(postToShow?.post_date), 'yyyy-MM-dd HH:mm:ss')}
            </span>
          </div>

          {/* Post Body */}
          <div className="text-font text-body mb-6">{postToShow.content.text}</div>

          {postToShow.content.image && (
            <div className="mb-6">
              <img
                src={postToShow.content.image}
                alt={postToShow.title}
                className="h-48 rounded-lg object-cover"
              />
            </div>
          )}
          {/* Post Stats */}
          <div className="text-font-light/80 border-layout-elements-focus mt-6 flex flex-wrap items-center gap-4 border-t pt-4 text-sm">
            <span className="flex items-center gap-2">
              <Eye size={16} /> {postToShow.views} views
            </span>
            <span className="flex items-center gap-2">
              <MessageCircle size={16} /> {comments.length} comments
            </span>
          </div>
        </article>

        {/* Comments Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-font text-xl font-semibold">Comments ({comments.length})</h2>
          </div>
          <CreateComment
            showCancel={true}
            setTextArea={setTextArea}
            isEditing={editing}
            textArea={textArea}
            handleSubmit={handleSubmit}
          />
          {loading ? (
            <p>No comments yet.</p>
          ) : (
            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map(c => (
                  <Comment
                    key={c._id}
                    activeCommentId={activeCommentId}
                    handleEditComment={handleEditComment}
                    comment={c}
                    toggleEditOptionsForComment={toggleEditOptionsForComment}
                  />
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
function Comment({ comment, handleEditComment, activeCommentId, toggleEditOptionsForComment }) {
  const [replyText, setReplyText] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const handleReplySubmit = async () => {
    if (replyText.trim()) {
      console.log('Reply text:', replyText);
      console.log('Parent comment ID:', comment._id);

      try {
        const response = await fetch('http://localhost:5000/reply', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reply: replyText, commentId: comment._id }),
        });

        const data = await response.json();
        console.log('Response status:', response.status);
        console.log('Response data:', data);

        if (response.ok) {
          console.log(data);
        } else {
          console.error('Upload failed:', data.error);
        }
      } catch (err) {
        console.log(`Err: ${err}`);
      }
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  const handleReplyCancel = () => {
    setReplyText('');
    setShowReplyInput(false);
  };

  return (
    <div className="bg-layout-elements-focus border-layout-elements-focus rounded-button-round border p-4">
      <div className="mb-2 flex items-start gap-4">
        <img
          src={comment?.authorProfilePicLink}
          alt={comment?.authorName}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-font font-semibold">{comment.authorName}</span>
              {comment.role && (
                <span className="rounded-full bg-[#4169E1] px-2 py-0.5 text-xs tracking-wide text-white uppercase">
                  {comment.role}
                </span>
              )}
            </div>
            <span className="text-font-light/80 text-xs">
              {formatDistanceToNow(Number(comment.date), { addSuffix: true })}
            </span>
          </div>
          <p className="text-font-light/80 text-base">{comment.text}</p>

          <div className="mt-2 flex gap-4">
            {console.log(comment.replies)}
            {comment.replies && comment.replies.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-font-light/60 hover:text-font-light cursor-pointer text-sm font-medium transition-colors"
              >
                {showReplies
                  ? `Hide ${comment.replies?.length === 1 ? 'Reply' : 'Replies'} (${comment.replies?.length})`
                  : `Show ${comment.replies?.length === 1 ? 'Reply' : 'Replies'} (${comment.replies?.length})`}
              </button>
            )}
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-font-light/60 hover:text-font-light cursor-pointer text-sm font-medium transition-colors"
            >
              Reply
            </button>
          </div>

          {showReplyInput && (
            <CreateComment onShowCancelClick={() => setShowReplyInput(!showReplyInput)} />
          )}
        </div>

        <button
          onClick={() => toggleEditOptionsForComment(comment._id)}
          className="hover:bg-layout-elements-focus cursor-pointer rounded p-2 text-white"
        >
          <MoreVertical />
        </button>

        {comment._id === activeCommentId && (
          <EditOptionsComment
            isOpen={true}
            comment={comment.text}
            commentId={comment._id}
            onClick={() => handleEditComment(comment.text, comment._id)}
          />
        )}
      </div>
      {showReplies && (
        <div className="border-layout-elements-focus/30 mt-4 ml-8 space-y-4 border-l-2 pl-4">
          {comment?.replies && comment?.replies.length > 0 && (
            <div className="border-layout-elements-focus/30 mt-4 ml-8 space-y-4 border-l-2 pl-4">
              {comment.replies.map(reply => (
                <Comment
                  key={reply._id}
                  comment={reply}
                  handleEditComment={handleEditComment}
                  activeCommentId={activeCommentId}
                  toggleEditOptionsForComment={toggleEditOptionsForComment}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
