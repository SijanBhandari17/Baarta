import Micheal from '../assets/images/michealscott.jpeg';
import Mclovin from '../assets/images/mclovin.jpeg';
import Mozart from '../assets/images/mozart.jpeg';
import Rock from '../assets/images/rock.jpeg';

export const event = {
  id: 'evt001',
  name: 'ai-data-symposium-2024',
  title: 'Research Symposium 2024: AI & Data Science Frontiers',
  date: '2024-03-15',
  time: '9:00 AM - 5:00 PM EST',
  tags: ['AI Research', 'Data Science', 'Symposium'],
  attending_count: 124,
  description:
    'Join us for a day of cutting-edge research presentations and discussions in AI and Data Science. This symposium brings together leading researchers, industry experts, and academics to explore the latest developments in artificial intelligence and data science.',
};

export const speakers = [
  {
    id: 'spk001',
    name: 'Dr. Sarah Chen',
    role: 'Department Lead',
    division: 'Data Science Division',
    image: Micheal,
  },
  {
    id: 'spk002',
    name: 'Prof. Michael Zhang',
    role: 'Department Head',
    division: 'Computer Science',
    image: Mozart,
  },
  {
    id: 'spk003',
    name: 'Dr. Emily Rodriguez',
    role: 'Senior Researcher',
    division: 'AI Ethics Division',
    image: Mclovin,
  },
  {
    id: 'spk004',
    name: 'Dr. James Wilson',
    role: 'Tech Director',
    division: 'Machine Learning Lab',
    image: Rock,
  },
];

export const schedule = [
  {
    time: '9:00 AM',
    title: 'Opening Keynote',
    speaker: 'Dr. Sarah Chen',
  },
  {
    time: '10:30 AM',
    title: 'AI Ethics Panel Discussion',
    speaker: 'Dr. Emily Rodriguez',
  },
  {
    time: '1:00 PM',
    title: 'Lunch Break & Networking',
    speaker: null,
  },
  {
    time: '2:00 PM',
    title: 'Machine Learning Workshop',
    speaker: 'Prof. Michael Zhang',
  },
  {
    time: '4:00 PM',
    title: 'Closing Remarks',
    speaker: 'Dr. James Wilson',
  },
];

export const location = [
  {
    building: 'Main Campus, Building A',
    room: 'Room 302, Innovation Center',
    address: '123 University Drive',
    map_embed_url: 'https://maps.google.com/?q=123+University+Drive',
  },
];

export const similarEvents = [
  {
    id: 'evt002',
    name: 'data-science-workshop-2024',
    title: 'Data Science Workshop 2024',
    date: '2024-03-20',
    thumbnail: '/images/events/data_workshop.jpg',
  },
  {
    id: 'evt003',
    name: 'ai-ethics-conference-2024',
    title: 'AI Ethics Conference',
    date: '2024-03-25',
    thumbnail: '/images/events/ai_ethics.jpg',
  },
  {
    id: 'evt004',
    name: 'ml-summit-2024',
    title: 'Machine Learning Summit',
    date: '2024-04-01',
    thumbnail: '/images/events/ml_summit.jpg',
  },
];

export const discussion = [
  {
    comment_count: 12,
    discussion_link: '/event/ai-data-symposium-2024/discussion',
  },
];

export const userOptions = [
  {
    calendar: true,
    share: true,
    notify_before_event: true,
  },
];
