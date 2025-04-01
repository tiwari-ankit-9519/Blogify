import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  newBlog: {
    data: null,
    isLoading: false,
    error: null,
  },
};

export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (blogData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/blogs/create-blog",
        blogData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data.slug;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const createBlogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBlog.pending, (state) => {
        state.newBlog.isLoading = true;
        state.newBlog.data = null;
        state.newBlog.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.newBlog.isLoading = false;
        state.newBlog.data = action.payload;
        state.newBlog.error = null;
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.newBlog.isLoading = false;
        state.newBlog.data = null;
        state.newBlog.error = action.payload;
      });
  },
});

export default createBlogSlice.reducer;
