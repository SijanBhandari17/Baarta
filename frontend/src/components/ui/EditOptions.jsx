import { useState } from 'react';
import { Pencil, Trash2, UserRoundCog } from 'lucide-react';
import CreateForum from '../../form/CreateForum';
import { useForum } from '../../context/ForumContext';
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material';
import ShowForumsMembers from './ShowForumsMembers';

function EditForumModal({ onClose, forum }) {
  const { updateForumInContext } = useForum();
  const navigate = useNavigate();

  const updateForum = async forumData => {
    if (forumData && Object.keys(forumData).length !== 0) {
      try {
        const response = await fetch('http://localhost:5000/forum', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(forumData),
        });
        const data = await response.json();
        console.log(data);

        if (response.ok) {
          updateForumInContext(data.body);
          navigate(`/b/${encodeURIComponent(data.body.forum_name)}`);
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
        updateForum={updateForum}
      />
    </>
  );
}
function EditOptions({ isOpen, forum }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isModeratorModalOpen, setIsModeratorModalOpen] = useState(false);

  const options = [
    {
      label: 'Edit Forum',
      icon: Pencil,
      onClick: () => setIsEditModalOpen(true),
      className: 'text-font',
    },
    {
      label: 'Make Moderator',
      icon: UserRoundCog,
      onClick: () => setIsModeratorModalOpen(true),
      className: 'text-font',
    },
    {
      label: 'Delete Forum',
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

      {isEditModalOpen && (
        <EditForumModal forum={forum} onClose={() => setIsEditModalOpen(false)} />
      )}
      {isDeleteModalOpen && (
        <DeleteOptions forum={forum} onClose={() => setIsDeleteModalOpen(false)} />
      )}
      {isModeratorModalOpen && (
        <ShowForumsMembers forum={forum} onClose={() => setIsModeratorModalOpen(false)} />
      )}
    </>
  );
}

function DeleteOptions({ onClose, forum }) {
  const { deleteForumInContext } = useForum();
  const navigate = useNavigate();
  console.log(forum);

  const onDelete = async () => {
    console.log('hi');
    if (forum) {
      try {
        const response = await fetch('http://localhost:5000/forum', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ forumId: forum._id }),
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          console.log(data);
          deleteForumInContext(forum._id);
          navigate('/forum', { replace: true });
        }
      } catch (err) {
        console.error('error:', err);
      }
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Are you sure you want to delete this forum?</DialogTitle>
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

export default EditOptions;
