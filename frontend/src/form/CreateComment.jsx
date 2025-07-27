import { SendHorizonal, X } from 'lucide-react';
import { useState } from 'react';

function CreateComment({ isEditing, handleSubmit, showCancel, onShowCancelClick }) {
  const [commentText, setCommentText] = useState('');
  console.log(commentText);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-layout-elements-focus rounded-button-round border-layout-elements-focus border p-4"
    >
      <textarea
        name="comment"
        rows="3"
        placeholder="Share your thoughts..."
        value={commentText}
        onChange={e => setCommentText(e.target.value)}
        className="bg-main-elements rounded-button-round border-layout-elements-focus w-full resize-none border p-4 text-white focus:ring-2 focus:ring-[#4169E1]"
        required
      />
      <div className="mt-3 flex justify-end gap-3">
        {!showCancel && (
          <button
            type="button"
            onClick={onShowCancelClick}
            className="rounded-button-round flex cursor-pointer items-center gap-2 bg-gray-600 px-5 py-2 text-white hover:bg-gray-700"
          >
            <X size={16} /> Cancel
          </button>
        )}

        <button
          type="submit"
          className="rounded-button-round flex items-center gap-2 bg-[#4169E1] px-5 py-2 text-white hover:bg-[#255FCC]"
        >
          <SendHorizonal size={16} /> Comment
        </button>
      </div>
    </form>
  );
}

export default CreateComment;
