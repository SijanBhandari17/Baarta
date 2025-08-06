import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { CiBookmark } from 'react-icons/ci';
import { MdOutlineBookmark } from 'react-icons/md';
import { User, Clock, MessageCircle, MessageSquare } from 'lucide-react';

function IndividualPosts({ post, showSavedIcon, deleteSavedPosts }) {
  const [savedPost, setSavedPost] = useState(false);

  const navigate = useNavigate();

  const handlePostClick = item => {
    navigate(`${item._id}`, {
      state: { postToShow: post },
    });
  };

  const toggleSave = async (e, postId) => {
    e.stopPropagation();
    setSavedPost(prev => !prev);
    if (deleteSavedPosts) return deleteSavedPosts(postId);
    try {
      const response = await fetch('http://localhost:5000/save', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log(data);
      } else {
        console.error('Upload failed:', data.error);
      }
    } catch (err) {
      console.log(`Err: ${err}`);
    }
  };

  return (
    <div className="bg-layout-elements-focus rounded-button-round p-3">
      <div
        onClick={() => handlePostClick(post)}
        className="relative mb-2 flex cursor-pointer items-start justify-between"
      >
        <p className="text-title text-font font-semibold">{post.title}</p>
        <button onClick={e => toggleSave(e, post._id)} className="h-10 w-10 cursor-pointer">
          {savedPost || showSavedIcon ? (
            <MdOutlineBookmark className="ml-2 h-full w-full flex-shrink-0 cursor-pointer text-white" />
          ) : (
            <CiBookmark className="ml-2 h-full w-full flex-shrink-0 cursor-pointer text-white" />
          )}
        </button>
      </div>
      <div className="flex gap-4">
        <div className="flex items-center gap-1">
          <User className="text-font-light/80 h-4 w-4" />
          <p className="text-font-light/80">{post.authorName}</p>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="text-font-light/80 h-4 w-4" />
          <p className="text-font-light/80">
            {formatDistanceToNow(Number(post.post_date), { addSuffix: true })}
          </p>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex items-center gap-1">
          <MessageCircle className="text-font-light/80 h-4 w-4" />
          <p className="text-font-light/80">{post.comment_id.length || 0} comments</p>
        </div>
      </div>
    </div>
  );
}
export default IndividualPosts;
