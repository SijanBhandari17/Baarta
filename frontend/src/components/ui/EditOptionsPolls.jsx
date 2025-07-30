import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

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
      {/* {isDeleteModalOpen && ( */}
      {/*   <DeleteOptions poll={poll} onClose={() => setIsDeleteModalOpen(false)} /> */}
      {/* )} */}
    </>
  );
}
export default EditOptionsPoll;
