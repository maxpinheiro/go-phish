import { useThemeContext } from '@/store/theme.store';
import React from 'react';

const EmailNotFound: React.FC = () => {
  const { color } = useThemeContext();

  return (
    <div className="flex flex-col items-center space-y-2 mt-4">
      <p>We could not find any account associated with this email. Sorry!</p>
      <p className="">If you want to be able to sign in to your account via email, you must either:</p>
      <ol className="list-decimal">
        <li>Sign into your account normally, navigate to your account settings, and add your email.</li>
        <li>
          <a href="mailto:help@phishingfun.com" className={`text-${color}`}>
            Contact administration (help@phishingfun.com)
          </a>{' '}
          to have your email added to your account manually.
        </li>
      </ol>
    </div>
  );
};

export default EmailNotFound;
