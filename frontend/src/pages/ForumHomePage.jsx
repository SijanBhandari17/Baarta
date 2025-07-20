import Header from '../components/common/Header';
import LeftAsideBar from '../components/common/LeftAsideBar';
import { useParams } from 'react-router-dom';
import { useForum } from '../context/ForumContext';
import { useEffect, useMemo, useState } from 'react';
import { User, Clock, MessageCircle, Eye, Bookmark } from 'lucide-react';
import CreatePost from '../form/CreatePosts';
import LoadingSpinner from '../components/common/LoadingSpinner';

function ForumHomePage() {
  const { forumTitle } = useParams();
  const decodedTitle = decodeURIComponent(forumTitle || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { forum } = useForum();
  const [posts, setPosts] = useState([]);

  const forumToShow = useMemo(
    () => forum?.find(item => item.forum_name === decodedTitle),
    [forum, decodedTitle],
  );

  const forumId = forumToShow?._id || '';

  useEffect(() => {
    if (forumId) fetchPosts();
  }, [forumId]);

  const fetchPosts = async () => {
    if (forumId) {
      try {
        const response = await fetch(`http://localhost:5000/post?forumId=${forumId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
          console.log(data);
          setPosts(data.body);
        }
      } catch (err) {
        console.log(`Err: ${err}`);
      }
    }
  };

  const addNewPost = async post => {
    console.log(post);
    if (post && Object.keys(post).length !== 0) {
      try {
        const response = await fetch('http://localhost:5000/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(post),
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setPosts(prev => [...prev, data.body[0]]);
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
          {forum ? (
            <>
              <ForumHeader forum={forumToShow} handleClick={handleClick} />
              <ForumPosts forum={forumToShow} posts={posts} />
              <ForumLeftBar forum={forumToShow} />
              <CreatePost
                forumId={forumId}
                isOpen={isDialogOpen}
                addNewPost={addNewPost}
                onClose={() => setIsDialogOpen(false)}
              />
            </>
          ) : (
            <LoadingSpinner />
          )}
        </section>
      </main>
    </div>
  );
}

function ForumHeader({ forum, handleClick }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-font text-hero my-2 font-semibold">{forum.forum_name}</p>
        <p className="text-font text-body">{forum.description}</p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleClick}
          className="text-font rounded-button-round text-body cursor-pointer bg-[#4169E1] px-3 py-2 text-2xl font-semibold hover:bg-[#255FCC]"
        >
          Create Thread
        </button>
        <button className="rounded-button-round hover:text-font text-body cursor-pointer border border-[#255FCC] px-3 py-2 text-2xl font-semibold text-[#255FCC] transition-all duration-300 ease-in-out hover:bg-[#255FCC]">
          Join Forum
        </button>
      </div>
    </div>
  );
}

function ForumPosts({ posts }) {
  return (
    <>
      {posts && posts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {posts.map((item, index) => (
            <div key={index} className="bg-layout-elements-focus rounded-button-round p-3">
              <div className="mb-2 flex items-start justify-between">
                <p className="text-title text-font font-semibold">{item.title}</p>
                <Bookmark className="ml-2 flex-shrink-0 cursor-pointer text-white" />
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <User className="text-font-light/80 h-4 w-4" />
                  <p className="text-font-light/80">{item.author}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="text-font-light/80 h-4 w-4" />
                  <p className="text-font-light/80">{item.timePosted || 0}</p>
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

function ForumLeftBar() {}

export default ForumHomePage;
