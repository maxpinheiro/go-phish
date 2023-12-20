import { suggestFeedback } from '@/client/feedback.client';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import { useThemeContext } from '@/store/theme.store';
import { ResponseStatus } from '@/types/main';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const FeedbackPage: React.FC = () => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { color } = useThemeContext();

  const submitFeedback = async () => {
    if (!feedback) return;

    setLoading(true);
    const result = await suggestFeedback(feedback);
    if (result === ResponseStatus.Success) {
      toast.success('Successfully submitted feedback!', { duration: 3000 });
      setFeedback(null);
    } else {
      toast.error('An unknown error occurred.', { duration: 3000 });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-title-regular my-4">Feedback/Bugs</p>
      {loading && <LoadingOverlay />}
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
          disabled={loading}
          className={`border border-${color} rounded-lg w-max mx-auto px-3 py-1.5`}
        >
          <p className="">Submit</p>
        </button>
      </div>
    </div>
  );
};

export default FeedbackPage;
