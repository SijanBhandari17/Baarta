export const sidebarInfo = {
  hello: {
    memberCount: 100,
    onlineCount: 12,
    rules: [
      'Be respectful to all members',
      'No spam or self-promotion',
      'Use appropriate and inclusive language',
      'Stay on topic and avoid derailing threads',
      'Report any inappropriate behavior',
    ],
    tags: ['AI', 'MachineLearning', 'DeepLearning', 'DataScience', 'NeuralNetworks'],
  },
  sample: {
    memberCount: 50,
    onlineCount: 5,
    rules: [
      'No advertising',
      'Stay on topic',
      'Be polite in discussions',
      'Avoid political content',
      'Keep discussions academic',
    ],
    tags: ['JavaScript', 'ReactJS', 'Frontend', 'WebDev', 'CodingTips'],
  },
};

export const commentsBySlug = {
  'hello-post': [
    {
      id: 'c1',
      authorName: 'Alice',
      role: 'Professor',
      avatarUrl: 'https://i.pravatar.cc/40?img=5',
      body: 'First comment! Excited to be part of this discussion.',
      createdAt: '2025-07-23T14:00:00Z',
    },
    {
      id: 'c2',
      authorName: 'Bob',
      role: 'Student',
      avatarUrl: 'https://i.pravatar.cc/40?img=10',
      body: 'Thanks for sharing this post. Learned a lot!',
      createdAt: '2025-07-23T15:00:00Z',
    },
    {
      id: 'c3',
      authorName: 'Dr. Emma',
      role: 'Professor',
      avatarUrl: 'https://i.pravatar.cc/40?img=7',
      body: 'A solid explanation of the neural network concepts. Keep it up!',
      createdAt: '2025-07-23T16:30:00Z',
    },
  ],
  'sample-post': [
    {
      id: 'c4',
      authorName: 'Charlie',
      role: 'Student',
      avatarUrl: 'https://i.pravatar.cc/40?img=12',
      body: 'Interesting read. Would love to see more posts like this.',
      createdAt: '2025-07-20T16:00:00Z',
    },
    {
      id: 'c5',
      authorName: 'Dana',
      role: 'Student',
      avatarUrl: 'https://i.pravatar.cc/40?img=30',
      body: 'React hooks explained very clearly. Kudos!',
      createdAt: '2025-07-20T17:45:00Z',
    },
  ],
};

export const postsBySlug = {
  'hello-post': {
    id: '1',
    title: 'Understanding Deep Learning in Simple Terms',
    authorName: 'John Doe',
    createdAt: '2025-07-23T12:00:00Z',
    body: `
      <p><strong>Deep learning</strong> is a subset of machine learning that uses artificial neural networks with many layers (hence "deep").</p>
      <p>It excels at recognizing patterns from large datasets and is the driving force behind technologies like:</p>
      <ul>
        <li>Image and voice recognition</li>
        <li>Natural language processing (NLP)</li>
        <li>Recommendation engines</li>
      </ul>
      <p>This post aims to break down complex terms into analogies so everyone can understand.</p>
    `,
    views: 1234,
  },
  'sample-post': {
    id: '2',
    title: "ReactJS Hooks — A Beginner's Guide",
    authorName: 'Jane Smith',
    createdAt: '2025-07-20T15:30:00Z',
    body: `
      <p><strong>React hooks</strong> let you use state and lifecycle methods in functional components.</p>
      <p>Two key hooks include:</p>
      <ul>
        <li><code>useState()</code> – for managing local state</li>
        <li><code>useEffect()</code> – for handling side effects like API calls</li>
      </ul>
      <p>This beginner-friendly guide shows practical examples to get you started.</p>
    `,
    views: 456,
  },
};
