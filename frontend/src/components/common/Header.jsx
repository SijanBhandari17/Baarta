import { useState } from 'react';
import BaartaIcon from '../../assets/icons/Baarta.svg';
import GoogleIcon from '../../assets/icons/googleIcon.svg';
import GithubIcon from '../../assets/icons/githubIcon.svg';
import SearchIcon from '../../assets/icons/searchIcon.svg';

function Header() {
  return (
    <nav className="bg-layout-elements flex items-center justify-between gap-1 border border-b-white/10 px-3 pt-2 pb-4">
      <div className="flex gap-18">
        <img src={BaartaIcon} alt="Baarta Icon" className="cursor-pointer" />
        <SearchBar />
      </div>
      <AuthenticateOptions className="flex" />
    </nav>
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

function AuthenticateOptions({ className = ' ' }) {
  return (
    <div className={`${className}`}>
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
