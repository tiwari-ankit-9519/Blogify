/* eslint-disable no-unused-vars */
import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  blogs: {
    data: [],
    isLoading: false,
    error: null,
  },
  singleBlog: {
    data: {},
    isLoading: false,
    error: null,
    likeStatus: {
      isLoading: false,
      error: null,
    },
  },
  latestBlogs: {
    data: [],
    isLoading: false,
    error: null,
  },
  trendingBlogs: {
    data: [],
    isLoading: false,
    error: null,
  },
  relatedBlogs: {
    data: [],
    isLoading: false,
    error: null,
  },
  categories: {
    data: [],
    isLoading: false,
    error: null,
  },
};

export const fetchAllBlogs = createAsyncThunk(
  "blog/fetchAllBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("blogs/all");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blogs"
      );
    }
  }
);

export const fetchSingleBlog = createAsyncThunk(
  "blog/fetchSingleBlog",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`blogs/blog/${slug}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blog"
      );
    }
  }
);

export const fetchLatestBlogs = createAsyncThunk(
  "blog/fetchLatestBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("blogs/latest-blogs");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch latest blogs"
      );
    }
  }
);

export const fetchTrendingBlogs = createAsyncThunk(
  "blog/fetchTrendingBlogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("blogs/trending");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch trending blogs"
      );
    }
  }
);

export const fetchRelatedBlogs = createAsyncThunk(
  "blog/fetchRelatedBlogs",
  async (blogId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`blogs/related-blogs/${blogId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch related blogs"
      );
    }
  }
);

export const toggleLikeBlog = createAsyncThunk(
  "blog/toggleLike",
  async (slug, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await axiosInstance.post(
        `blogs/blog/like/${slug}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to like blog";
      return rejectWithValue(errorMessage);
    }
  }
);

export const checkLikeStatus = createAsyncThunk(
  "blog/checkLikeStatus",
  async (slug, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return {
          status: "success",
          data: {
            liked: false,
            likesCount: 0,
          },
        };
      }

      const response = await axiosInstance.get(
        `blogs/blog/like-status/${slug}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return {
          status: "success",
          data: {
            liked: false,
            likesCount: 0,
          },
        };
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to check like status"
      );
    }
  }
);

export const searchBlogs = createAsyncThunk(
  "blog/searchBlogs",
  async (query, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`blogs/search?query=${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search blogs"
      );
    }
  }
);

export const fetchFilteredBlogs = createAsyncThunk(
  "blog/fetchFilteredBlogs",
  async (name, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `blogs/category-search?query=${name}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to filter blogs by category"
      );
    }
  }
);

