import forumData from '../../../../utils/fetchForumsData';
import { SquarePen, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateForum from '../../../../form/CreateForum';

function ForumContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [x, setUpdated] = useState(0);

  const addNewForum = forum => {
    if (forum && Object.keys(forum).length !== 0) {
      forumData.push(forum);
      setUpdated(x => x + 1);
    }
  };

  return (
    <div className="bg-main-elements flex w-[70%] flex-col gap-4 p-6">
      <div className="flex items-center">
        <p className="text-font mr-auto text-3xl font-semibold">My Forums</p>
        <button className="text-font rounded-button-round text-body cursor-pointer bg-[#4169E1] px-3 py-2 text-2xl hover:bg-[#255FCC]">
          Join New Forum
        </button>
        <SquarePen
          onClick={() => setIsDialogOpen(true)}
          className="hover:bg-layout-elements-focus rounded-button-round ml-4 h-full w-8 cursor-pointer text-white"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {forumData.map(item => {
          return (
            <IndividualFormComponent
              title={item.title}
              category={item.category}
              participants={item.participants}
              key={item.id}
            />
          );
        })}
      </div>
      <CreateForum
        isOpen={isDialogOpen}
        addNewForum={addNewForum}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}

function IndividualFormComponent({ title, category, participants }) {
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
      <p className="text-font-light/80">{participants || 0} participants</p>
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
