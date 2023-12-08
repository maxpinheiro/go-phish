import { Action, createSlice } from '@reduxjs/toolkit';
import { AppState } from './app.store';
import { HYDRATE } from 'next-redux-wrapper';
import { User } from '@prisma/client';
import { AvatarConfig, ResponseStatus } from '@/types/main';
import { updateUser } from '@/client/user.client';
import { defaultAvatar } from '@/models/user.model';

// Type for our state
export interface ProfileState {
  userId: number | null;
  editing: boolean;
  name: string;
  bio: string;
  hometown: string;
  avatar: AvatarConfig;
  avatarModalOpen: boolean;
  updatedUser: User | null;
  error: string | null;
}

// Initial state
const initialState: ProfileState = {
  userId: null,
  editing: false,
  name: '',
  bio: '',
  hometown: '',
  avatar: defaultAvatar,
  avatarModalOpen: false,
  updatedUser: null,
  error: null,
};

// Actual Slice
export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setUserId(state, action) {
      state.userId = action.payload;
    },
    setEditing(state, action) {
      state.editing = action.payload;
    },
    setName(state, action) {
      state.name = action.payload;
    },
    setBio(state, action) {
      state.bio = action.payload;
    },
    setHometown(state, action) {
      state.hometown = action.payload;
    },
    setAvatar(state, action) {
      state.avatar = action.payload;
    },
    setAvatarModalOpen(state, action) {
      state.avatarModalOpen = action.payload;
    },
    saveProfile(state) {
      const userData = {
        name: state.name,
        bio: state.bio,
        hometown: state.hometown,
      };
      if (state.userId === null) return;
      try {
        updateUser(state.userId, userData).then((newUser) => {
          if (newUser === ResponseStatus.Unauthorized) {
            state.error = `You are not authorized to edit this account!`;
          } else if (newUser === ResponseStatus.UnknownError) {
            state.error = 'An unknown error occurred. Please try again or refresh the page.';
          } else {
            state.updatedUser = newUser;
            state.editing = false;
          }
        });
      } catch {
        state.error = 'An unknown error occurred. Please try again or refresh the page.';
      }
    },
    resetProfile(state) {
      state.userId = null;
      state.name = '';
      state.bio = '';
      state.hometown = '';
      state.avatar = defaultAvatar;
      state.avatarModalOpen = false;
      state.editing = false;
      state.updatedUser = null;
      state.error = null;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
  },
});

export const {
  setUserId,
  setEditing,
  setBio,
  setName,
  setHometown,
  setAvatar,
  setAvatarModalOpen,
  saveProfile,
  resetProfile,
} = profileSlice.actions;

export const selectUserId = (state: AppState) => state.profile.userId;
export const selectEditing = (state: AppState) => state.profile.editing;
export const selectName = (state: AppState) => state.profile.name;
export const selectBio = (state: AppState) => state.profile.bio;
export const selectHometown = (state: AppState) => state.profile.hometown;
export const selectAvatar = (state: AppState) => state.profile.avatar;
export const selectAvatarModalOpen = (state: AppState) => state.profile.avatarModalOpen;
export const selectUpdatedUser = (state: AppState) => state.profile.updatedUser;
export const selectError = (state: AppState) => state.profile.error;

export default profileSlice.reducer;
