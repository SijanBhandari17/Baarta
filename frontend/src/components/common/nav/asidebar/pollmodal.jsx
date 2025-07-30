import React, { useEffect, useState } from 'react';

function PollModal({ forumID, poll, onClose }) {
  // const [options, setOptions] = useState(poll.options.map(opt => ({ ...opt })));
  // const [selected, setSelected] = useState(null);
  // const [submitted, setSubmitted] = useState(false);
  // const [newOption, setNewOption] = useState('');
  // const [adding, setAdding] = useState(false);
  //
  // const totalVotes = options.reduce((sum, o) => sum + o.votes, 0);
  //
  console.log('hi');
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch(`http://localhost:5000/poll?forumId=${forumID}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        const data = await response.json();
        console.log(data);
      } catch (err) {
        console.log(`Err: ${err}`);
      }
    };

    fetchPolls();
  }, [forumID]);

  // const handleOptionClick = index => {
  //   if (!submitted) {
  //     setSelected(index);
  //     return;
  //   }
  //
  //   if (selected === index) {
  //     // unvote
  //     const updated = [...options];
  //     updated[index].votes = Math.max(0, updated[index].votes - 1);
  //     setOptions(updated);
  //     setSelected(null);
  //     setSubmitted(false);
  //   } else {
  //     const updated = [...options];
  //     if (selected !== null) updated[selected].votes = Math.max(0, updated[selected].votes - 1);
  //     updated[index].votes += 1;
  //     setOptions(updated);
  //     setSelected(index);
  //   }
  // };
  //
  // const handleSubmit = () => {
  //   if (selected === null) return;
  //
  //   const updated = [...options];
  //   updated[selected].votes += 1;
  //   setOptions(updated);
  //   setSubmitted(true);
  // };
  //
  // const handleAddOption = () => {
  //   if (!newOption.trim()) return;
  //   setOptions(prev => [...prev, { label: newOption.trim(), votes: 0 }]);
  //   setNewOption('');
  //   setAdding(false);
  // };
  //
  // const getPercentage = votes => (totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : '0.0');
  //
  // return (
  //   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
  //     <div className="relative w-full max-w-lg rounded-2xl bg-gray-900 p-6 text-white shadow-2xl">
  //       <button
  //         onClick={onClose}
  //         className="absolute top-4 right-5 text-3xl font-bold text-white transition hover:text-red-500"
  //       >
  //         &times;
  //       </button>
  //
  //       <h2 className="mb-6 text-center text-2xl font-bold">{poll.title}</h2>
  //
  //       {options.map((option, index) => {
  //         const isSelected = selected === index;
  //         return (
  //           <div
  //             key={index}
  //             className={`mb-4 w-full cursor-pointer rounded-xl border border-white/10 p-3 transition hover:bg-white/10 ${
  //               isSelected ? 'border-purple-400 bg-purple-700/40' : ''
  //             }`}
  //             onClick={() => handleOptionClick(index)}
  //           >
  //             <div className="flex justify-between font-medium">
  //               <span>{option.label}</span>
  //               {submitted && (
  //                 <span className="text-sm text-purple-200">{getPercentage(option.votes)}%</span>
  //               )}
  //             </div>
  //             {submitted && (
  //               <div className="mt-1 h-2 w-full rounded-full bg-gray-700">
  //                 <div
  //                   className="h-2 rounded-full bg-purple-500 transition-all duration-300"
  //                   style={{ width: `${getPercentage(option.votes)}%` }}
  //                 />
  //               </div>
  //             )}
  //           </div>
  //         );
  //       })}
  //
  //       {/* Add Option UI */}
  //       {adding ? (
  //         <div className="mt-2 mb-4 flex gap-2">
  //           <input
  //             type="text"
  //             className="w-full rounded-lg bg-gray-800 px-3 py-2 text-white focus:outline-none"
  //             placeholder="New option"
  //             value={newOption}
  //             onChange={e => setNewOption(e.target.value)}
  //           />
  //           <button
  //             onClick={handleAddOption}
  //             className="rounded-lg bg-green-500 px-4 py-2 font-semibold hover:bg-green-600"
  //           >
  //             Add
  //           </button>
  //         </div>
  //       ) : (
  //         <div className="mt-3 text-center">
  //           <button
  //             onClick={() => setAdding(true)}
  //             className="text-sm text-purple-300 underline hover:text-purple-500"
  //           >
  //             + Add Option
  //           </button>
  //         </div>
  //       )}
  //
  //       {/* Vote and info */}
  //       <div className="mt-4 mb-2 text-center text-sm text-white/40">
  //         {totalVotes} vote{submitted || totalVotes !== 1 ? 's' : ''} · Deadline: {poll.deadline}
  //       </div>
  //
  //       {!submitted ? (
  //         <div className="mt-4 text-center">
  //           <button
  //             disabled={selected === null}
  //             onClick={handleSubmit}
  //             className={`rounded-lg px-6 py-2 font-semibold transition ${
  //               selected === null
  //                 ? 'cursor-not-allowed bg-white/10 text-white/40'
  //                 : 'bg-purple-600 text-white hover:bg-purple-700'
  //             }`}
  //           >
  //             {selected === null ? 'Select an option' : 'Submit Vote'}
  //           </button>
  //         </div>
  //       ) : (
  //         <p className="mt-4 text-center font-medium text-green-400">
  //           ✅ Vote submitted. Click another option to change or click the same to unvote.
  //         </p>
  //       )}
  //     </div>
  //   </div>
  // );
}

export default PollModal;

