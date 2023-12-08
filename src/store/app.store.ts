import { configureStore } from '@reduxjs/toolkit';
import { profileSlice } from './profile.store';
import { settingsSlice } from './settings.store';

export const store = configureStore({
  reducer: {
    [profileSlice.name]: profileSlice.reducer,
    [settingsSlice.name]: settingsSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
