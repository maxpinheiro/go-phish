import CheckIcon from '@/media/CheckIcon.svg';
import { useThemeContext } from '@/store/theme.store';

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

export default FeedbackConfirmation;
