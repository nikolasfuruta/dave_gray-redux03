import { Routes, Route, Navigate } from 'react-router-dom';
import LayOut from './components/LayOut';
import SinglePostPage from './features/post/SinglePostPage';
import PostsList from './features/post/PostsList';
import AddPostForm from './features/post/AddPostForm';
import EditPostForm from './features/post/EditPostForm'
import UsersList from './features/user/UsersList';
import UserPage from './features/user/UserPage';


function App() {
  return (
    <Routes>
      <Route path='/' element={ <LayOut/> }>
      
        <Route index element={ <PostsList/> }/>

        <Route path='post'>
          <Route index element={ <AddPostForm/> }/>
          <Route path=':postId' element={ <SinglePostPage /> }/>
          <Route path='edit/:postId' element={ <EditPostForm /> }/>
        </Route>

        <Route path='user'>
          <Route index element={ <UsersList /> }/>
          <Route path=':userId' element={ <UserPage /> }/>
        </Route>

        <Route path='*' element={ <Navigate to={'/'} replace/> }/>

      </Route>
    </Routes>
  )
}

export default App;
