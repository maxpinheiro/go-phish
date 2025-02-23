import { ShowEditorSection } from '@/components/admin/shows/ShowEditor';
import { ShowWithVenueAndRun } from '@/models/show.model';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppState } from '../app.store';

export interface ShowModeratorState {
  selectedShow: ShowWithVenueAndRun | null;
  openSection: ShowEditorSection | null;
}

const initialState: ShowModeratorState = {
  selectedShow: null,
  openSection: null,
};

export const showModeratorSlice = createSlice({
  name: 'showModerator',
  initialState,
  reducers: {
    setSelectedShow(state, action: PayloadAction<ShowWithVenueAndRun | null>) {
      state.selectedShow = action.payload;
    },
    setOpenSection(state, action: PayloadAction<ShowEditorSection | null>) {
      state.openSection = action.payload;
    },
  },
});

export const { setSelectedShow, setOpenSection } = showModeratorSlice.actions;

export const selectSelectedShow = (state: AppState) => state.showModerator.selectedShow;
export const selectOpenSection = (state: AppState) => state.showModerator.openSection;

export const reducer = showModeratorSlice.reducer;
