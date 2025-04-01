import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import authReducer from "@/features/authSlice";
import blogReducer from "@/features/blogSlice";
import createBlogReducer from "@/features/createBlogSlice";
import commentsReducer from "@/features/createComment";
import adminReducer from "@/features/adminSlice";

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  blogs: blogReducer,
  createBlog: createBlogReducer,
  comments: commentsReducer,
  admin: adminReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
