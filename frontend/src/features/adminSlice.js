import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

const BASE_URL = "/admin";

// Async thunks for users
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async ({ page = 1, limit = 20, search = "" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/users?page=${page}&limit=${limit}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserById = createAsyncThunk(
  "admin/getUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/users/${userId}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return { userId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Blog Management
export const fetchAllBlogsAdmin = createAsyncThunk(
  "admin/fetchAllBlogsAdmin",
  async (
    { page = 1, limit = 20, status, category, search = "" },
    { rejectWithValue }
  ) => {
    try {
      let url = `${BASE_URL}/blogs?page=${page}&limit=${limit}`;
      if (status) url += `&status=${status}`;
      if (category) url += `&category=${category}`;
      if (search) url += `&search=${search}`;

      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getBlogById = createAsyncThunk(
  "admin/getBlogById",
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/blogs/${blogId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleBlogPublish = createAsyncThunk(
  "admin/toggleBlogPublish",
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/blogs/${blogId}/publish`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "admin/deleteBlog",
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}/blogs/${blogId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return { blogId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Category Management
export const getAllCategories = createAsyncThunk(
  "admin/getAllCategories",
  async ({ page = 1, limit = 20, search = "" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/categories?page=${page}&limit=${limit}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getCategoryById = createAsyncThunk(
  "admin/getCategoryById",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createCategory = createAsyncThunk(
  "admin/createCategory",
  async (name, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/categories`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "admin/updateCategory",
  async ({ categoryId, name }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `${BASE_URL}/categories/${categoryId}`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "admin/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}/categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return { categoryId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Comment Management
export const getAllComments = createAsyncThunk(
  "admin/getAllComments",
  async ({ page = 1, limit = 50, search = "" }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/comments?page=${page}&limit=${limit}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getCommentById = createAsyncThunk(
  "admin/getCommentById",
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "admin/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `${BASE_URL}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return { commentId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Analytics
export const getSystemAnalytics = createAsyncThunk(
  "admin/getSystemAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/analytics`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  users: {
    data: [],
    selected: null,
    meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
    loading: false,
    error: null,
  },
  blogs: {
    data: [],
    selected: null,
    meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
    loading: false,
    error: null,
  },
  categories: {
    data: [],
    selected: null,
    meta: { total: 0, page: 1, limit: 20, totalPages: 0 },
    loading: false,
    error: null,
  },
  comments: {
    data: [],
    selected: null,
    meta: { total: 0, page: 1, limit: 50, totalPages: 0 },
    loading: false,
    error: null,
  },
  analytics: {
    stats: {
      users: 0,
      blogs: 0,
      comments: 0,
      likes: 0,
      categories: 0,
    },
    popularBlogs: [],
    activeUsers: [],
    recentComments: [],
    loading: false,
    error: null,
  },
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.users.error = null;
      state.blogs.error = null;
      state.categories.error = null;
      state.comments.error = null;
      state.analytics.error = null;
    },
    clearSelectedEntities: (state) => {
      state.users.selected = null;
      state.blogs.selected = null;
      state.categories.selected = null;
      state.comments.selected = null;
    },
  },
  extraReducers: (builder) => {
    // Users reducers
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.data = action.payload.data;
        state.users.meta = action.payload.meta;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.payload?.message || "Failed to fetch users";
      })
      .addCase(getUserById.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.selected = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.payload?.message || "Failed to fetch user";
      })
      .addCase(updateUser.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.data = state.users.data.map((user) =>
          user.id === action.payload.id ? { ...user, ...action.payload } : user
        );
        if (
          state.users.selected &&
          state.users.selected.id === action.payload.id
        ) {
          state.users.selected = { ...state.users.selected, ...action.payload };
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.payload?.message || "Failed to update user";
      })
      .addCase(deleteUser.pending, (state) => {
        state.users.loading = true;
        state.users.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.data = state.users.data.filter(
          (user) => user.id !== action.payload.userId
        );
        if (
          state.users.selected &&
          state.users.selected.id === action.payload.userId
        ) {
          state.users.selected = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.payload?.message || "Failed to delete user";
      })

      // Blogs reducers
      .addCase(fetchAllBlogsAdmin.pending, (state) => {
        state.blogs.loading = true;
        state.blogs.error = null;
      })
      .addCase(fetchAllBlogsAdmin.fulfilled, (state, action) => {
        state.blogs.loading = false;
        state.blogs.data = action.payload.data;
        state.blogs.meta = action.payload.meta;
      })
      .addCase(fetchAllBlogsAdmin.rejected, (state, action) => {
        state.blogs.loading = false;
        state.blogs.error = action.payload?.message || "Failed to fetch blogs";
      })
      .addCase(getBlogById.pending, (state) => {
        state.blogs.loading = true;
        state.blogs.error = null;
      })
      .addCase(getBlogById.fulfilled, (state, action) => {
        state.blogs.loading = false;
        state.blogs.selected = action.payload;
      })
      .addCase(getBlogById.rejected, (state, action) => {
        state.blogs.loading = false;
        state.blogs.error = action.payload?.message || "Failed to fetch blog";
      })
      .addCase(toggleBlogPublish.pending, (state) => {
        state.blogs.loading = true;
        state.blogs.error = null;
      })
      .addCase(toggleBlogPublish.fulfilled, (state, action) => {
        state.blogs.loading = false;
        state.blogs.data = state.blogs.data.map((blog) =>
          blog.id === action.payload.id
            ? { ...blog, published: action.payload.published }
            : blog
        );
        if (
          state.blogs.selected &&
          state.blogs.selected.id === action.payload.id
        ) {
          state.blogs.selected = {
            ...state.blogs.selected,
            published: action.payload.published,
          };
        }
      })
      .addCase(toggleBlogPublish.rejected, (state, action) => {
        state.blogs.loading = false;
        state.blogs.error =
          action.payload?.message || "Failed to toggle blog publish status";
      })
      .addCase(deleteBlog.pending, (state) => {
        state.blogs.loading = true;
        state.blogs.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.blogs.loading = false;
        state.blogs.data = state.blogs.data.filter(
          (blog) => blog.id !== action.payload.blogId
        );
        if (
          state.blogs.selected &&
          state.blogs.selected.id === action.payload.blogId
        ) {
          state.blogs.selected = null;
        }
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.blogs.loading = false;
        state.blogs.error = action.payload?.message || "Failed to delete blog";
      })

      // Categories reducers
      .addCase(getAllCategories.pending, (state) => {
        state.categories.loading = true;
        state.categories.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.categories.loading = false;
        state.categories.data = action.payload.data;
        state.categories.meta = action.payload.meta;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.categories.loading = false;
        state.categories.error =
          action.payload?.message || "Failed to fetch categories";
      })
      .addCase(getCategoryById.pending, (state) => {
        state.categories.loading = true;
        state.categories.error = null;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.categories.loading = false;
        state.categories.selected = action.payload;
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.categories.loading = false;
        state.categories.error =
          action.payload?.message || "Failed to fetch category";
      })
      .addCase(createCategory.pending, (state) => {
        state.categories.loading = true;
        state.categories.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.loading = false;
        state.categories.data = [...state.categories.data, action.payload];
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.categories.loading = false;
        state.categories.error =
          action.payload?.message || "Failed to create category";
      })
      .addCase(updateCategory.pending, (state) => {
        state.categories.loading = true;
        state.categories.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categories.loading = false;
        state.categories.data = state.categories.data.map((category) =>
          category.id === action.payload.id ? action.payload : category
        );
        if (
          state.categories.selected &&
          state.categories.selected.id === action.payload.id
        ) {
          state.categories.selected = {
            ...state.categories.selected,
            ...action.payload,
          };
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.categories.loading = false;
        state.categories.error =
          action.payload?.message || "Failed to update category";
      })
      .addCase(deleteCategory.pending, (state) => {
        state.categories.loading = true;
        state.categories.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories.loading = false;
        state.categories.data = state.categories.data.filter(
          (category) => category.id !== action.payload.categoryId
        );
        if (
          state.categories.selected &&
          state.categories.selected.id === action.payload.categoryId
        ) {
          state.categories.selected = null;
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.categories.loading = false;
        state.categories.error =
          action.payload?.message || "Failed to delete category";
      })

      // Comments reducers
      .addCase(getAllComments.pending, (state) => {
        state.comments.loading = true;
        state.comments.error = null;
      })
      .addCase(getAllComments.fulfilled, (state, action) => {
        state.comments.loading = false;
        state.comments.data = action.payload.data;
        state.comments.meta = action.payload.meta;
      })
      .addCase(getAllComments.rejected, (state, action) => {
        state.comments.loading = false;
        state.comments.error =
          action.payload?.message || "Failed to fetch comments";
      })
      .addCase(getCommentById.pending, (state) => {
        state.comments.loading = true;
        state.comments.error = null;
      })
      .addCase(getCommentById.fulfilled, (state, action) => {
        state.comments.loading = false;
        state.comments.selected = action.payload;
      })
      .addCase(getCommentById.rejected, (state, action) => {
        state.comments.loading = false;
        state.comments.error =
          action.payload?.message || "Failed to fetch comment";
      })
      .addCase(deleteComment.pending, (state) => {
        state.comments.loading = true;
        state.comments.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments.loading = false;
        state.comments.data = state.comments.data.filter(
          (comment) => comment.id !== action.payload.commentId
        );
        if (
          state.comments.selected &&
          state.comments.selected.id === action.payload.commentId
        ) {
          state.comments.selected = null;
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.comments.loading = false;
        state.comments.error =
          action.payload?.message || "Failed to delete comment";
      })

      // Analytics reducers
      .addCase(getSystemAnalytics.pending, (state) => {
        state.analytics.loading = true;
        state.analytics.error = null;
      })
      .addCase(getSystemAnalytics.fulfilled, (state, action) => {
        state.analytics.loading = false;
        state.analytics.stats = action.payload.stats;
        state.analytics.popularBlogs = action.payload.popularBlogs;
        state.analytics.activeUsers = action.payload.activeUsers;
        state.analytics.recentComments = action.payload.recentComments;
      })
      .addCase(getSystemAnalytics.rejected, (state, action) => {
        state.analytics.loading = false;
        state.analytics.error =
          action.payload?.message || "Failed to fetch analytics";
      });
  },
});

export const { clearErrors, clearSelectedEntities } = adminSlice.actions;
export default adminSlice.reducer;
