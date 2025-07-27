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

// const handleUpdateComment = async e => {
//   const formData = new FormData(e.target);
//   const comment = formData.get('comment');
//
//   try {
//     const response = await fetch('http://localhost:5000/comment', {
//       method: 'PUT',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ commentId: editing, text: comment }),
//     });
//
//     const data = await response.json();
//     if (response.ok) {
//       console.log(data);
//       addCommentInContext(data.body);
//       setEditing(null);
//     } else {
//       console.error('Upload failed:', data.error);
//     }
//   } catch (err) {
//     console.log(`Err: ${err}`);
//   }
// };
