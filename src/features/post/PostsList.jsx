import React from 'react';
import { useSelector } from 'react-redux';
import PostsExcerpt from './PostsExcerpt';
import {
  selectPostsIds,
  getPostsStatus,
  getPostsError
} from './postSlice';

const PostsList = () => {
  //const posts = useSelector(selectAllPosts);
  const orderedPostsIds = useSelector(selectPostsIds);
  const postsStatus = useSelector(getPostsStatus);
  const postsError = useSelector(getPostsError);

  let content;
  if(postsStatus === 'loading'){
    content = <p>Loading...</p>
  }
  else if(postsStatus === 'succeeded') {
    // const orderedPosts = posts.slice().sort((a,b) => b.date.localeCompare(a.date));
    // content = orderedPosts.map(post => <PostsExcerpt key={post.id} post={post}/> );
    content = orderedPostsIds.map(postId => <PostsExcerpt key={postId} postId={postId}/> )
  }
  else if(postsStatus === 'failed') {
    content = <p>{postsError}</p>
  }

  return (
    <section>
      {content}
    </section>
  )
}

export default PostsList;