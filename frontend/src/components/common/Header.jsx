import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import BaartaIcon from '../../assets/icons/Baarta.svg';
import SearchIcon from '../../assets/icons/searchIcon.svg';
import { Bell } from 'lucide-react';
import Profile from './Profile';
import Notification from './Notification';
import LoginPopUp from '../ui/LoginPopUp';
import SignInPopUp from '../ui/SignUpPopUp';
import { useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import DefaultProfile from '../../assets/images/defaultUser.svg';
import { useNavigate } from 'react-router-dom';
const notificationCount = 1;

function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="bg-layout-elements sticky top-0 flex h-20 w-full items-center justify-between gap-1 border border-b-white/10 px-3 pt-2 pb-4">
      <div className="flex gap-18">
        <img
          onClick={() => navigate('/home/livediscussions')}
          src={BaartaIcon}
          alt="Baarta Icon"
          className="cursor-pointer"
        />
        <SearchBar />
      </div>
      {user ? <ProfileSection /> : <AuthenticateOptions />}
    </nav>
  );
}

function useDropdown(selector) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = e => {
      if (e.key === 'Escape') toggle();
    };

    const handleOutsideClick = e => {
      if (!e.target.closest(selector)) toggle();
    };

    window.addEventListener('keydown', handleEsc);
    window.addEventListener('click', handleOutsideClick);

    return () => {
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen, toggle, selector]);

  return [isOpen, toggle];
}

function ProfileSection() {
  const [showProfile, toggleProfile] = useDropdown('.profile-section');
  const [showNotification, toggleNotification] = useDropdown('.notification-section');
  const auth = useAuth();
  const { user, logOut } = auth;
  console.log(user)
  return (
    <div className="flex">
      <div className="notification-section relative flex items-center">
        <Bell
          className="hover:bg-layout-elements-focus h-12 w-14 cursor-pointer rounded-full p-2 text-white"
          title="Notifications"
          onClick={toggleNotification}
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
      <div className="profile-section flex size-[56px] items-center justify-center rounded-full">
        <img

          src={user.info?.profilePic}
          className="hover:bg-layout-elements-focus h-15 w-16 cursor-pointer rounded-full p-2 object-cover object-center"
          onClick={toggleProfile}
        />
      </div>
      {showProfile && <Profile />}
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
  const [showSignIn, setShowSignIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  function handleThemeClick() {
    setDarkMode(!darkMode);
  }

  return (
    <>
      <div className="flex gap-2">
        {darkMode ? (
          <Moon
            onClick={handleThemeClick}
            className="hover:bg-layout-elements-focus size-[50px] cursor-pointer rounded-[0.4rem] p-2 text-gray-100/50"
          />
        ) : (
          <Sun
            onClick={handleThemeClick}
            className="hover:bg-layout-elements-focus size-[50px] cursor-pointer rounded-[0.4rem] p-2 text-gray-100/50"
          />
        )}

        <button
          onClick={() => setShowLogin(true)}
          className="text-royalpurple-dark p-button-padding border-royalpurple-dark rounded-button-round hover:bg-royalpurple-dark cursor-pointer border-2 px-6 font-medium transition-all duration-300 ease-in hover:text-gray-50"
        >
          Sign In
        </button>

        <button
          onClick={() => setShowSignIn(true)}
          className="p-button-padding rounded-button-round cursor-pointer bg-green-600 px-6 font-medium text-white transition-all duration-300 ease-in hover:bg-green-700"
        >
          Join Now
        </button>
      </div>

      {/* Popups */}
      <SignInPopUp isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
      <LoginPopUp isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
export default Header;
