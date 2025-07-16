import React, { useState } from 'react';

function PollModal({ poll, onClose }) {
  const [options, setOptions] = useState(poll.options.map(opt => ({ ...opt })));
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [newOption, setNewOption] = useState('');
  const [adding, setAdding] = useState(false);

  const totalVotes = options.reduce((sum, o) => sum + o.votes, 0);

  const handleOptionClick = (index) => {
    if (!submitted) {
      setSelected(index);
      return;
    }

    if (selected === index) {
      // unvote
      const updated = [...options];
      updated[index].votes = Math.max(0, updated[index].votes - 1);
      setOptions(updated);
      setSelected(null);
      setSubmitted(false);
    } else {
      const updated = [...options];
      if (selected !== null) updated[selected].votes = Math.max(0, updated[selected].votes - 1);
      updated[index].votes += 1;
      setOptions(updated);
      setSelected(index);
    }
  };

  const handleSubmit = () => {
    if (selected === null) return;

    const updated = [...options];
    updated[selected].votes += 1;
    setOptions(updated);
    setSubmitted(true);
  };

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    setOptions(prev => [...prev, { label: newOption.trim(), votes: 0 }]);
    setNewOption('');
    setAdding(false);
  };

  const getPercentage = (votes) =>
    totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : '0.0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 px-4">
      <div className="bg-gray-900 text-white rounded-2xl p-6 w-full max-w-lg relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-white text-3xl font-bold hover:text-red-500 transition"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">{poll.title}</h2>

        {options.map((option, index) => {
          const isSelected = selected === index;
          return (
            <div
              key={index}
              className={`w-full mb-4 p-3 rounded-xl border border-white/10 hover:bg-white/10 cursor-pointer transition ${
                isSelected ? 'bg-purple-700/40 border-purple-400' : ''
              }`}
              onClick={() => handleOptionClick(index)}
            >
              <div className="flex justify-between font-medium">
                <span>{option.label}</span>
                {submitted && (
                  <span className="text-sm text-purple-200">
                    {getPercentage(option.votes)}%
                  </span>
                )}
              </div>
              {submitted && (
                <div className="mt-1 h-2 w-full bg-gray-700 rounded-full">
                  <div
                    className="h-2 bg-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${getPercentage(option.votes)}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Add Option UI */}
        {adding ? (
          <div className="mb-4 mt-2 flex gap-2">
            <input
              type="text"
              className="w-full rounded-lg bg-gray-800 text-white px-3 py-2 focus:outline-none"
              placeholder="New option"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
            />
            <button
              onClick={handleAddOption}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold"
            >
              Add
            </button>
          </div>
        ) : (
          <div className="text-center mt-3">
            <button
              onClick={() => setAdding(true)}
              className="text-sm text-purple-300 hover:text-purple-500 underline"
            >
              + Add Option
            </button>
          </div>
        )}

        {/* Vote and info */}
        <div className="text-sm text-white/40 text-center mt-4 mb-2">
          {totalVotes} vote{submitted || totalVotes !== 1 ? 's' : ''} · Deadline: {poll.deadline}
        </div>

        {!submitted ? (
          <div className="text-center mt-4">
            <button
              disabled={selected === null}
              onClick={handleSubmit}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                selected === null
                  ? 'bg-white/10 text-white/40 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {selected === null ? 'Select an option' : 'Submit Vote'}
            </button>
          </div>
        ) : (
          <p className="mt-4 text-green-400 text-center font-medium">
            ✅ Vote submitted. Click another option to change or click the same to unvote.
          </p>
        )}
      </div>
    </div>
  );
}

export default PollModal;
