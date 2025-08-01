import Header from '../components/common/Header';
import LeftAsideBar from '../components/common/LeftAsideBar';
import SearchIcon from '../assets/icons/searchIcon.svg';
import { MoreVertical, UserPlus } from 'lucide-react';
import { useOutletContext, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Users, MessageSquare, Calendar } from 'lucide-react';
import CreatePost from '../form/CreatePosts';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EditOptions from '../components/ui/EditOptions';
import { useAuth } from '../context/AuthContext';
import { usePost } from '../context/PostContext';
import InvitePeople from '../components/ui/InvitePeople';
import CreatePoll from '../components/ui/CreatePoll';
import SinglePoll from '../components/ui/Polls';
import IndividualPosts from '../components/ui/SinglePosts';

function ForumHomePage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { posts, moderators, forumToShow, addPostInContext } = usePost();
  if (!forumToShow) return <LoadingSpinner />;

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
          addPostInContext(data.body);
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

  return (
    <div className="flex h-svh flex-col">
      <Header />
      <main className="flex w-screen flex-1">
        <LeftAsideBar />
        <section className="bg-main-elements flex flex-1 flex-col gap-6 p-6">
          <Outlet
            context={{
              forum: forumToShow,
              posts,
              forumId,
              addNewPost,
              moderators,
              handleClick,
              isDialogOpen,
              setIsDialogOpen,
            }}
          />
          <CreatePost
            type="Create"
            posts={posts}
            forumId={forumId}
            isOpen={isDialogOpen}
            addNewPost={addNewPost}
            onClose={() => setIsDialogOpen(false)}
          />
        </section>
      </main>
    </div>
  );
}
function ForumDefault() {
  const { forum, posts, handleClick, moderators } = useOutletContext();
  return (
    <div className="flex flex-col gap-2">
      <ForumHeader forum={forum} handleClick={handleClick} />
      <div className="flex gap-4">
        <ForumPosts forum={forum} posts={posts} />
        <ForumLeftBar moderators={moderators} forum={forum} posts={posts} />
      </div>
    </div>
  );
}

function ForumHeader({ forum, handleClick }) {
  const [isEditOptionsOpen, setIsEditOptionsOpen] = useState(false);
  const [isInvitePeopleOpen, setIsInvitePeopleOpen] = useState(false);
  const [isCreatePollOpen, setIsCreatePollOpen] = useState(false);
  const { user } = useAuth();
  const { updateUsingConsineSimilarity } = usePost();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const isJoined =
    forum.member_id.includes(user?.info.userId) ||
    forum.admin_id === user?.info.userId ||
    forum.moderator_id.includes(user?.info.userId);

  const hasAdminPrivilage =
    forum.admin_id === user?.info.userId || forum.moderator_id.includes(user?.info.userId);

  const handleChangeSearchBarChange = async e => {
    const value = e.target.value;
    setQuery(value);

    try {
      const res = await fetch('http://localhost:5000/search/post', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          forumId: forum._id,
          searchQuery: value,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log(data);
        updateUsingConsineSimilarity(data.body);
        setSearchResults(data.body);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-font text-hero my-2 font-semibold">{forum.forum_name}</p>
        <p className="text-font text-body">{forum.description_text}</p>
      </div>

      <div className="bg-layout-elements-focus rounded-button-round relative flex h-15 w-[30rem] items-center px-2">
        <img src={SearchIcon} alt="Seach Icon" className="" height="20px" width="20px" />
        <input
          type="text"
          id="search-discussions"
          placeholder="Search Posts.."
          className="rounded-button-round px-2 text-white caret-gray-100 placeholder:text-gray-500 focus:outline-none"
          onChange={handleChangeSearchBarChange}
          value={query}
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleClick}
          className="text-font rounded-button-round text-body cursor-pointer bg-[#4169E1] px-3 py-2 text-2xl font-semibold hover:bg-[#255FCC]"
        >
          Create Thread
        </button>
        {!isJoined && (
          <button className="rounded-button-round hover:text-font text-body cursor-pointer border border-[#255FCC] px-3 py-2 text-2xl font-semibold text-[#255FCC] transition-all duration-300 ease-in-out hover:bg-[#255FCC]">
            Join Forum
          </button>
        )}

        {hasAdminPrivilage && (
          <div className="flex justify-end gap-2">
            <button
              className="text-royalpurple-dark p-button-padding border-royalpurple-dark rounded-button-round hover:bg-royalpurple-dark cursor-pointer border-2 px-6 font-medium transition-all duration-300 ease-in hover:text-gray-50"
              onClick={() => setIsCreatePollOpen(prev => !prev)}
            >
              Create Poll
            </button>
            <button
              className="hover:bg-layout-elements-focus cursor-pointer rounded p-2 text-white"
              onClick={() => setIsInvitePeopleOpen(prev => !prev)}
            >
              <UserPlus />
            </button>
            <button
              onClick={() => setIsEditOptionsOpen(prev => !prev)}
              className="hover:bg-layout-elements-focus cursor-pointer rounded p-2 text-white"
            >
              <MoreVertical />
            </button>
          </div>
        )}
        {isEditOptionsOpen && (
          <EditOptions
            isOpen={isEditOptionsOpen}
            forum={forum}
            onClose={() => setIsEditOptionsOpen(false)}
          />
        )}
        {isInvitePeopleOpen && <InvitePeople onClose={() => setIsInvitePeopleOpen(false)} />}
        {isCreatePollOpen && (
          <CreatePoll type="Create" forum={forum} onClose={() => setIsCreatePollOpen(false)} />
        )}
      </div>
    </div>
  );
}

function ForumPosts({ posts }) {
  return (
    <>
      {posts && posts.length > 0 ? (
        <div className="flex flex-1 flex-col gap-4">
          {posts.map((item, index) => (
            <IndividualPosts key={item._id} post={item} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-lg text-gray-400">No posts yet</div>
      )}
    </>
  );
}

function ForumLeftBar({ forum, moderators, posts }) {
  const { user } = useAuth();

  const hasAdminPrivilage =
    forum.admin_id === user?.info.userId || forum.moderator_id.includes(user?.info.userId);

  const { polls } = usePost();
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
              {moderators.map(item => {
                return (
                  <div
                    key={item._id}
                    className="mb-4 flex items-center gap-8 rounded-lg border border-zinc-700 bg-zinc-800 p-6 text-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                  >
                    <img
                      src={item?.userProfilePicLink}
                      alt={item?.username}
                      className="h-16 w-16 rounded-full border-2 border-gray-200 object-cover shadow-sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-font text-xl font-semibold">{item?.username}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-lg text-gray-400">No Moderators yet </div>
          )}
        </div>
      </div>
      <div className="bg-layout-elements-focus rounded-button-round p-8">
        <h1 className="text-font text-title mb-4 font-semibold">Active Polls</h1>

        <div className="flex flex-col gap-4">
          {polls.map(poll => {
            return <SinglePoll key={poll._id} hasAdminPrivilage={hasAdminPrivilage} poll={poll} />;
          })}
        </div>
      </div>
    </div>
  );
}

export { ForumDefault, ForumHomePage };
