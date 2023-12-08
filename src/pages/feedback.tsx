import { suggestFeedback } from '@/client/feedback.client';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useThemeContext } from '@/store/theme.store';
import { ResponseStatus } from '@/types/main';
import React, { useState } from 'react';

const FeedbackPage: React.FC = () => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error' | 'success'>('loaded');
  const [error, setError] = useState<string | null>(null);
  const { color } = useThemeContext();

  const submitFeedback = async () => {
    if (!feedback) return;

    setStatus('loading');
    const result = await suggestFeedback(feedback);
    if (result === ResponseStatus.Success) {
      setStatus('success');
      setTimeout(() => setStatus('loaded'));
    } else {
      setError('An unknown error occurred.');
      setStatus('error');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-title-regular my-4">Feedback/Bugs</p>
      {status === 'loading' && <LoadingSpinner />}
      {status === 'error' && <p className="mb-3 text-error-red">{error || 'An unknown error occurred.'}</p>}
      {status === 'success' && <p className={`mb-3 text-${color}`}>Successfully submitted feedback!</p>}
      <div className="flex flex-col mx-5">
        <p className="">
          Please let us know if you find any bugs or have any other feedback on how we can improve the site!
        </p>
        <textarea
          className={`flex flex-1 rounded-lg bg-${color}/10 border border-${color} px-2.5 py-1 my-4`}
          rows={5}
          value={feedback || ''}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Feedback"
        />
        <button
          onClick={submitFeedback}
          disabled={status === 'loading'}
          className={`border border-${color} rounded-lg w-max mx-auto px-3 py-1.5`}
        >
          <p className="">Submit</p>
        </button>
      </div>
    </div>
  );
};

export default FeedbackPage;
