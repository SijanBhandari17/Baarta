import { useEffect } from 'react';

function Threads() {
  useEffect(() => {
    getAllThreads();
  }, []);
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
  return <div className="threads-content"></div>;
}

export default Threads;
