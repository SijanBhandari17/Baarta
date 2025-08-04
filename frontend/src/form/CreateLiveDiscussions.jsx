import { useState } from 'react';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePost } from '../context/PostContext';

function Creatediscussion({
  discussion,
  updatediscussion,
  forumId,
  isOpen,
  onClose,
  addNewdiscussion,
}) {
  const [discussionName, setdiscussionName] = useState('');
  const [discussionDescription, setdiscussionDescription] = useState('');
  const { user } = useAuth();
  const { forumToShow } = usePost();

  const handleSubmit = async e => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const title = data.get('discussion-name');
    const content_text = data.get('discussion-description');
    const forumId = forumToShow._id;

    try {
      const response = await fetch('http://localhost:5000/discussion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ forumId, title, description: content_text }),
      });
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log('error:', err);
    }

    setdiscussionName('');
    setdiscussionDescription('');
    form.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <form
        className="create-discussion-form bg-layout-elements relative mx-4 w-full max-w-[900px] rounded-2xl p-12 shadow-2xl"
        onSubmit={handleSubmit}
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">Create discussion</h2>
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
            <label
              htmlFor="discussion-name"
              className="mb-2 block text-lg font-semibold text-white"
            >
              Discussion Name
            </label>
            <input
              id="discussion-name"
              name="discussion-name"
              type="text"
              autoComplete="off"
              value={discussionName}
              onChange={e => setdiscussionName(e.target.value)}
              placeholder="Enter discussion name"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-400 focus:border-blue-600 focus:outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="discussion-description"
              className="mb-2 block text-lg font-semibold text-white"
            >
              Discussion Description
            </label>
            <textarea
              id="discussion-description"
              name="discussion-description"
              value={discussionDescription}
              onChange={e => setdiscussionDescription(e.target.value)}
              placeholder="Enter discussion description"
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
            Create discussion
          </button>
        </div>
      </form>
    </div>
  );
}

export default Creatediscussion;
