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
    title: 'Computer Engineering',
    membersCount: '150',
    imgSrc: StudentSrc,
  },
  {
    title: 'AWS',
    membersCount: '25',
    imgSrc: FacultySrc,
  },
  {
    title: 'Quantum Mechanics',
    membersCount: '20',
    imgSrc: ResearcherSrc,
  },
];

export { communityStatus, totalCommunityStatus };
