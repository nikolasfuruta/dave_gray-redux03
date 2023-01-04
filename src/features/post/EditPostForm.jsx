import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectPostById, updatePost, deletePost } from './postSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { selectAllUsers } from '../user/usersSlice';

const EditPostForm = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const post = useSelector((state) => selectPostById(state, Number(postId)));
  const users = useSelector(selectAllUsers);

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.body);
  const [userId, setUserId] = useState(post.userId);
  const [requestStatus, setRequestStatus] = useState('idle');
  
  if(!post) {
    return (
      <section>
        <h2>Post Not Found</h2>
      </section>
    );
  }

  const onTitleChange = e => setTitle(e.target.value);
  const onContentChange = e => setContent(e.target.value);
  const onAuthorChange = e => setUserId(Number(e.target.value));
  
  const canSave = [title, content, userId].every(Boolean) && requestStatus === 'idle';

  const onSave = () => {
    if(canSave){
      try{
        setRequestStatus('pending');
        dispatch(updatePost({ id: post.id, title, body:content, userId, reactions: post.reactions })).unwrap();
        setTitle('');
        setContent('');
        setUserId('');
        navigate(`/post/${postId}`)
      }
      catch(e) {
        console.error('Failed to update post', e)
      }
      finally{
        setRequestStatus('idle')
      }
    }
  }

  const onDeletePost = () => {
    try{
      setRequestStatus('pending');
      dispatch(deletePost({ id: post.id })).unwrap();
      setTitle('');
      setContent('');
      setUserId('');
      navigate('/')
    }
    catch(e){
      console.error('Failed to delete the post');
    }
    finally{
      setRequestStatus('idle');
    }
  }

  const usersOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
    )
  );

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Title:</label>
        <input type="text"
          id='postTitle'
          name='postTitle'
          value={title}
          onChange={onTitleChange}
        />

        <label htmlFor="postContent">Content:</label>
        <input type="text"
          id='postContent'
          name='postContent'
          value={content}
          onChange={onContentChange}
        />

        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" defaultValue={userId} onChange={onAuthorChange}>
          {usersOptions}
        </select>

        <button type='button'
          onClick={onSave}
          disabled={!canSave}
        >
          Update Post
        </button>

        <button type='button'
          className='deleteButton'
          onClick={onDeletePost}
        >
          Delete Post
        </button>
      </form>
    </section>
  )
}

export default EditPostForm
