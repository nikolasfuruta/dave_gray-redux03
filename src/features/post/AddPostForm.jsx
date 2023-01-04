import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

//import { postAdd } from './postSlice';
import { selectAllUsers } from '../user/usersSlice';
import { addNewPost } from './postSlice';

const AddPostForm = () => {
  const navigate = useNavigate();

  const [title,setTitle] = useState('');
  const [content,setContent] = useState('');
  const [userId, setUserId] = useState('')
  const [addRequestStatus, setAddRequestStatus] = useState('idle');
  
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);

  const onTitleChange = (e) => { setTitle(e.target.value) }
  const onContentChange = (e) => { setContent(e.target.value) }
  const onAuthorChange = (e) => { setUserId(e.target.value) }

  const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle'

  const onSavePostClick = () => {
    if(canSave) {
      try{
        setAddRequestStatus('pending');
        dispatch(addNewPost({ title, body: content, userId })).unwrap();
        setTitle('');
        setContent('');
        setUserId('');
        navigate('/')
      }
      catch(e){
        console.log('Failed to save the post', e);
      }
      finally{
        setAddRequestStatus('idle');
      }
    }
  }


  const usersOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>Add New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input type="text" 
          id='postTitle'
          name='postTitle'
          value={title}
          onChange={onTitleChange}
        />

        <label htmlFor="postContent">Post Content:</label>
        <input type="text" 
          id='postContent'
          name='postContent'
          value={content}
          onChange={onContentChange}
        />

        <label htmlFor="postAuthor">Author:</label>
        <select name="postAuthor" 
          id="postAuthor"
          value={userId}
          onChange={onAuthorChange}
        >
          <option value=""></option>
          {usersOptions}
        </select>

        <button type='button' 
          onClick={ onSavePostClick }
          disabled={ !canSave ? true : false }
        >
          Add Post
        </button>
      </form>
    </section>
  );
}

export default AddPostForm