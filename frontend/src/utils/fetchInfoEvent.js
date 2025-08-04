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
