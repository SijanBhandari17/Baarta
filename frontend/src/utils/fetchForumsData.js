const fetchForums = async () => {
  try {
    const response = await fetch('http://localhost:5000/forum', {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();

    if (response.ok) {
      return data.body;
    } else {
      console.log(data);
    }
  } catch (err) {
    console.log(`error:${err} `);
  }
};
export default fetchForums;
