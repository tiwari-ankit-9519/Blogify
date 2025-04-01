import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  comment: null,
  error: null,
  loading: false,
};

export const createComment = createAsyncThunk(
  "comment/createComment",
  async ({ slug, content, postId, parentId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/comments/blogs/${slug}/comments`,
        { content, postId, parentId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comment/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `comments/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const createCommentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.comment = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comment = action.payload;
        state.error = null;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.comment = null;
      });

    builder
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.comment = null;
      })
      .addCase(deleteComment.fulfilled, (state) => {
        state.loading = false;
        state.comment = null;
        state.error = null;
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.comment = null;
      });
  },
});

export default createCommentSlice.reducer;
