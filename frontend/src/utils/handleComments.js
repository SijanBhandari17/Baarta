export const addReplyComment = async reqBody => {
  console.log(reqBody);
  try {
    const response = await fetch('http://localhost:5000/reply', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data);
      return data.body;
    } else {
      console.error('Upload failed:', data.error);
    }
  } catch (err) {
    console.log(`Err: ${err}`);
  }
};

export const addRootComment = async reqBody => {
  console.log(reqBody);
  try {
    const response = await fetch('http://localhost:5000/comment', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    });

    const data = await response.json();
    console.log(data);
    if (response.ok) {
      return data.body;
    } else {
      console.error('Upload failed:', data.error);
    }
  } catch (err) {
    console.log(`Err: ${err}`);
  }
};

export const updateComment = async reqBody => {
  console.log(reqBody);
  try {
    const response = await fetch('http://localhost:5000/comment', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data);
      return data.body;
    } else {
      console.error('Upload failed:', data.error);
    }
  } catch (err) {
    console.log(`Err: ${err}`);
  }
};

export const deleteComment = async reqBody => {
  try {
    const response = await fetch('http://localhost:5000/comment', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
      credentials: 'include',
    });
    const data = await response.json();
    if (response.ok) {
      return data.body;
    }
  } catch (err) {
    console.error('error:', err);
  }
};
export const deleteReply = async reqBody => {
  try {
    const response = await fetch('http://localhost:5000/reply', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
      credentials: 'include',
    });
    const data = await response.json();
    if (response.ok) {
      return data.body;
    }
  } catch (err) {
    console.error('error:', err);
  }
};
