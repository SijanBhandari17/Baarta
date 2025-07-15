import forumData from '../../../../utils/fetchForumsData';
import { SquarePen, X } from 'lucide-react';
import { useState } from 'react';

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
        <button className="text-font text-title rounded-button-round cursor-pointer bg-[#4169E1] px-3 py-2 hover:bg-[#255FCC]">
          Join New Forum
        </button>
        <SquarePen
          onClick={() => setIsDialogOpen(true)}
          className="hover:bg-layout-elements-focus rounded-button-round ml-4 h-full w-8 cursor-pointer text-white"
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {forumData.map((item, index) => {
          return (
            <div
              key={index}
              className="bg-layout-elements-focus rounded-button-round flex flex-col gap-2 p-6"
            >
              <p className="text-title text-font mb-2 font-semibold">{item.title}</p>
              <p className="text-font rounded-button-round inline-block w-fit bg-[#5a5a5a] p-1">
                {item.category}
              </p>
              <p className="text-font-light/80">{item.participants || 0} participants</p>
              <button className="text-font rounded-button-round text-body cursor-pointer bg-[#5a5a5a] p-2 text-center font-semibold transition-colors hover:bg-[#6a6a6a]">
                Enter Forum
              </button>
            </div>
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

function CreateForum({ isOpen, onClose, addNewForum }) {
  const [forumName, setForumName] = useState('');
  const [forumDescription, setForumDescription] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const title = data.get('forum-name');
    const category = 'Computer Engineering';
    const description = data.get('forum-description');
    addNewForum({ title, category, description });
    setForumName('');
    setForumDescription('');
    form.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <form
        className="create-forum-form bg-layout-elements relative mx-4 w-full max-w-[900px] rounded-2xl bg-gray-900 p-12 shadow-2xl"
        onSubmit={handleSubmit}
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">Create New Forum</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-white"
            aria-label="Close"
          >
            <X size={32} className="cursor-pointer" />
          </button>
        </div>
        <div className="space-y-8">
          <div>
            <label htmlFor="forum-name" className="mb-2 block text-lg font-semibold text-white">
              Forum Name
            </label>
            <input
              id="forum-name"
              name="forum-name"
              type="text"
              value={forumName}
              onChange={e => setForumName(e.target.value)}
              placeholder="Enter forum name"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-400 focus:border-blue-600 focus:outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="forum-description"
              className="mb-2 block text-lg font-semibold text-white"
            >
              Forum Description
            </label>
            <textarea
              id="forum-description"
              name="forum-description"
              value={forumDescription}
              onChange={e => setForumDescription(e.target.value)}
              placeholder="Enter forum description"
              className="min-h-[120px] w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-400 focus:border-blue-600 focus:outline-none"
              required
            />
          </div>
        </div>
        <div className="mt-12 flex justify-end space-x-6">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg bg-gray-800 px-8 py-3 text-lg text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Create Forum
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForumContent;
