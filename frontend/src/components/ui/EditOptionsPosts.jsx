import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useForum } from '../../context/ForumContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Dialog, DialogTitle, DialogActions } from '@mui/material';
import CreatePost from '../../form/CreatePosts';
import { usePost } from '../../context/PostContext';

function EditPostModal({ onClose, post }) {
  const { updatePostInContext } = usePost();

  const updatePost = async postData => {
    if (post && Object.keys(post).length !== 0) {
      try {
        const formData = new FormData();
        formData.append('title', postData.title);
        formData.append('content_text', postData.content_text);
        formData.append('forumId', postData.forumId);
        formData.append('genre', postData.genre);
        formData.append('authorName', postData.authorName);
        formData.append('postId', post._id);
        console.log(post._id);

        if (post.postImage && post.postImage.length > 0) {
          formData.append('postImage', post.postImage[0]);
        }

        const response = await fetch('http://localhost:5000/post', {
          method: 'PUT',
          credentials: 'include',
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          updatePostInContext(data.body);
          console.log(data);
        } else {
          console.error('Upload failed:', data.error);
        }
      } catch (err) {
        console.log(`Err: ${err}`);
      }
    }
  };
  console.log(post);

  return (
    <>
      <div>Update Forum</div>
      <CreatePost
        type="Update"
        post={post}
        isOpen={true}
        onClose={onClose}
        updatePost={updatePost}
      />
    </>
  );
}
function EditOptionsPost({ isOpen, post }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  console.log(post);

  const options = [
    {
      label: 'Edit Post',
      icon: Pencil,
      onClick: () => setIsEditModalOpen(true),
      className: 'text-font',
    },
    {
      label: 'Delete Post',
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

      {isEditModalOpen && <EditPostModal post={post} onClose={() => setIsEditModalOpen(false)} />}
      {isDeleteModalOpen && (
        <DeleteOptions post={post} onClose={() => setIsDeleteModalOpen(false)} />
      )}
    </>
  );
}

function DeleteOptions({ onClose, post }) {
  const { deleteForumInContext } = useForum();
  const { deletePostInContext } = usePost();
  const { forumTitle } = useParams();
  const navigate = useNavigate();

  const onDelete = async () => {
    if (post) {
      try {
        const response = await fetch('http://localhost:5000/post', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postId: post._id }),
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          deletePostInContext(post._id);
          navigate(`/b/${forumTitle}`);
        }
      } catch (err) {
        console.error('error:', err);
      }
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
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

export default EditOptionsPost;
