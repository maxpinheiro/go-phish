import InputField from '@/components/shared/InputField';
import { useThemeContext } from '@/store/theme.store';
import React, { useState } from 'react';

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

export default FeedbackForm;
