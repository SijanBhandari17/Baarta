const buildTree = async mainComments => {
  const attachReplies = async comment => {
    const replies = await fetchReplies(comment._id);
    const nestedReplies = Array.isArray(replies?.body) ? replies.body : [];
    comment.replies = nestedReplies;

    for (const reply of nestedReplies) {
      await attachReplies(reply);
    }
  };

  for (const comments of mainComments) {
    await attachReplies(comments);
  }
  return mainComments;
};
const fetchReplies = async commentId => {
  try {
    const response = await fetch(`http://localhost:5000/reply?commentId=${commentId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(`Err: ${err}`);
  }
};

export default buildTree;
