import { useParams } from 'react-router-dom';
import CreateComment from '../form/CreateComment';
import { useState, useMemo } from 'react';
import { Eye, MessageCircle, Users, Clock, SendHorizonal } from 'lucide-react';
import { MoreVertical } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { format } from 'date-fns';
import EditOptionsPost from '../components/ui/EditOptionsPosts';
import EditOptionsComment from '../components/ui/EditOptionsComments';
import { usePost } from '../context/PostContext';
import { useComment } from '../context/CommnentContext';
import { formatDistanceToNow } from 'date-fns';
import {
  addReplyComment,
  addRootComment,
  deleteComment,
  deleteReply,
  updateComment,
} from '../utils/handleComments';

export default function PostContent() {
  const { postId } = useParams();
  const decodedPostId = decodeURIComponent(postId || '');
  const { posts } = usePost();
  const [isEditOptionsOpen, setIsEditOptionsOpen] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const { addRootCommentInContext, addCommentInContext, comments, loading } = useComment();
  console.log(comments);

  const toggleEditOptionsForComment = commentId => {
    setActiveCommentId(prevId => (prevId === commentId ? null : commentId));
  };
  const postToShow = useMemo(() => posts.find(item => item._id === decodedPostId));

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const comment = formData.get('comment');
    const rootData = await addRootComment({ comment, postId });
    addRootCommentInContext(rootData);

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
              <MessageCircle size={16} /> {comments?.length} comments
            </span>
          </div>
        </article>

        {/* Comments Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-font text-xl font-semibold">Comments ({comments?.length})</h2>
          </div>
          <CreateComment showCancel={true} handleSubmit={handleSubmit} />
          {loading ? (
            <p>No comments yet.</p>
          ) : (
            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map(c => (
                  <Comment
                    key={c._id}
                    activeCommentId={activeCommentId}
                    // handleEditComment={handleEditComment}
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
function Comment({
  comment,
  handleEditComment,
  commentText,
  activeCommentId,
  toggleEditOptionsForComment,
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [editMode, setEditMode] = useState(false); //false == view mode
  const [editText, setEditText] = useState(comment.text);
  const { addCommentInContext, updateCommentInContext, deleteCommentInContext } = useComment();

  const showEditOptions = activeCommentId === comment._id;

  const handleReplyCancel = () => {
    setShowReplyInput(false);
  };

  const handleAddReply = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const replyText = formData.get('comment');
    const replyResponse = await addReplyComment({ commentId: comment._id, reply: replyText });
    setShowReplyInput(false);
    addCommentInContext({ commentId: comment._id, replyResponse });
    console.log(replyResponse);
  };

  const handleEditReply = async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedText = formData.get('comment');
    console.log(updatedText);
    const updateResponse = await updateComment({ commentId: comment._id, text: updatedText });
    setEditMode(false);
    updateCommentInContext({ commentId: comment._id, updatedComment: updatedText });
    console.log(updateResponse);
  };
  const handleDeleteComment = async () => {
    if (comment.parent.kind === 'POST') {
      const deleteResponse = await deleteComment({ commentId: comment._id });
      console.log(deleteResponse);
    } else {
      const deleteResponse = await deleteReply({ replyId: comment._id });
      console.log(deleteResponse);
    }
    deleteCommentInContext(comment._id);
  };

  const startEdit = () => {
    setEditMode(true);
    toggleEditOptionsForComment(null);
  };
  console.log(comment.authorName);

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
              {/* {formatDistanceToNow(Number(comment?.date), { addSuffix: true })} */}
            </span>
          </div>

          {!editMode ? (
            // View Mode
            <>
              <p className="text-font-light/80 text-base">{comment.text}</p>
              <div className="mt-2 flex gap-4">
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
            </>
          ) : (
            // Edit Mode
            <div className="space-y-2">
              <CreateComment
                onShowCancelClick={() => setEditMode(false)}
                editText={editText}
                handleSubmit={handleEditReply}
                setEditText={setEditText}
              />
            </div>
          )}
          {showReplyInput && !editMode && (
            <div className="mt-3">
              <CreateComment handleSubmit={handleAddReply} onShowCancelClick={handleReplyCancel} />
            </div>
          )}
        </div>

        <button
          onClick={() => toggleEditOptionsForComment(comment._id)}
          className="hover:bg-layout-elements-focus cursor-pointer rounded p-2 text-white"
        >
          <MoreVertical />
        </button>

        {showEditOptions && (
          <EditOptionsComment
            isOpen={true}
            comment={comment.text}
            onClick={startEdit}
            onDelete={handleDeleteComment}
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
