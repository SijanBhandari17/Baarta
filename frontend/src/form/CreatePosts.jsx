import { useState } from 'react';
import { X } from 'lucide-react';

function CreatePost({ forumId, isOpen, onClose, addNewPost }) {
  const [postName, setPostName] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [timePost, setTimePosted] = useState('');
  const [postAuthor, setPostAuthor] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const title = data.get('post-name');
    const content_text = data.get('post-description');
    const genre = 'Event';
    addNewPost({ title, forumId, content_text, genre });
    setPostName('');
    setPostDescription('');
    form.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <form
        className="create-post-form bg-layout-elements relative mx-4 w-full max-w-[900px] rounded-2xl bg-gray-900 p-12 shadow-2xl"
        onSubmit={handleSubmit}
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">Create New text</h2>
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
            <label htmlFor="post-name" className="mb-2 block text-lg font-semibold text-white">
              Post Name
            </label>
            <input
              id="post-name"
              name="post-name"
              type="text"
              value={postName}
              onChange={e => setPostName(e.target.value)}
              placeholder="Enter post name"
              className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white placeholder-gray-400 focus:border-blue-600 focus:outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="post-description"
              className="mb-2 block text-lg font-semibold text-white"
            >
              Post Description
            </label>
            <textarea
              id="post-description"
              name="post-description"
              value={postDescription}
              onChange={e => setPostDescription(e.target.value)}
              placeholder="Enter post description"
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
            Create post
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
