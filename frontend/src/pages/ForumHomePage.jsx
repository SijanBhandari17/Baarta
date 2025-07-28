import Header from '../components/common/Header';
import LeftAsideBar from '../components/common/LeftAsideBar';
import { MoreVertical, UserPlus } from 'lucide-react';
import { useParams, useOutletContext, Outlet, useNavigate } from 'react-router-dom';
import { useForum } from '../context/ForumContext';
import { useEffect, useMemo, useState } from 'react';
import {
  User,
  Users,
  Clock,
  MessageSquare,
  MessageCircle,
  Calendar,
  Eye,
  Bookmark,
} from 'lucide-react';
import CreatePost from '../form/CreatePosts';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EditOptions from '../components/ui/EditOptions';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { usePost } from '../context/PostContext';
import InvitePeople from '../components/ui/InvitePeople';

function ForumHomePage() {
  const { forumTitle } = useParams();
  const decodedTitle = decodeURIComponent(forumTitle || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { forum, loading } = useForum();
  const { posts, forumToShow, addPostInContext } = usePost();

  const forumId = forumToShow?._id || '';

  const addNewPost = async post => {
    if (post && Object.keys(post).length !== 0) {
      try {
        const formData = new FormData();
        formData.append('title', post.title);
        formData.append('content_text', post.content_text);
        formData.append('forumId', post.forumId);
        formData.append('genre', post.genre);
        formData.append('authorName', post.authorName);
        console.log(post.authorName);

        if (post.postImage && post.postImage.length > 0) {
          formData.append('postImage', post.postImage[0]);
        }

        const response = await fetch('http://localhost:5000/post', {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          console.log(data);
          addPostInContext(data.body[0]);
        } else {
          console.error('Upload failed:', data.error);
        }
      } catch (err) {
        console.log(`Err: ${err}`);
      }
    }
  };

  const handleClick = () => {
    setIsDialogOpen(true);
  };

  if (!forumToShow) return <LoadingSpinner />;

  return (
    <div className="flex h-svh flex-col">
      <Header />
      <main className="flex w-screen flex-1">
        <LeftAsideBar />
        <section className="bg-main-elements flex flex-1 flex-col gap-6 p-6">
          <div className="flex flex-col gap-2">
            <ForumHeader forum={forumToShow} handleClick={handleClick} />

            <div className="flex gap-4">
              <Outlet
                context={{
                  forum: forumToShow,
                  posts,
                  forumId,
                  addNewPost,
                  isDialogOpen,
                  setIsDialogOpen,
                }}
              />
            </div>
            <CreatePost
              type="Create"
              posts={posts}
              forumId={forumId}
              isOpen={isDialogOpen}
              addNewPost={addNewPost}
              onClose={() => setIsDialogOpen(false)}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
function ForumDefault() {
  const { forum, posts } = useOutletContext();
  return (
    <>
      <ForumPosts forum={forum} posts={posts} />
      <ForumLeftBar forum={forum} posts={posts} />
    </>
  );
}

function ForumHeader({ forum, handleClick }) {
  const [isEditOptionsOpen, setIsEditOptionsOpen] = useState(false);
  const [isInvitePeopleOpen, setIsInvitePeopleOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-font text-hero my-2 font-semibold">{forum.forum_name}</p>
        <p className="text-font text-body">{forum.description_text}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleClick}
          className="text-font rounded-button-round text-body cursor-pointer bg-[#4169E1] px-3 py-2 text-2xl font-semibold hover:bg-[#255FCC]"
        >
          Create Thread
        </button>
        <button className="rounded-button-round hover:text-font text-body cursor-pointer border border-[#255FCC] px-3 py-2 text-2xl font-semibold text-[#255FCC] transition-all duration-300 ease-in-out hover:bg-[#255FCC]">
          Join Forum
        </button>
        <button
          className="hover:bg-layout-elements-focus cursor-pointer rounded p-2 text-white"
          onClick={() => setIsInvitePeopleOpen(prev => !prev)}
        >
          <UserPlus />
        </button>
        <div className="flex justify-end">
          <button
            onClick={() => setIsEditOptionsOpen(prev => !prev)}
            className="hover:bg-layout-elements-focus cursor-pointer rounded p-2 text-white"
          >
            <MoreVertical />
          </button>
          {isEditOptionsOpen && (
            <EditOptions
              isOpen={isEditOptionsOpen}
              forum={forum}
              onClose={() => setIsEditOptionsOpen(false)}
            />
          )}
          {isInvitePeopleOpen && <InvitePeople onClose={() => setIsInvitePeopleOpen(false)} />}
        </div>
      </div>
    </div>
  );
}

function ForumPosts({ posts }) {
  const navigate = useNavigate();

  const handlePostClick = item => {
    navigate(`${item._id}`);
  };
  return (
    <>
      {posts && posts.length > 0 ? (
        <div className="flex flex-1 flex-col gap-4">
          {posts.map((item, index) => (
            <div key={index} className="bg-layout-elements-focus rounded-button-round p-3">
              <div
                onClick={() => handlePostClick(item)}
                className="mb-2 flex cursor-pointer items-start justify-between"
              >
                <p className="text-title text-font font-semibold">{item.title}</p>
                <Bookmark className="ml-2 flex-shrink-0 cursor-pointer text-white" />
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <User className="text-font-light/80 h-4 w-4" />
                  <p className="text-font-light/80">{item.authorName}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="text-font-light/80 h-4 w-4" />
                  <p className="text-font-light/80">
                    {formatDistanceToNow(Number(item.post_date), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <MessageCircle className="text-font-light/80 h-4 w-4" />
                  <p className="text-font-light/80">{item.replies || 0} replies</p>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="text-font-light/80 h-4 w-4" />
                  <p className="text-font-light/80">{item.views || 0} views</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-lg text-gray-400">No posts yet</div>
      )}
    </>
  );
}

function ForumLeftBar({ forum, posts }) {
  return (
    <div className="ml-auto flex flex-col gap-2">
      <div className="bg-layout-elements-focus rounded-button-round p-8">
        <h1 className="text-font text-title mb-4 font-semibold">Forum Statistics</h1>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#4169E1]" />
              <p className="text-font-light/80 text-body">Members</p>
            </div>
            <p className="text-font text-body font-semibold">
              {forum.member_id.length + forum.moderator_id.length + 1}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#4169E1]" />
              <p className="text-font-light/80 text-body">Threads</p>
            </div>
            <p className="text-font text-body font-semibold">{posts.length}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#4169E1]" />
              <p className="text-font-light/80 text-body">Created</p>
            </div>
            <p className="text-font text-body font-semibold">{forum?.created_date}</p>
          </div>
        </div>
      </div>

      <div className="bg-layout-elements-focus rounded-button-round p-8">
        <h1 className="text-font text-title mb-4 font-semibold">Moderators</h1>

        <div className="flex flex-col gap-4">
          {forum.moderator_id.length !== 0 ? (
            <div>
              {forum.moderator_id.map((item, index) => {
                return (
                  <div key={index}>
                    <img
                      src={item.info?.profilePic}
                      className="h-25 w-25 cursor-pointer rounded-full object-cover object-center"
                    />
                    <p>{item.info?.name}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-lg text-gray-400">No Moderators yet </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { ForumDefault, ForumHomePage };
