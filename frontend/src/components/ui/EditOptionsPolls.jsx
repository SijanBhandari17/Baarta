import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { usePost } from '../../context/PostContext';
import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material';

function EditOptionsPoll({ isOpen, poll }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const options = [
    {
      label: 'Edit poll',
      icon: Pencil,
      onClick: () => setIsEditModalOpen(true),
      className: 'text-font',
    },
    {
      label: 'Delete poll',
      icon: Trash2,
      onClick: () => setIsDeleteModalOpen(true),
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

      {/* {isEditModalOpen && <EditPollModal poll={poll} onClose={() => setIsEditModalOpen(false)} />} */}
      {isDeleteModalOpen && (
        <DeleteOptions poll={poll} onClose={() => setIsDeleteModalOpen(false)} />
      )}
    </>
  );
}
function DeleteOptions({ poll, onClose }) {
  const { deletePollInContext } = usePost();
  const onDelete = async () => {
    if (poll) {
      try {
        const response = await fetch('http://localhost:5000/poll/deletePoll', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pollId: poll._id }),
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          deletePollInContext(poll._id);
        }
      } catch (err) {
        console.error('error:', err);
      }
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Are you sure you want to delete this poll?</DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          color="error"
          onClick={async () => {
            await onDelete();
            onClose();
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default EditOptionsPoll;
