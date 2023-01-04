import { createSlice, createAsyncThunk, createSelector, createEntityAdapter  } from "@reduxjs/toolkit";
import {sub} from "date-fns";
import axios from "axios";

const POSTS_URL='https://jsonplaceholder.typicode.com/posts';

// const initialState = {
//   posts: [],
//   status: 'idle',//'loading','succeeded','failed'
//   error: null,
//   count: 0
// }

//normalization
const postsAdapter = createEntityAdapter({
  sortComparer: (a,b) => b.date.localeCompare(a.date)
});

const initialState = postsAdapter.getInitialState({
  status: 'idle',
  error: null,
  count: 0
});

//async thunk
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  try{
    const response = await axios.get(POSTS_URL);
    return response.data;
  }
  catch(e) {
    return e.message;
  }
});

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
  try{
    const response = await axios.post(POSTS_URL, initialPost);
    return response.data;
  }
  catch(e) {
    return e.message;
  }
});

export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost) => {
  const { id } = initialPost;
  try{
    const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
    return response.data;
  }
  catch(e) {
    return e.message;
  }
});

export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost) => {
  const { id } = initialPost;
  try{
    const response = await axios.delete(`${POSTS_URL}/${id}`);
    if(response.status === 200) return initialPost;
    return `${response.status}: ${response.statusText}`
  }
  catch(e){
    return e.message
  }
});

const postsSlice = createSlice({
  name:'posts',
  initialState,
  reducers:{
    reactionAdd: (state, action) => {
      const {postId, reactionName} = action.payload;
      //const isPostExist = state.posts.find(post => post.id === postId);

      //with normalization
      const isPostExist = state.entities[postId]
      if(isPostExist) isPostExist.reactions[reactionName]++
    },
    increaseCount: (state, action) => {
      state.count = state.count + 1;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state,action) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state,action) => {
        state.status = 'succeeded';
        //add date and reaction
        let min = 1;
        const loadedPosts = action.payload.map(post => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString()
          post.reactions = {
            thumb: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
          }
          return post;
        });

        //add fetched posts to the array
        //state.posts = state.posts.concat(loadedPosts);

        //with normalization
        postsAdapter.upsertMany(state, loadedPosts)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        //START fix for fake API post IDs 
        const sortedPosts = state.posts.sort((a,b) => {
          if(a.id > b.id) return 1 
          if(a.id < b.id) return -1
          return 0 
        })
        action.payload.id = sortedPosts[sortedPosts.length-1].id + 1
        //End fix for fake API post IDs 

        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumb: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0
        }
        //state.posts.push(action.payload);
        //normalization
        postsAdapter.addOne(state, action.payload)
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if(!action.payload.id) {
          console.log('Update could not complete');
          console.log(action.payload);
          return
        }
        //const { id } = action.payload;
        action.payload.date = new Date().toISOString();
        //const posts = state.posts.filter(post => post.id !== id);
        //state.posts = [...posts, action.payload];

        //normalization
        postsAdapter.upsertOne(state, action.payload)
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if(!action.payload.id) {
          console.log('Delete could not complete');
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        //const posts = state.posts.filter(post => post.id !== id);
        //state.posts = posts;

        //normalization
        postsAdapter.removeOne(state, id);
      })
  }
});


//selectors
//export const selectAllPosts = (state) => state.posts.posts;
// export const selectPostById = (state, postId) => 
//   state.posts.posts.find(post => post.id === postId);

export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;

//memoize selectors
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostsIds
} = postsAdapter.getSelectors(state => state.posts)

export const selectPostByUser = createSelector(
  [selectAllPosts, (state, userId)=>userId],//input functions
  (posts,userId) => posts.filter(post => post.userId === userId)
);


export const { increaseCount, reactionAdd } = postsSlice.actions

export default postsSlice.reducer