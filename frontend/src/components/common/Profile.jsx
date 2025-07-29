import { useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { User, Sun, Moon, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function Profile() {
  const [darkMode, setDarkMode] = useState(true);
  const [profileImage, setProfileImage] = useState('/default-avatar.png');
  const fileInputRef = useRef(null);
  const auth = useAuth();
  const { user, logOut, handleProfilePicChange } = auth;

  const defaultClass = 'w-6 h-6';

  const handleChangeProfile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async event => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      const response = await fetch('http://localhost:5000/uploads/profilePic', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        console.log('Upload successful:', data);
        handleProfilePicChange(data.file.url);
      } else {
        console.error('Upload failed:', data);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleTheme = () => {
    setDarkMode(!darkMode);
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
      onClick: logOut,
    },
  ];

  return (
    <div className="rounded-button-round profile-section absolute top-20 right-5 z-50 flex flex-col bg-gray-600 p-4">
      <input
        type="file"
        ref={fileInputRef}
        accept="multipart/form-data"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <div className="flex items-center justify-evenly gap-2 border-b border-b-white/10 px-4 py-2">
        <img
          src={user.info?.profilePic}
          className="h-25 w-25 cursor-pointer rounded-full object-cover object-center"
          onClick={handleChangeProfile}
        />
        <div>
          <p className="text-title text-font font-bold">{user.info.username}</p>
          <p className="text-body text-font-light/80">{user.info.email}</p>
        </div>
      </div>
      <div className="flex flex-col justify-evenly">
        {profileNav.map((item, index) => (
          <div
            key={index}
            className="rounded-button-round my-2 flex cursor-pointer items-center gap-8 py-2 hover:bg-gray-500"
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
