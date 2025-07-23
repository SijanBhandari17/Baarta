import { useState } from 'react';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function CreatePost({ type, value, updatePost, forumId, isOpen, onClose, addNewPost }) {
  const [postName, setPostName] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postGenre, setPostGenre] = useState(null);
  const [postImage, setPostImage] = useState(null);
  const [postId, setPostId] = useState(null);
  const selectedGenre = ' text-amber-400';
  const { user } = useAuth();
  console.log(user);

  const genreOptions = ['Question', 'Announcement', 'Event'];

  useEffect(() => {
    if (value) {
      setPostName(value.forum_name || '');
      setPostDescription(value.description_text || '');
      const selected = genreOptions.indexOf(value.genre);
      setPostGenre(selected || null);
      setPostId(value._id);
    }
  }, [value]);

  const handleSubmit = e => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const title = data.get('post-name');
    const content_text = data.get('post-description');
    const genre = genreOptions[postGenre];
    const authorName = user.info?.username;

    if (addNewPost) {
      addNewPost({ title, forumId, authorName, content_text, genre });
    } else {
      updatePost({ title, forumId, authorName, content_text, genre });
    }

    setPostName('');
    setPostDescription('');
    form.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <form
        className="create-post-form bg-layout-elements relative mx-4 w-full max-w-[900px] rounded-2xl p-12 shadow-2xl"
        onSubmit={handleSubmit}
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">{type} Post</h2>
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
          <div>
            <label htmlFor="post-image" className="mb-2 block text-lg font-semibold text-white">
              Upload Images (if any)
            </label>
            <input
              id="post-image"
              name="post-image"
              type="file"
              accept="image/*"
              multiple
              onChange={e => setPostImage(e.target.files)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-white file:mr-4 file:cursor-pointer file:rounded file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white file:hover:bg-blue-700 focus:border-blue-600 focus:outline-none"
            />
            {postImage && postImage.length > 0 && (
              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setPostImage(null);
                      document.getElementById('post-image').value = '';
                    }}
                    className="text-sm text-red-400 transition-colors hover:text-red-300"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}
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
                    onClick={() => setPostGenre(index)}
                    className={`cursor-pointer rounded-lg bg-gray-800 p-2 ${
                      index === postGenre ? selectedGenre : ''
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
            Create post
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
