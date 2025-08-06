const getActivePolls = async () => {
  try {
    const response = await fetch('http://localhost:5000/all/poll', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      console.log(data);
    }
  } catch (err) {
    console.log(`Err: ${err}`);
  }
};

export default getActivePolls;
