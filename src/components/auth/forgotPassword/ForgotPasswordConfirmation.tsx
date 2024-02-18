import React from 'react';
import EnvelopeOpenIcon from '@/media/EnvelopeOpen.svg';
import { useThemeContext } from '@/store/theme.store';

interface ForgotPasswordConfirmationProps {
  emailRecipient: string;
  resubmit: () => void;
}

const ForgotPasswordConfirmation: React.FC<ForgotPasswordConfirmationProps> = ({ emailRecipient, resubmit }) => {
  const { color } = useThemeContext();
  return (
    <div className="flex flex-col space-y-4 text-justify leading-7">
      <EnvelopeOpenIcon width={80} height={80} className={`fill-${color} mx-auto mb-4`} />
      <p>
        A recovery email has been sent to <b className="font-semibold">{emailRecipient}</b>. Please check your email to
        reset your password.
      </p>
      <p>
        Due to high volumes of web traffic, it may take up to 5-10 minutes for the email to arrive. If you don&apos;t
        see it in your inbox, please also check your spam folder.
      </p>
      <p className="pb-4">
        Need assistance? Contact our support team at&nbsp;
        <a href="mailto:support@phishingphun.com" className={`text-${color}`}>
          support@phishingphun.com
        </a>
        .
      </p>
      <button onClick={resubmit} className={`bg-${color} text-white rounded-lg w-full mx-auto py-2`}>
        <p className="">Resubmit</p>
      </button>
    </div>
  );
};

export default ForgotPasswordConfirmation;
