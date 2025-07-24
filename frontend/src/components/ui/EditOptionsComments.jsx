import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material';
import { useComment } from '../../context/CommnentContext';
import { useParams, useNavigate } from 'react-router-dom';

function EditCommentModal({ commentId, comment }) {
  const { updateCommentInContext } = useComment();

  const updateComment = async () => {
    if (comment) {
      try {
        const response = await fetch('http://localhost:5000/comment', {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ commentId, text: comment }),
        });

        const data = await response.json();
        if (response.ok) {
          updateCommentInContext(data.body);
          console.log(data);
        } else {
          console.error('Update failed:', data.error);
        }
      } catch (err) {
        console.error(`Err: ${err}`);
      }
    }
  };
}

function EditOptionsComment({ onClick, comment, commentId }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const options = [
    {
      label: 'Edit Comment',
      icon: Pencil,
      className: 'text-font',
      onClick: onClick,
    },
    {
      label: 'Delete Comment',
      icon: Trash2,
      className: 'text-red-500',
      onClick: () => setIsDeleteModalOpen(true),
    },
  ];

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
        <EditCommentModal
          comment={comment}
          commentId={commentId}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteCommentDialog post={post} onClose={() => setIsDeleteModalOpen(false)} />
      )}
    </>
  );
}

function DeleteCommentDialog({ onClose, comment }) {
  const { deleteCommentInContext } = useComment();

  const onDelete = async () => {
    if (comment) {
      try {
        const response = await fetch('http://localhost:5000/comment', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ commentId: comment._id }),
        });

        const data = await response.json();
        if (response.ok) {
          deleteCommentInContext(comment._id);
        } else {
          console.error('Delete failed:', data.error);
        }
      } catch (err) {
        console.error('error:', err);
      }
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Are you sure you want to delete this comment?</DialogTitle>
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

export default EditOptionsComment;
