import { suggestFeedback } from '@/client/feedback.client';
import InputField from '@/components/shared/InputField';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import CheckIcon from '@/media/CheckIcon.svg';
import { useThemeContext } from '@/store/theme.store';
import { ResponseStatus } from '@/types/main';
import Head from 'next/head';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const FeedbackConfirmation = ({ resubmit }: { resubmit: () => void }) => {
  const { color } = useThemeContext();
  return (
    <div className="flex flex-col text-justify leading-7">
      <CheckIcon width={80} height={80} className={`fill-${color} mx-auto`} />
      <p className="mt-4">
        Thank you for your feedback! Your input is invaluable to us and will help us improve your experience on our
        site.
      </p>
      <p className="mt-4">
        We&apos;ll review your message as soon as possible. If you provided contact information, we&apos;ll be sure to
        follow up if necessary.
      </p>
      <button onClick={resubmit} className={`bg-${color} text-white rounded-lg w-full mx-auto px-3 py-2 mt-12`}>
        <p className="">Submit More Feedback</p>
      </button>
    </div>
  );
};

interface FeedbackFormProps {
  submit: (feedback: string, contactInfo: string | null) => void;
}
const FeedbackForm: React.FC<FeedbackFormProps> = ({ submit }) => {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState<string | null>(null);
  const { color } = useThemeContext();
  return (
    <div className="flex flex-col space-y-5">
      <p className="">Found a bug? Missing a song? Have any other feedback? Let us know!</p>
      <InputField label="" value={feedback} numLines={5} placeholder="Enter feedback here..." onChange={setFeedback} />
      <InputField
        label="Contact Info:"
        value={contactInfo}
        placeholder={'Phone number, email, etc. (optional)'}
        onChange={setContactInfo}
      />
      <div />
      <button
        onClick={() => submit(feedback ?? 'No feedback provided', contactInfo)}
        disabled={!feedback}
        className={`bg-${color} text-white rounded-lg w-full mx-auto px-3 py-2`}
      >
        <p className="">Submit Feedback</p>
      </button>
    </div>
  );
};

const FeedbackPage: React.FC = () => {
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
    <>
      <Head>
        <title>Feedback | Go Phish</title>
      </Head>
      <div className="flex flex-col items-center mx-5">
        <p className="text-title-regular my-4">Feedback</p>
        {loading && <LoadingOverlay />}
        {submittedFeedback ? (
          <FeedbackConfirmation resubmit={() => setSubmittedFeedback(false)} />
        ) : (
          <FeedbackForm submit={submitFeedback} />
        )}
      </div>
    </>
  );
};

export default FeedbackPage;
