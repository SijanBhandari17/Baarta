import { useParams, useOutletContext } from 'react-router-dom';
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
  const { addCommentInContext, updateCommentInContext, comments } = useComment();
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
    console.log(comment);
  };
  const postToShow = useMemo(() => posts.find(item => item._id === decodedPostId));

  const handleUpdateComment = async e => {
    const formData = new FormData(e.target);
    const comment = formData.get('comment');
    const commentId = editing;

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
            setTextArea={setTextArea}
            isEditing={editing}
            textArea={textArea}
            handleSubmit={handleSubmit}
          />
          <ul className="space-y-4">
            {comments.length > 0 ? (
              comments.map(c => (
                <li
                  key={c._id}
                  className="bg-layout-elements-focus border-layout-elements-focus rounded-button-round border p-4"
                >
                  <div className="mb-2 flex items-start gap-4">
                    <img
                      src={c?.authorProfilePicLink}
                      alt={c?.authorName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-font font-semibold">{c.authorName}</span>
                          {c.role && (
                            <span className="rounded-full bg-[#4169E1] px-2 py-0.5 text-xs tracking-wide text-white uppercase">
                              {c.role}
                            </span>
                          )}
                        </div>
                        <span className="text-font-light/80 text-xs">
                          {formatDistanceToNow(Number(c.date), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-font-light/80 text-base">{c.text}</p>
                    </div>
                    <button
                      onClick={() => toggleEditOptionsForComment(c._id)}
                      className="hover:bg-layout-elements-focus cursor-pointer rounded p-2 text-white"
                    >
                      <MoreVertical />
                    </button>
                    {c._id === activeCommentId && (
                      <EditOptionsComment
                        isOpen={true}
                        comment={c.text}
                        commentId={c._id}
                        onClick={() => handleEditComment(c.text, c._id)}
                      />
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="text-font-light/60 py-8 text-center">
                No comments yet. Be the first to comment!
              </li>
            )}
          </ul>
        </section>
      </main>

      {/* Sidebar */}
      <aside className="w-full space-y-6 lg:w-80">
        {/* Forum Stats */}
        {/* <div className="bg-layout-elements-focus rounded-button-round border-layout-elements-focus border p-6"> */}
        {/*   <h3 className="text-font mb-3 text-lg font-semibold">Forum Stats</h3> */}
        {/*   <div className="text-font-light/80 space-y-2 text-sm"> */}
        {/*     <div className="flex items-center gap-2"> */}
        {/*       <Users size={16} /> {extraForum.memberCount} members */}
        {/*     </div> */}
        {/*     <div className="flex items-center gap-2"> */}
        {/*       <Clock size={16} /> {extraForum.onlineCount} online */}
        {/*     </div> */}
        {/*   </div> */}
        {/* </div> */}
        {/**/}

        {/* Post Status */}

        <div className="bg-layout-elements-focus rounded-button-round border-layout-elements-focus border p-6">
          <h3 className="text-font mb-3 text-lg font-semibold">Post Status</h3>
          <div className="text-font-light/80 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Eye size={16} /> {postToShow?.views} views
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle size={16} /> {comments.length} comments
            </div>
            {/* <div className="flex items-center gap-2"> */}
            {/*   <SendHorizonal size={16} /> 14 shares */}
            {/* </div> */}
          </div>
        </div>

        {/* Related Topics */}
        {/* <div className="bg-layout-elements-focus rounded-button-round border-layout-elements-focus border p-6"> */}
        {/*   <h3 className="text-font mb-3 text-lg font-semibold">Related Topics</h3> */}
        {/*   <div className="flex flex-wrap gap-2"> */}
        {/*     {extraForum.tags.length > 0 ? ( */}
        {/*       extraForum.tags.map((tag, idx) => ( */}
        {/*         <span key={idx} className="rounded-full bg-[#4169E1] px-2 py-1 text-xs text-white"> */}
        {/*           #{tag} */}
        {/*         </span> */}
        {/*       )) */}
        {/*     ) : ( */}
        {/*       <span className="text-sm text-red-400">No tags found.</span> */}
        {/*     )} */}
        {/*   </div> */}
        {/* </div> */}
        {/**/}

        {/* Forum Rules */}

        {/* <div className="bg-layout-elements-focus rounded-button-round border-layout-elements-focus border p-6"> */}
        {/*   <h3 className="text-font mb-3 text-lg font-semibold">Forum Rules</h3> */}
        {/*   <ol className="text-font-light/80 list-inside list-decimal space-y-1 text-sm"> */}
        {/*     {extraForum.rules.length > 0 ? ( */}
        {/*       extraForum.rules.map((rule, idx) => <li key={idx}>{rule}</li>) */}
        {/*     ) : ( */}
        {/*       <li className="text-sm text-red-400">No rules found.</li> */}
        {/*     )} */}
        {/*   </ol> */}
        {/* </div> */}
      </aside>
    </div>
  );
}
