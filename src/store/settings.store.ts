import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppState } from './app.store';

// Type for our state
export interface SettingsState {
  sideNavOpen: boolean;
}

// Initial state
const initialState: SettingsState = {
  sideNavOpen: false,
};

// Actual Slice
export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSideNavOpen(state, action: PayloadAction<boolean>) {
      state.sideNavOpen = action.payload;
    },
  },
});

export const { setSideNavOpen } = settingsSlice.actions;

export const selectSideNavOpen = (state: AppState) => state.settings.sideNavOpen;

export default settingsSlice.reducer;
