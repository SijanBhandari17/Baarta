import userInfo from '../../utils/fetchUserInfo';
import { User } from 'lucide-react';
import { Sun } from 'lucide-react';
import { Moon } from 'lucide-react';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';

const defaultClass = 'h-10 w-10 pl-2 text-white';

function Profile() {
  const [darkMode, setDarkMode] = useState(true);
  const [profileImage, setProfileImage] = useState(userInfo.imgSrc);
  const fileInputRef = useRef(null);

  const handleChangeProfile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    // Implement logout logic
  };

  const profileNav = [
    {
      label: 'Change Profile',
      imgSrc: <User className={defaultClass} />,
      onClick: handleChangeProfile,
    },
    {
      label: darkMode ? 'Light Mode' : 'Dark Mode',
      imgSrc: darkMode ? <Sun className={defaultClass} /> : <Moon className={defaultClass} />,
      onClick: handleTheme,
    },
    {
      label: 'Logout',
      imgSrc: <LogOut className={defaultClass} />,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="rounded-button-round profile-section absolute top-20 right-5 z-10 flex flex-col bg-[#636363] p-4">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div className="flex items-center justify-evenly gap-2 border-b border-b-white/10 px-4 py-2">
        <img
          src={profileImage}
          className="h-25 w-25 cursor-pointer rounded-full object-cover object-center"
          onClick={handleChangeProfile}
        />
        <div>
          <p className="text-title text-font font-bold">{userInfo.name}</p>
          <p className="text-body text-font-light/80">{userInfo.email}</p>
        </div>
      </div>

      <div className="flex flex-col justify-evenly">
        {profileNav.map((item, index) => (
          <div
            key={index}
            className="hover:bg-layout-elements-focus rounded-button-round my-2 flex cursor-pointer items-center gap-8 py-2"
            onClick={item.onClick}
          >
            <p className="my-2">{item.imgSrc}</p>
            <p className="text-title text-font-light/80 flex-1 cursor-pointer">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
