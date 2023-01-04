import React from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { selectUserById } from '../user/usersSlice'
import { selectPostByUser } from '../post/postSlice'
import { Link } from 'react-router-dom';

const UserPage = () => {
  const { userId } = useParams();
  const user = useSelector(state => selectUserById(state,Number(userId)));
  
  //not using momize function
  // const postsForUser = useSelector(state => {
  //   const allPosts = selectAllPosts(state);
  //   return allPosts.filter(post => post.userId === Number(userId))
  // })

  //use memoize function
  const postsForUser = useSelector(state => selectPostByUser(state, Number(userId)));
  
  const postTitles = postsForUser.map(post => (
    <li key={post.id}>
      <Link to={`/post/${post.id}`}>{post.title}</Link>
    </li>
  ));

  return (
    <section>
      <h2>{user.name}</h2>
      <ol>
        {postTitles}
      </ol>
    </section>
  )
}

export default UserPage
