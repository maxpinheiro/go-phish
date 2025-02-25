import { PreviousGuess } from '@/components/guesses/GuessSelectorModal';
import { buildRunFromISODates, RunWithISODates } from '@/models/run.model';
import { buildShowFromISODates, ShowWithISODates, ShowWithRun } from '@/models/show.model';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState } from './app.store';

export type ShowWithRunWithISODates = ShowWithISODates & { run: RunWithISODates };

export interface GuessEditorState {
  show: ShowWithRunWithISODates | null;
  selectedSongId: string | null;
  suggestModalOpen: boolean;
  helpTextOpen: boolean;
  missingTextOpen: boolean;
  guessSelectorOpen: boolean;
  previousGuesses: PreviousGuess[] | null;
}

const initialState: GuessEditorState = {
  show: null,
  selectedSongId: null,
  suggestModalOpen: false,
  helpTextOpen: true,
  missingTextOpen: true,
  guessSelectorOpen: false,
  previousGuesses: null,
};

export const guessEditorSlice = createSlice({
  name: 'guessEditor',
  initialState,
  reducers: {
    setShow(state, action: PayloadAction<ShowWithRunWithISODates>) {
      state.show = action.payload;
    },
  },
});

export const { setShow } = guessEditorSlice.actions;

export const selectShow = (state: AppState): ShowWithRun | null => {
  const show = state.guessEditor.show;
  if (!show) return null;
  return {
    ...buildShowFromISODates(show),
    run: buildRunFromISODates(show.run),
  };
};

export default guessEditorSlice.reducer;
