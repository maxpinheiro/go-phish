import { PreviousGuess } from '@/components/guesses/GuessSelectorModal';
import { RunWithISODates } from '@/models/run.model';
import { ShowWithISODates, ShowWithRun } from '@/models/show.model';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
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

// const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
// const [loading, setLoading] = useState(false);
// const [suggestModalOpen, setModalOpen] = useState(false);
// const [helpTextOpen, setHelpTextOpen] = useState(true);
// const [missingTextOpen, setMissingTextOpen] = useState(true);
// const [guessSelectorOpen, setGuessSelectorOpen] = useState(false);
// const [previousGuesses, setPreviousGuesses] = useState<PreviousGuess[] | null>(null);

const initialState: GuessEditorState = {
  show: null,
  selectedSongId: null,
  suggestModalOpen: false,
  helpTextOpen: true,
  missingTextOpen: true,
  guessSelectorOpen: false,
  previousGuesses: null,
};

// setSelectedSongId
// setLoading
// setModalOpen
// setHelpTextOpen
// setMissingTextOpen
// setGuessSelectorOpen
// setPreviousGuesses

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
    ...show,
    date: new Date(show.date),
    timestamp: new Date(show.timestamp),
    run: {
      ...show.run,
      dates: show.run.dates.map((d) => new Date(d)),
    },
  };
};

export default guessEditorSlice.reducer;
