import { SendHorizonal } from 'lucide-react';
function CreateComment({ isEditing, handleSubmit, textArea, setTextArea }) {
  console.log(textArea);
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-layout-elements-focus rounded-button-round border-layout-elements-focus border p-4"
    >
      <textarea
        name="comment"
        rows="3"
        placeholder="Share your thoughts..."
        value={textArea}
        onChange={e => setTextArea(e.target.value)}
        className="bg-main-elements rounded-button-round border-layout-elements-focus w-full border p-4 text-white focus:ring-2 focus:ring-[#4169E1]"
        required
      />
      <div className="mt-3 flex justify-end">
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
