import React, { useState } from 'react';
import toast from 'react-hot-toast';
import FeedbackForm from '@/components/feedback/FeedbackForm';
import FeedbackConfirmation from '@/components/feedback/FeedbackConfirmation';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import { suggestFeedback } from '@/client/feedback.client';
import { ResponseStatus } from '@/types/main';

const FeedbackContainer: React.FC = () => {
  const [submittedFeedback, setSubmittedFeedback] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitFeedback = async (feedback: string, contactInfo: string | null) => {
    if (!feedback) return;

    setLoading(true);
    const result = await suggestFeedback(feedback, contactInfo ?? undefined);
    if (result === ResponseStatus.Success) {
      toast.success('Successfully submitted feedback!', { duration: 3000 });
      setSubmittedFeedback(true);
    } else {
      toast.error('An unknown error occurred.', { duration: 3000 });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center mx-5">
      <p className="text-title-regular my-4">Feedback</p>
      {loading && <LoadingOverlay />}
      {submittedFeedback ? (
        <FeedbackConfirmation resubmit={() => setSubmittedFeedback(false)} />
      ) : (
        <FeedbackForm submit={submitFeedback} />
      )}
    </div>
  );
};

export default FeedbackContainer;
