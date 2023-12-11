import { suggestSong } from '@/client/song.client';
import { ResponseStatus } from '@/types/main';
import React, { useState } from 'react';
import LoadingSpinner from '../shared/LoadingSpinner';
import CloseIcon from '@/media/CloseIcon.svg';
import LoadingOverlay from '../shared/LoadingOverlay';
import { useThemeContext } from '@/store/theme.store';
import { desaturateColor } from '@/utils/color.util';

interface SongSuggestModalProps {
  close: () => void;
}

const SongSuggestModal: React.FC<SongSuggestModalProps> = ({ close }) => {
  const [songInput, setSongInput] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error' | 'success'>('loaded');
  const [error, setError] = useState<string | null>(null);
  const { color, hexColor } = useThemeContext();
  const desatColor = desaturateColor(hexColor, 0.5);

  const submitSuggestion = async () => {
    if (!songInput || songInput === '') return;
    setStatus('loading');
    const result = await suggestSong(songInput);
    if (result === ResponseStatus.Success) {
      setStatus('success');
      setTimeout(() => setStatus('loaded'));
    } else {
      setError('An unknown error occurred.');
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col items-center w-full relative">
      <div onClick={close} className="absolute top-1 right-1">
        <CloseIcon width={20} height={20} />
      </div>
      <p className="text-2xl text-center mb-4">Suggest a Song</p>
      {status === 'loading' && <LoadingSpinner color={hexColor} secondaryColor={desatColor} />}
      {status === 'error' && <p className="mb-3 text-error-red">{error || 'An unknown error occurred.'}</p>}
      {status === 'success' && <p className={`mb-3 text-${color}`}>Successfully suggested song!</p>}
      <p className="text-center px-2.5">
        If you think we&apos;re missing a song, we very likely could be! We currently have to manually upload the list
        of available songs, which means there are covers and infrequent songs that get forgotten. Please send us your
        suggestion so it can be added!
      </p>
      <div className="flex items-center my-4">
        <p className="mr-2.5 w-max">Song Title: </p>
        <input
          className={`flex flex-1 rounded bg-${color}/10 border border-${color} px-2.5 py-1`}
          type="text"
          value={songInput || ''}
          onChange={(e) => setSongInput(e.target.value)}
          placeholder="Song Name"
        />
      </div>
      <button onClick={submitSuggestion} disabled={status === 'loading'} className="auth-button">
        <p className="m-0 ">Submit</p>
      </button>
    </div>
  );
};

export default SongSuggestModal;
