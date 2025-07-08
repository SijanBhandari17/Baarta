import HomeSrc from '../assets/icons/home.svg';
import ForumSrc from '../assets/icons/forum.svg';
import SavedSrc from '../assets/icons/savedposts.svg';
import DraftsSrc from '../assets/icons/drafts.svg';

const navbarInfo = [
  {
    label: 'Home',
    imgSrc: HomeSrc,
  },
  {
    label: 'Forum',
    imgSrc: ForumSrc,
  },
  {
    label: 'Saved',
    imgSrc: SavedSrc,
  },
  {
    label: 'Draft',
    imgSrc: DraftsSrc,
  },
];

const homeContentNavbar = [
  {
    label: 'Live Discussions',
  },
  {
    label: 'My Threads',
  },
  {
    label: 'Following',
  },
  {
    label: 'Enrolled Forums',
  },
  {
    label: 'Trending',
  },
];

export { navbarInfo, homeContentNavbar };
