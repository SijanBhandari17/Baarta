import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material';
import { useComment } from '../../context/CommnentContext';
import { useParams, useNavigate } from 'react-router-dom';

function EditOptionsComment({ onClick, onDelete }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
      {isDeleteModalOpen && (
        <DeleteCommentDialog onDelete={onDelete} onClose={() => setIsDeleteModalOpen(false)} />
      )}
    </>
  );
}

function DeleteCommentDialog({ onClose, onDelete, commentId }) {
  const { deleteCommentInContext } = useComment();

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
