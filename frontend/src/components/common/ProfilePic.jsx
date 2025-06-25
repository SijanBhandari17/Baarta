import userInfo from '../../utils/fetchUserInfo';
import { User } from 'lucide-react';
import { Sun } from 'lucide-react';
import { Moon } from 'lucide-react';
import { LogOut } from 'lucide-react';

const defaultClass = 'h-10 w-10 text-white';
const profileNav = [
  {
    label: 'Change Profile',
    imgSrc: <User className={defaultClass} />,
  },
  {
    label: 'Toggle Theme',
    imgSrc: <Sun className={defaultClass} />,
  },
  {
    label: 'Logout',
    imgSrc: <LogOut className={defaultClass} />,
  },
];

function ProfilePic() {
  return (
    <div className="rounded-button-round absolute top-20 right-5 z-10 flex flex-col bg-[#636363] p-4">
      <div className="flex items-center justify-evenly gap-2 border-b border-b-white/10 px-4 py-2">
        <img
          src={userInfo.imgSrc}
          className="h-25 w-25 cursor-pointer rounded-full object-cover object-center"
        />
        <div className="">
          <p className="text-title text-font font-bold">{userInfo.name}</p>
          <p className="text-body text-font-light/80">{userInfo.email}</p>
        </div>
      </div>
      <div className="flex flex-col justify-evenly">
        {profileNav.map((item, index) => {
          return (
            <div
              key={index}
              className="hover:bg-layout-elements-focus rounded-button-round my-2 flex cursor-pointer items-center gap-8 py-2"
            >
              <p className="my-2">{item.imgSrc}</p>
              <p className="text-title text-font-light/80 flex-1 cursor-pointer">{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProfilePic;
