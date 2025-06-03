import DepartmentSrc from '../assets/icons/departments.svg';
import ThreadSrc from '../assets/icons/thread.svg';
import ActiveStatusSrc from '../assets/icons/activeusers.svg';
import StudentSrc from '../assets/icons/student.svg';
import FacultySrc from '../assets/icons/faculty.svg';
import ResearcherSrc from '../assets/icons/researcher.svg';

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
    title: 'Students',
    membersCount: '15,000+',
    imgSrc: StudentSrc,
  },
  {
    title: 'Faculty',
    membersCount: '2,500+',
    imgSrc: FacultySrc,
  },
  {
    title: 'Researcher',
    membersCount: '5,000+',
    imgSrc: ResearcherSrc,
  },
];

export { communityStatus, totalCommunityStatus };
