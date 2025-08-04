import React, { useEffect, useState } from 'react';
import { usePost } from '../../../../context/PostContext';
import LoadingSpinner from '../../LoadingSpinner';
import { useAuth } from '../../../../context/AuthContext';

function PollModal({ poll, onClose }) {
  const [options, setOptions] = useState(poll.option?.map(item => ({ ...item })));
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();
  const { updatePollInContext } = usePost();
  const totalVotes = options.reduce((sum, o) => sum + o.voter_Id.length, 0);
  const handleOptionClick = option => {
    if (!submitted) {
      setSelected(option);
      return;
    }
  };
  const handleOptionsUpdate = updatedPoll => {
    console.log('hello');
    updatePollInContext(updatedPoll);
  };

  const handleSubmit = async () => {
    if (selected === null) return;

    try {
      const response = await fetch('http://localhost:5000/poll/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pollId: poll._id, option: selected.name }),
        credentials: 'include',
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setOptions(data.body.option);
        console.log(data);
        setSubmitted(true);
        handleOptionsUpdate(data.body);
      } else {
        console.error('Failed to fetch posts:', data.error);
      }
    } catch (err) {
      console.error(`Err: ${err.message}`);
    }
  };

  const getPercentage = votes => (totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : '0.0');

  return (
    <>
      <div
        key={poll._id}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
      >
        <div className="relative w-full max-w-lg rounded-2xl bg-gray-900 p-6 text-white shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-5 text-3xl font-bold text-white transition hover:text-red-500"
          >
            &times;
          </button>

          <h2 className="mb-6 text-center text-2xl font-bold">{poll.title}</h2>

          {options.map(option => {
            const isSelected = selected?._id === option._id;
            return (
              <div
                key={option._id}
                className={`mb-4 w-full cursor-pointer rounded-xl border border-white/10 p-3 transition hover:bg-white/10 ${
                  isSelected ? 'border-purple-400 bg-purple-700/40' : ''
                }`}
                onClick={() => handleOptionClick(option)}
              >
                <div className="flex justify-between font-medium">
                  <span>{option.name}</span>
                  {submitted && (
                    <span className="text-sm text-purple-200">
                      {getPercentage(option.voter_Id.length)}%
                    </span>
                  )}
                </div>
                {submitted && (
                  <div className="mt-1 h-2 w-full rounded-full bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-purple-500 transition-all duration-300"
                      style={{ width: `${getPercentage(option.voter_Id.length)}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}

          <div className="mt-4 mb-2 text-center text-sm text-white/40">
            {totalVotes} vote{submitted || totalVotes !== 1 ? 's' : ''}
          </div>

          {!submitted ? (
            <div className="mt-4 text-center">
              <button
                disabled={selected === null}
                onClick={handleSubmit}
                className={`rounded-lg px-6 py-2 font-semibold transition ${
                  selected === null
                    ? 'cursor-not-allowed bg-white/10 text-white/40'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {selected === null ? 'Select an option' : 'Submit Vote'}
              </button>
            </div>
          ) : (
            <p className="mt-4 text-center font-medium text-blue-400">Vote submitted </p>
          )}
        </div>
      </div>
    </>
  );
}

export default PollModal;
