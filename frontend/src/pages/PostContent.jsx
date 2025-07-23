import { useParams } from 'react-router-dom';

function PostContent() {
  const { postTitle } = useParams();
  console.log(postTitle);

  return <div>hello</div>;
}
export default PostContent;
