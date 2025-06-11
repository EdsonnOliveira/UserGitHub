import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchUser, getUserRepos, getRepoDetails } from '../services/githubService';

export const fetchUser = createAsyncThunk(
  'github/fetchUser',
  async (username) => {
    const response = await searchUser(username);
    return response;
  }
);

export const fetchUserRepos = createAsyncThunk(
  'github/fetchUserRepos',
  async ({ username, sort = 'stars' }) => {
    const response = await getUserRepos(username, sort);
    return response;
  }
);

export const fetchRepoDetails = createAsyncThunk(
  'github/fetchRepoDetails',
  async ({ owner, repo }) => {
    const response = await getRepoDetails(owner, repo);
    return response;
  }
);

const githubSlice = createSlice({
  name: 'github',
  initialState: {
    user: null,
    repos: [],
    selectedRepo: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUserRepos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRepos.fulfilled, (state, action) => {
        state.loading = false;
        state.repos = action.payload;
      })
      .addCase(fetchUserRepos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchRepoDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRepoDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRepo = action.payload;
      })
      .addCase(fetchRepoDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError } = githubSlice.actions;
export default githubSlice.reducer; 