import Header from '../components/common/Header';
import LeftAsideBar from '../components/common/LeftAsideBar';
import { useParams } from 'react-router-dom';
import forumData from '../utils/fetchForumsData';
import ForumContext from '../context/ForumContext';
import { useContext, useMemo, useState } from 'react';
import forumPosts from '../utils/fetchForumPosts';
import { User, Clock, MessageCircle, Eye, Bookmark } from 'lucide-react';
import CreatePost from '../form/CreatePosts';

function ForumHomePage() {
  const { forumTitle } = useParams();
  const decodedTitle = decodeURIComponent(forumTitle || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [x, setUpdated] = useState(0);
  console.log(isDialogOpen);

  const addNewPost = post => {
    if (forum && Object.keys(forum).length !== 0) {
      forumPosts.push(post);
      setUpdated(x => x + 1);
    }
  };

  const handleClick = () => {
    console.log('hi');
    setIsDialogOpen(true);
  };

  const forum = useMemo(() => forumData.find(item => item.title == decodedTitle));

  return (
    <div className="flex h-svh flex-col">
      <Header />
      <main className="flex w-screen flex-1">
        <LeftAsideBar />
        <section className="bg-main-elements flex flex-1 flex-col gap-6 p-6">
          <ForumContext.Provider value={forum}>
            <ForumHeader handleClick={handleClick} />
            <ForumPosts />
            <ForumLeftBar />
            <CreatePost
              isOpen={isDialogOpen}
              addNewPost={addNewPost}
              onClose={() => setIsDialogOpen(false)}
            />
          </ForumContext.Provider>
        </section>
      </main>
    </div>
  );
}

function ForumHeader({ handleClick }) {
  const forum = useContext(ForumContext);

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-font text-hero my-2 font-semibold">{forum.title}</p>
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

function ForumPosts() {
  return (
    <div className="flex flex-col gap-4">
      {forumPosts.map((item, index) => (
        <div
          key={index}
          className="bg-layout-elements-focus rounded-button-round relative flex flex-col gap-2 p-3"
        >
          <Bookmark className="absolute right-4 cursor-pointer text-white" />
          <p className="text-title text-font mb-2 font-semibold">{item.title}</p>
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
  );
}

function ForumLeftBar() {}

export default ForumHomePage;
