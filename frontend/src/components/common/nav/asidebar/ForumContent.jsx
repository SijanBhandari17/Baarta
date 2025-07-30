import { SquarePen, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateForum from '../../../../form/CreateForum';
import { useForum } from '../../../../context/ForumContext';
import LoadingSpinner from '../../LoadingSpinner';
import NewForums from '../../../ui/NewForums';

function ForumContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isShowNewForumsOpen, setIsShowNewForumsOpen] = useState(false);
  const { forum, addForum, loading } = useForum();

  const addNewForum = async forumData => {
    if (forumData && Object.keys(forumData).length !== 0) {
      try {
        const response = await fetch('http://localhost:5000/forum', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(forumData),
        });
        const data = await response.json();

        if (response.ok) {
          addForum(data.body);
        }
      } catch (err) {
        console.log('error:', err);
      }
    }
  };
  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-main-elements flex w-[70%] flex-col gap-4 p-6">
      <div className="flex items-center">
        <p className="text-font mr-auto text-3xl font-semibold">My Forums</p>
        <button
          onClick={() => setIsShowNewForumsOpen(true)}
          className="text-font rounded-button-round text-body cursor-pointer bg-[#4169E1] px-3 py-2 text-2xl hover:bg-[#255FCC]"
        >
          Join New Forum
        </button>
        <SquarePen
          onClick={() => setIsDialogOpen(true)}
          className="hover:bg-layout-elements-focus rounded-button-round ml-4 h-full w-8 cursor-pointer text-white"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {forum?.map(item => {
          return (
            <IndividualFourmComponent
              title={item.forum_name}
              category={item.genre}
              participants={item.member_id.length + item.moderator_id.length + 1}
              key={item._id}
            />
          );
        })}
      </div>
      <CreateForum
        type="Create"
        isOpen={isDialogOpen}
        addNewForum={addNewForum}
        onClose={() => setIsDialogOpen(false)}
      />
      {isShowNewForumsOpen && <NewForums onClose={() => setIsShowNewForumsOpen(false)} />}
    </div>
  );
}

function IndividualFourmComponent({ activeUser, title, category, participants }) {
  const navigate = useNavigate();

  const handleEnterForum = () => {
    navigate(`/b/${encodeURIComponent(title)}`);
  };

  return (
    <div className="bg-layout-elements-focus rounded-button-round flex flex-col gap-2 p-6">
      <p className="text-title text-font mb-2 font-semibold">{title}</p>
      <p className="text-font rounded-button-round inline-block w-fit bg-[#5a5a5a] p-1">
        {category}
      </p>
      {participants ? <p className="text-font-light/80">{participants || 0} participants</p> : ''}
      <button
        className="text-font rounded-button-round text-body cursor-pointer bg-[#5a5a5a] p-2 text-center font-semibold transition-colors hover:bg-[#6a6a6a]"
        onClick={handleEnterForum}
      >
        Enter Forum
      </button>
    </div>
  );
}

export default ForumContent;
