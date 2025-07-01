import { useState } from 'react';
import DefaultUserPic from '../../assets/icons/defaultUser.svg';
import BaartaIcon from '../../assets/icons/Baarta.svg';
import GoogleIcon from '../../assets/icons/googleIcon.svg';
import GithubIcon from '../../assets/icons/githubIcon.svg';
import SearchIcon from '../../assets/icons/searchIcon.svg';
import isAuthenticated from '../../main';
import userInfo from '../../utils/fetchUserInfo';
import { Bell } from 'lucide-react';
import ProfilePic from './ProfilePic';
import Notification from './Notification';

const notificationCount = 1;

function Header() {
  return (
    <nav className="bg-layout-elements flex w-full items-center justify-between gap-1 border border-b-white/10 px-3 pt-2 pb-4">
      <div className="flex gap-18">
        <img src={BaartaIcon} alt="Baarta Icon" className="cursor-pointer" />
        <SearchBar />
      </div>
      {isAuthenticated ? <ProfileSection /> : <AuthenticateOptions />}
    </nav>
  );
}

function ProfileSection() {
  const [showProfilePic, setProfilePic] = useState(false);
  const [showNotification, setNotification] = useState(false);

  function handleNotificationClick() {
    setNotification(!showNotification);
  }
  function handleProfileClick() {
    setProfilePic(!showProfilePic);
  }

  return (
    <div className="flex">
      <div className="relative flex items-center">
        <Bell
          className="hover:bg-layout-elements-focus h-12 w-14 cursor-pointer rounded-full p-2 text-white"
          title="Notifications"
          onClick={handleNotificationClick}
        />
        {notificationCount > 0 ? (
          <span className="absolute top-1 right-2 flex min-h-[1.5rem] min-w-[1.5rem] cursor-pointer items-center justify-center rounded-full bg-red-600 text-[1rem] text-white">
            {notificationCount}
          </span>
        ) : (
          ' '
        )}
        {showNotification && <Notification />}
      </div>
      <div className="flex size-[56px] items-center justify-center rounded-full">
        <img
          src={userInfo.imgSrc}
          className="hover:bg-layout-elements-focus h-15 w-16 cursor-pointer rounded-full p-2"
          onClick={handleProfileClick}
        />
      </div>
      {showProfilePic && <ProfilePic />}
    </div>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');
  function handleChangeSearchBarChange(e) {
    setQuery(e.target.value);
  }
  return (
    <div className="bg-layout-elements-focus rounded-button-round relative flex w-[30rem] items-center px-2">
      <img src={SearchIcon} alt="Seach Icon" className="" height="20px" width="20px" />
      <input
        type="text"
        id="search-discussions"
        placeholder="Search Discussions..."
        className="rounded-button-round px-2 text-gray-500 caret-gray-100 placeholder:text-gray-500 focus:outline-none"
        onChange={handleChangeSearchBarChange}
        value={query}
      />
    </div>
  );
}

function AuthenticateOptions() {
  return (
    <div className="flex">
      <img
        src={GoogleIcon}
        alt="Google Icon"
        className="hover:bg-layout-elements-focus cursor-pointer rounded-[0.4rem] p-2"
      />
      <img
        src={GithubIcon}
        alt="Github Icon"
        className="hover:bg-layout-elements-focus cursor-pointer rounded-[0.4rem] p-2"
      />
      <button className="text-royalpurple-dark p-button-padding border-royalpurple-dark rounded-button-round hover:bg-royalpurple-dark cursor-pointer border border-2 px-6 font-medium transition-all duration-300 ease-in hover:text-gray-50">
        Sign In
      </button>
    </div>
  );
}

export default Header;
