import { useEffect } from 'react';

function Threads() {
  useEffect(() => {
    getAllThreads();
  }, []);
  const forums = [];
  const getAllThreads = async () => {
    try {
      const response = await fetch('http://localhost:5000/miscallenuous/threadsByMe', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        // Handle successful response
      }
    } catch (err) {
      console.log(`Err: ${err}`);
    }
  };
  if (!forums?.length) {
    return (
      <div className="text-hero flex h-40 w-full items-center justify-center text-xl text-white">
        You haven't posted any threads
      </div>
    );
  }
  return <div className="threads-content"></div>;
}

export default Threads;
