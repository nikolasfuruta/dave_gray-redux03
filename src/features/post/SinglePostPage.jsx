import React from 'react';

import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { selectPostById } from './postSlice';

import PostAuthor from './PostAuthor';
import TimeAgo from './TimeAgo';
import ReactionButtons from './ReactionsButton';

const SinglePostPage = () => {
  const  { postId } = useParams()
  const post = useSelector((state) => selectPostById(state, Number(postId)))
  
  if(!post) {
    return (
      <section>
        <h2>Post Not Found!</h2>
      </section>
    );
  }
  return (
    <article>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <p className='postCredit'>
        <Link to={`/post/edit/${postId}`}>Edit</Link>
        <PostAuthor userId={post.userId}/>
        <TimeAgo timestamp={post.date}/>
      </p>
      <ReactionButtons post={post}/>
    </article>
  );
}

export default SinglePostPage