import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import CreateForum from '../../form/CreateForum';
import { useForum } from '../../context/ForumContext';

function EditForumModal({ onClose, forum }) {
  const { addForum } = useForum();

  const addNewForum = async forumData => {
    if (forumData && Object.keys(forumData).length !== 0) {
      try {
        const response = await fetch('http://localhost:5000/forum', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(forumData),
        });
        const data = await response.json();

        if (response.ok) {
          addForum(data.body);
        }
      } catch (err) {
        console.error('error:', err);
      }
    }
  };

  return (
    <>
      <div>Update Forum</div>
      <CreateForum
        type="Update"
        value={forum}
        isOpen={true}
        onClose={onClose}
        addNewForum={addNewForum}
      />
    </>
  );
}
function EditOptions({ isOpen, onClose, forum }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const options = [
    {
      label: 'Edit Forum',
      icon: Pencil,
      onClick: () => setIsEditModalOpen(true),
      className: 'text-font',
    },
    {
      label: 'Delete Forum',
      icon: Trash2,
      onClick: () => {},
      className: 'text-red-500',
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      <div className="flex flex-col gap-2">
        {options.map((item, index) => (
          <div
            key={index}
            onClick={item.onClick}
            className={`hover:bg-layout-elements-focus text-body rounded-button-round flex cursor-pointer items-center gap-2 p-1 ${item.className}`}
          >
            <item.icon size={16} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {isEditModalOpen && (
        <EditForumModal forum={forum} onClose={() => setIsEditModalOpen(false)} />
      )}
    </>
  );
}
export default EditOptions;
