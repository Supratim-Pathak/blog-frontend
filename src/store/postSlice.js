import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ page = 1, limit = 5, search = '' } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ page, limit });
      if (search) params.set('search', search);
      const response = await api.get(`/posts?${params.toString()}`);
      // mongoose-paginate-v2 returns { docs, totalDocs, limit, page, totalPages, ... }
      return {
        docs: response.data.docs || [],
        totalPages: response.data.totalPages || 1,
        page: response.data.page || 1,
        totalDocs: response.data.totalDocs || 0,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const fetchPostById = createAsyncThunk('posts/fetchPostById', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const createPost = createAsyncThunk('posts/createPost', async (postData, { rejectWithValue }) => {
  try {
    const response = await api.post('/posts', postData);
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const updatePost = createAsyncThunk('posts/updatePost', async ({ id, postData }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const deletePost = createAsyncThunk('posts/deletePost', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/posts/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const addComment = createAsyncThunk('posts/addComment', async ({ id, commentData }, { rejectWithValue }) => {
  try {
    await api.post(`/posts/${id}/comments`, commentData);
    const postResponse = await api.get(`/posts/${id}`);
    return { id, comments: postResponse.data.data.comments };
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    currentPost: null,
    loading: false,
    error: null,
    // pagination
    totalPages: 1,
    currentPage: 1,
    totalDocs: 0,
  },
  reducers: {
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.docs;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.page;
        state.totalDocs = action.payload.totalDocs;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.posts = [];
        state.error = action.payload?.message || 'Failed to fetch posts';
      })
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        if (action.payload) {
          state.posts = [action.payload, ...(state.posts || [])];
        }
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.posts.findIndex((p) => p._id === action.payload._id);
          if (index !== -1) state.posts[index] = action.payload;
          if (state.currentPost?._id === action.payload._id) state.currentPost = action.payload;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p._id !== action.payload);
      })
      .addCase(addComment.fulfilled, (state, action) => {
        if (state.currentPost?._id === action.payload.id) {
          state.currentPost.comments = action.payload.comments;
        }
      });
  },
});

export const { clearCurrentPost } = postSlice.actions;
export default postSlice.reducer;
