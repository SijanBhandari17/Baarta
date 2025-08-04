import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import IndividualPosts from '../../../ui/SinglePosts';

function Saved() {
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/save', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setSavedPosts(data.body);
      }
    } catch (err) {
      console.log(`Err: ${err}`);
    }
  };

  const deleteSavedPosts = async postId => {
    try {
      const response = await fetch('http://localhost:5000/save', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
        credentials: 'include',
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setSavedPosts(prev => prev.filter(item => item._id !== postId));
      }
    } catch (err) {
      console.error('error:', err);
    }
  };
  return (
    <div className="bg-main-elements flex w-[70%] flex-col gap-4 p-6">
      {savedPosts.map(post => {
        return (
          <IndividualPosts
            key={post._id}
            deleteSavedPosts={deleteSavedPosts}
            showSavedIcon={true}
            post={post}
          />
        );
      })}
    </div>
  );
}
export default Saved;
