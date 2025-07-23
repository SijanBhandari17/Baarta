import { useParams, useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Eye, MessageCircle, Users, Clock, SendHorizonal } from 'lucide-react';
import { sidebarInfo, commentsBySlug, postsBySlug } from '../utils/threadExtras';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { format } from 'date-fns';

export default function PostContent() {
  const { forumTitle, postId } = useParams();

  const decodedForum = decodeURIComponent(forumTitle || '');
  const decodedPostId = decodeURIComponent(postId || '');

  const { forumId, posts } = useOutletContext() || {};

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  const postToShow = posts.find(item => item._id === decodedPostId);
  console.log(postToShow);

  useEffect(() => {
    if (postToShow) {
      setPost(postToShow);
      // setComments(commentData || []);
    } else {
      setPost({
        id: '0',
        title: 'Post Not Found',
        authorName: 'System',
        createdAt: new Date().toISOString(),
        body: '<p>This post could not be found.</p>',
        views: 0,
      });

      setComments([]);
    }
  }, [decodedPostId]);

  const extraForum = sidebarInfo[decodedForum] || {
    memberCount: 0,
    onlineCount: 0,
    rules: [],
    tags: [],
  };

  const handleAddComment = e => {
    e.preventDefault();
    const body = e.target.elements.comment.value.trim();
    if (!body) return;

    const roles = ['Student', 'Professor'];
    const newComment = {
      id: crypto.randomUUID(),
      authorName: 'Anonymous',
      role: roles[Math.floor(Math.random() * roles.length)],
      avatarUrl: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70) + 1}`,
      body,
      createdAt: new Date().toISOString(),
    };

    setComments(prev => [newComment, ...prev]);
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
          <h1 className="text-font mb-2 text-[26px] font-bold">{postToShow.title}</h1>
          {/* Post Metadata */}
          <div className="text-font-light/80 mb-4 flex flex-wrap items-center gap-3 text-sm">
            <span>👤 {postToShow.authorName}</span>
            <span className="flex items-center gap-2">
              <Clock size={14} className="inline-block" /> {console.log(postToShow?.post_date)}
              {format(new Number(postToShow?.post_date), 'yyyy-MM-dd HH:mm:ss')}
            </span>
          </div>

          {/* Post Body */}
          <div className="text-font text-body mb-6 leading-relaxed">{postToShow.content.text}</div>

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
            {/* <div className="text-font-light/80 text-sm">Best ▾</div> */}
          </div>

          <form
            onSubmit={handleAddComment}
            className="bg-layout-elements-focus rounded-button-round border-layout-elements-focus border p-4"
          >
            <textarea
              name="comment"
              rows="4"
              placeholder="Share your thoughts..."
              className="bg-main-elements rounded-button-round border-layout-elements-focus w-full border p-4 text-white focus:ring-2 focus:ring-[#4169E1]"
              required
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                className="rounded-button-round flex items-center gap-2 bg-[#4169E1] px-5 py-2 text-white hover:bg-[#255FCC]"
              >
                <SendHorizonal size={16} /> Comment
              </button>
            </div>
          </form>

          <ul className="space-y-4">
            {comments.length > 0 ? (
              comments.map(c => (
                <li
                  key={c.id}
                  className="bg-layout-elements-focus border-layout-elements-focus rounded-button-round border p-4"
                >
                  <div className="mb-2 flex items-start gap-4">
                    <img
                      src={c.avatarUrl}
                      alt={c.authorName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <div>
                          <span className="text-font font-semibold">{c.authorName}</span>
                          {c.role && (
                            <span className="ml-2 rounded-full bg-[#4169E1] px-2 py-0.5 text-xs tracking-wide text-white uppercase">
                              {c.role}
                            </span>
                          )}
                        </div>
                        <span className="text-font-light/80 text-xs">{}</span>
                      </div>
                      <p className="text-font-light/80 text-base">{c.body}</p>
                    </div>
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
