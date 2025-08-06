import { useEffect , useState } from 'react';
import IndividualPosts from '../../../ui/SinglePosts.jsx'
function Threads() {
  const [data, setData] = useState([])
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
        setData(data.body)
      }
    } catch (err) {
      console.log(`Err: ${err}`);
    }
  };
  if (!data.length) {
    return (
      <div className="text-hero flex h-40 w-full items-center justify-center text-xl text-white">
        You haven't posted any threads
      </div>
    );
  }
  return (<div className="threads-content">
    {console.log("inside",data)}
    {data.map(item=> <IndividualPosts post={item} key={item._id} />)}
  </div>)
}

export default Threads;
