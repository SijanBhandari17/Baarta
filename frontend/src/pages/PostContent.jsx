import { useParams, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Eye,
  MessageCircle,
  Users,
  Clock,
  SendHorizonal,
} from "lucide-react";
import {
  sidebarInfo,
  commentsBySlug,
  postsBySlug,
} from "../utils/threadExtras";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function PostContent() {
  const { forumTitle, postTitle } = useParams();
  const decodedForum = decodeURIComponent(forumTitle || "").toLowerCase();
  const decodedSlug = decodeURIComponent(postTitle || "");
  const { forumId } = useOutletContext() || {};

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const postData = postsBySlug[decodedSlug];
    const commentData = commentsBySlug[decodedSlug];

    if (postData) {
      setPost(postData);
      setComments(commentData || []);
    } else {
      setPost({
        id: "0",
        title: "Post Not Found",
        authorName: "System",
        createdAt: new Date().toISOString(),
        body: "<p>This post could not be found.</p>",
        views: 0,
      });
      setComments([]);
    }
  }, [decodedSlug]);

  const extraForum = sidebarInfo[decodedForum] || {
    memberCount: 0,
    onlineCount: 0,
    rules: [],
    tags: [],
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    const body = e.target.elements.comment.value.trim();
    if (!body) return;

    const roles = ["Student", "Professor"];
    const newComment = {
      id: crypto.randomUUID(),
      authorName: "Anonymous",
      role: roles[Math.floor(Math.random() * roles.length)],
      avatarUrl: `https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 70) + 1}`,
      body,
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [newComment, ...prev]);
    e.target.reset();
  };

  if (!post) return <LoadingSpinner />;

  return (
    <div className="flex flex-col lg:flex-row gap-10 w-full text-font-light/80">
      {/* Main Content */}
      <main className="flex-1 space-y-8">
        <article className="bg-layout-elements-focus rounded-button-round p-6 border border-layout-elements-focus">
          {/* Post Badge */}
          <div className="mb-4">
            <span className="bg-[#4169E1] text-white text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
              Research Study
            </span>
          </div>

          <h1 className="text-[26px] font-bold text-font mb-2">{post.title}</h1>

          {/* Post Metadata */}
          <div className="text-sm text-font-light/80 flex items-center gap-3 flex-wrap mb-4">
            <span>👤 {post.authorName}</span>
            <span>
              <Clock size={14} className="inline-block" />{" "}
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>

          {/* Post Body */}
          <div
            className="prose prose-invert max-w-none text-font-light/80"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          {/* Post Stats */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-font-light/80 border-t border-layout-elements-focus pt-4 mt-6">
            <span className="flex items-center gap-2">
              <Eye size={16} /> {post.views.toLocaleString()} views
            </span>
            <span className="flex items-center gap-2">
              <MessageCircle size={16} /> {comments.length} comments
            </span>
          </div>
        </article>

        {/* Comments Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-font">
              Comments ({comments.length})
            </h2>
            <div className="text-sm text-font-light/80">Best ▾</div>
          </div>

          <form
            onSubmit={handleAddComment}
            className="bg-layout-elements-focus p-4 rounded-button-round border border-layout-elements-focus"
          >
            <textarea
              name="comment"
              rows="4"
              placeholder="Share your thoughts..."
              className="w-full bg-main-elements text-white p-4 rounded-button-round border border-layout-elements-focus focus:ring-2 focus:ring-[#4169E1]"
              required
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                className="bg-[#4169E1] text-white px-5 py-2 rounded-button-round hover:bg-[#255FCC] flex items-center gap-2"
              >
                <SendHorizonal size={16} /> Comment
              </button>
            </div>
          </form>

          <ul className="space-y-4">
            {comments.length > 0 ? (
              comments.map((c) => (
                <li
                  key={c.id}
                  className="bg-layout-elements-focus border border-layout-elements-focus rounded-button-round p-4"
                >
                  <div className="flex items-start gap-4 mb-2">
                    <img
                      src={c.avatarUrl}
                      alt={c.authorName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="font-semibold text-font">{c.authorName}</span>
                          {c.role && (
                            <span className="ml-2 text-xs bg-[#4169E1] text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
                              {c.role}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-font-light/80">
                          {new Date(c.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-font-light/80 text-base">{c.body}</p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-center py-8 text-font-light/60">
                No comments yet. Be the first to comment!
              </li>
            )}
          </ul>
        </section>
      </main>

      {/* Sidebar */}
      <aside className="w-full lg:w-80 space-y-6">
        {/* Forum Stats */}
        <div className="bg-layout-elements-focus p-6 rounded-button-round border border-layout-elements-focus">
          <h3 className="text-lg font-semibold mb-3 text-font">Forum Stats</h3>
          <div className="text-sm text-font-light/80 space-y-2">
            <div className="flex items-center gap-2">
              <Users size={16} /> {extraForum.memberCount} members
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} /> {extraForum.onlineCount} online
            </div>
          </div>
        </div>

        {/* Post Status */}
        <div className="bg-layout-elements-focus p-6 rounded-button-round border border-layout-elements-focus">
          <h3 className="text-lg font-semibold mb-3 text-font">Post Status</h3>
          <div className="text-sm text-font-light/80 space-y-2">
            <div className="flex items-center gap-2">
              <Eye size={16} /> {post.views.toLocaleString()} views
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle size={16} /> {comments.length} comments
            </div>
            <div className="flex items-center gap-2">
              <SendHorizonal size={16} /> 14 shares
            </div>
          </div>
        </div>

        {/* Related Topics */}
        <div className="bg-layout-elements-focus p-6 rounded-button-round border border-layout-elements-focus">
          <h3 className="text-lg font-semibold mb-3 text-font">Related Topics</h3>
          <div className="flex flex-wrap gap-2">
            {extraForum.tags.length > 0 ? (
              extraForum.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-[#4169E1] text-white text-xs px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))
            ) : (
              <span className="text-sm text-red-400">No tags found.</span>
            )}
          </div>
        </div>

        {/* Forum Rules */}
        <div className="bg-layout-elements-focus p-6 rounded-button-round border border-layout-elements-focus">
          <h3 className="text-lg font-semibold mb-3 text-font">Forum Rules</h3>
          <ol className="list-decimal list-inside text-sm text-font-light/80 space-y-1">
            {extraForum.rules.length > 0 ? (
              extraForum.rules.map((rule, idx) => <li key={idx}>{rule}</li>)
            ) : (
              <li className="text-sm text-red-400">No rules found.</li>
            )}
          </ol>
        </div>
      </aside>
    </div>
  );
}
