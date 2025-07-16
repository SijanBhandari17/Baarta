import { useState } from 'react';
import { X } from 'lucide-react';

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

export default CreateForum;