export const fetchAllCategories = createAsyncThunk(
  "blog/fetchAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("blogs/all-category");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearLikeStatus: (state) => {
      if (state.singleBlog.data) {
        state.singleBlog.data.isLikedByCurrentUser = false;
      }
    },
    resetBlogState: (state) => {
      return initialState;
    },
    setBlogs: (state, action) => {
      state.blogs.data = action.payload;
      state.blogs.isLoading = false;
      state.blogs.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBlogs.pending, (state) => {
        state.blogs.isLoading = true;
        state.blogs.error = null;
      })
      .addCase(fetchAllBlogs.fulfilled, (state, action) => {
        state.blogs.data = action.payload;
        state.blogs.isLoading = false;
        state.blogs.error = null;
      })
      .addCase(fetchAllBlogs.rejected, (state, action) => {
        state.blogs.error = action.payload;
        state.blogs.isLoading = false;
      });

    builder
      .addCase(fetchSingleBlog.pending, (state) => {
        state.singleBlog.isLoading = true;
        state.singleBlog.error = null;
        state.singleBlog.data = null;
      })
      .addCase(fetchSingleBlog.fulfilled, (state, action) => {
        state.singleBlog.data = action.payload;
        state.singleBlog.isLoading = false;
        state.singleBlog.error = null;
      })
      .addCase(fetchSingleBlog.rejected, (state, action) => {
        state.singleBlog.error = action.payload;
        state.singleBlog.isLoading = false;
        state.singleBlog.data = null;
      });

    builder
      .addCase(toggleLikeBlog.pending, (state) => {
        state.singleBlog.likeStatus.isLoading = true;
        state.singleBlog.likeStatus.error = null;
      })
      .addCase(toggleLikeBlog.fulfilled, (state, action) => {
        state.singleBlog.likeStatus.isLoading = false;
        state.singleBlog.likeStatus.error = null;

        if (state.singleBlog.data && action.payload?.data) {
          const { liked, likesCount } = action.payload.data;
          state.singleBlog.data.isLikedByCurrentUser = liked;
          state.singleBlog.data.likesCount = likesCount;
        }
      })
      .addCase(toggleLikeBlog.rejected, (state, action) => {
        state.singleBlog.likeStatus.isLoading = false;
        state.singleBlog.likeStatus.error = action.payload;
      });

    builder
      .addCase(checkLikeStatus.pending, (state) => {})
      .addCase(checkLikeStatus.fulfilled, (state, action) => {
        if (action.payload?.data) {
          const { liked, likesCount } = action.payload.data;

          if (
            state.singleBlog.data &&
            Object.keys(state.singleBlog.data).length > 0
          ) {
            state.singleBlog.data.isLikedByCurrentUser = liked;

            if (typeof likesCount === "number") {
              state.singleBlog.data.likesCount = likesCount;
            }
          }
        }
      })
      .addCase(checkLikeStatus.rejected, (state) => {});

    builder
      .addCase(fetchTrendingBlogs.pending, (state) => {
        state.trendingBlogs.isLoading = true;
        state.trendingBlogs.error = null;
      })
      .addCase(fetchTrendingBlogs.fulfilled, (state, action) => {
        state.trendingBlogs.data = action.payload;
        state.trendingBlogs.isLoading = false;
        state.trendingBlogs.error = null;
      })
      .addCase(fetchTrendingBlogs.rejected, (state, action) => {
        state.trendingBlogs.error = action.payload;
        state.trendingBlogs.isLoading = false;
      });

    builder
      .addCase(fetchLatestBlogs.pending, (state) => {
        state.latestBlogs.isLoading = true;
        state.latestBlogs.error = null;
      })
      .addCase(fetchLatestBlogs.fulfilled, (state, action) => {
        state.latestBlogs.data = action.payload;
        state.latestBlogs.isLoading = false;
        state.latestBlogs.error = null;
      })
      .addCase(fetchLatestBlogs.rejected, (state, action) => {
        state.latestBlogs.error = action.payload;
        state.latestBlogs.isLoading = false;
      });

    builder
      .addCase(fetchRelatedBlogs.pending, (state) => {
        state.relatedBlogs.isLoading = true;
        state.relatedBlogs.error = null;
      })
      .addCase(fetchRelatedBlogs.fulfilled, (state, action) => {
        state.relatedBlogs.data = action.payload;
        state.relatedBlogs.isLoading = false;
        state.relatedBlogs.error = null;
      })
      .addCase(fetchRelatedBlogs.rejected, (state, action) => {
        state.relatedBlogs.error = action.payload;
        state.relatedBlogs.isLoading = false;
      });

    // Handle search blogs
    builder
      .addCase(searchBlogs.pending, (state) => {
        state.blogs.isLoading = true;
        state.blogs.error = null;
      })
      .addCase(searchBlogs.fulfilled, (state, action) => {
        state.blogs.data = action.payload;
        state.blogs.isLoading = false;
        state.blogs.error = null;
      })
      .addCase(searchBlogs.rejected, (state, action) => {
        state.blogs.isLoading = false;
        state.blogs.error = action.payload;
      });

    // Handle filtered blogs by category
    builder
      .addCase(fetchFilteredBlogs.pending, (state) => {
        state.blogs.isLoading = true;
        state.blogs.error = null;
      })
      .addCase(fetchFilteredBlogs.fulfilled, (state, action) => {
        state.blogs.data = action.payload;
        state.blogs.isLoading = false;
        state.blogs.error = null;
      })
      .addCase(fetchFilteredBlogs.rejected, (state, action) => {
        state.blogs.isLoading = false;
        state.blogs.error = action.payload;
      });

    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.categories.isLoading = true;
        state.categories.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.categories.data = action.payload;
        state.categories.isLoading = false;
        state.categories.error = null;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.categories.isLoading = false;
        state.categories.error = action.payload;
      });
  },
});

export const { clearLikeStatus, resetBlogState, setBlogs } = blogSlice.actions;

export default blogSlice.reducer;
