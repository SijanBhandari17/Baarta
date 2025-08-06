import { useState } from 'react';
import { X } from 'lucide-react';
import { useEffect } from 'react';

const genreOptions = ['AI', 'EdTech', 'Research', 'Climate', 'Literature', 'Analysis', 'Quantum'];

function CreateForum({ updateForum, forum, type, isOpen, onClose, addNewForum }) {
  console.log(forum);
  const [forumName, setForumName] = useState('');
  const [forumDescription, setForumDescription] = useState('');
  const [forumGenre, setForumGenre] = useState(null);
  const [forumId, setForumId] = useState(null);
  const selectedGenre = ' text-amber-400';

  useEffect(() => {
    if (forum) {
      setForumName(forum.forum_name || '');
      setForumDescription(forum.description_text || '');
      const selected = genreOptions.indexOf(forum.genre);
      setForumGenre(selected || null);
      setForumId(forum._id);
    }
  }, [forum]);

  const handleSubmit = e => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const forumName = data.get('forum-name');
    const genre = genreOptions[forumGenre];
    const descriptionText = data.get('forum-description');

    if (addNewForum) {
      addNewForum({ forumName, genre, descriptionText });
    } else {
      updateForum({ forumId, forumName, genre, descriptionText });
    }
    setForumName('');
    setForumDescription('');
    form.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <form
        className="create-forum-form bg-layout-elements relative mx-4 w-full max-w-[900px] rounded-2xl p-12 shadow-2xl"
        onSubmit={handleSubmit}
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">{type} Forum</h2>
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
          <div>
            <label htmlFor="forum-genre" className="mb-2 block text-lg font-semibold text-white">
              Select Genre
            </label>
            <div className="text-font flex gap-7 text-lg" id="forum-genre">
              {genreOptions.map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={() => setForumGenre(index)}
                    className={`cursor-pointer rounded-lg bg-gray-800 p-2 ${
                      index === forumGenre ? selectedGenre : ''
                    }`}
                  >
                    <p>{item}</p>
                  </div>
                );
              })}
            </div>
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
            {type} Forum
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateForum;
