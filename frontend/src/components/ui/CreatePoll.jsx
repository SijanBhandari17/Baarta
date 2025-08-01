import React, { useState } from 'react';
import { usePost } from '../../context/PostContext';

function CreatePoll({ type, poll, forum, updatePoll, onClose, onSuccess }) {
  const [title, setTitle] = useState(poll.title || []);
  const [options, setOptions] = useState(poll.option.map(opt => opt.name));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { addPollInContext } = usePost();
  console.log(poll);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = index => {
    if (options.length > 2) {
      const updated = options.filter((_, i) => i !== index);
      setOptions(updated);
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      setError('Poll title is required');
      return false;
    }

    console.log(options);
    const validOptions = options.filter(opt => opt.trim());

    if (validOptions.length < 2) {
      setError('At least 2 options are required');
      return false;
    }

    const uniqueOptions = new Set(validOptions.map(opt => opt.trim().toLowerCase()));
    if (uniqueOptions.size !== validOptions.length) {
      setError('Duplicate options are not allowed');
      return false;
    }

    return true;
  };

  const handleSubmit = async e => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');

    const validOptions = options.map(opt => opt.trim());
    if (!updatePoll) {
      try {
        const response = await fetch('http://localhost:5000/poll', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            title: title.trim(),
            forumId: forum._id,
            options: validOptions,
          }),
        });

        const data = await response.json();
        addPollInContext(data.body[0]);
        if (!response.ok) {
          throw new Error(data.error || 'Failed to create poll');
        }

        onSuccess?.(data);
        onClose();
      } catch (err) {
        setError(err.message || 'Failed to create poll');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      updatePoll({ pollId: poll._id, title: title.trim(), options: validOptions });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-gray-900 p-6 text-white shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-3xl font-bold text-white transition hover:text-red-500"
        >
          &times;
        </button>

        <h2 className="mb-6 text-center text-2xl font-bold">{type} Poll</h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/20 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Poll Title */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-purple-200">Poll Question</label>
          <input
            type="text"
            className="w-full rounded-lg border border-white/10 bg-gray-800 px-4 py-3 text-white transition focus:border-purple-400 focus:outline-none"
            placeholder="What's your question?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={200}
          />
          <div className="mt-1 text-right text-xs text-white/40">{title.length}/200</div>
        </div>

        {/* Options */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-purple-200">Options</label>
          {options.map((option, index) => (
            <div key={index} className="mb-3 flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full rounded-lg border border-white/10 bg-gray-800 px-3 py-2 text-white transition focus:border-purple-400 focus:outline-none"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={e => handleOptionChange(index, e.target.value)}
                  maxLength={100}
                />
              </div>
              {options.length > 2 && (
                <button
                  onClick={() => removeOption(index)}
                  className="px-2 py-2 text-red-400 transition hover:text-red-500"
                  title="Remove option"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          {/* Add Option Button */}
          {options.length < 10 && (
            <button
              onClick={addOption}
              className="mt-2 w-full rounded-lg border-2 border-dashed border-white/20 py-2 text-white/60 transition hover:border-purple-400 hover:text-purple-300"
            >
              + Add Option
            </button>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-white/20 px-4 py-3 font-medium text-white/80 transition hover:bg-white/10"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 cursor-pointer rounded-lg bg-purple-600 px-4 py-3 font-medium text-white transition hover:bg-purple-700"
          >
            {type} Poll
          </button>
        </div>

        {/* Info Text */}
        <div className="mt-4 text-center text-xs text-white/40">
          Minimum 2 options required • Maximum 10 options
        </div>
      </div>
    </div>
  );
}

export default CreatePoll;
