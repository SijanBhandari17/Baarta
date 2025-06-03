import DepartmentSrc from '../assets/icons/department.svg';
import ThreadSrc from '../assets/icons/thread.svg';
import ActiveStatusSrc from '../assets/icons/activeusers.svg';

const communityStatus = [
  {
    title: 'Active Users',
    imgSrc: ActiveStatusSrc,
    count: '2,345',
  },
  {
    title: 'Total Threads',
    imgSrc: ThreadSrc,
    count: '4,321',
  },
  {
    title: 'Departments',
    imgSrc: DepartmentSrc,
    count: '35',
  },
];

const totalCommunityStatus = [
  {
    title: 'Student',
    membersCount: '15,000+',
    imgSrc: ActiveStatusSrc,
  },
  {
    title: 'Faculty',
    membersCount: '2,500+',
    imgSrc: ActiveStatusSrc,
  },
  {
    title: 'Researcher',
    membersCount: '5,000+',
    imgSrc: ActiveStatusSrc,
  },
];

export { communityStatus, totalCommunityStatus };
