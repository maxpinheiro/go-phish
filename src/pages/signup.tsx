import { attemptSignupClient } from '@/client/user.client';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import CheckIcon from '@/media/CheckIcon.svg';
import CloseIcon from '@/media/CloseIcon.svg';
import EyeIcon from '@/media/Eye.svg';
import EyeSlashIcon from '@/media/EyeSlash.svg';
import { useThemeContext } from '@/store/theme.store';
import { AvatarConfig, ResponseStatus } from '@/types/main';
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { InputHTMLAttributes, useEffect, useState } from 'react';
import { isValidEmail } from '@/utils/utils';
import InputField from '@/components/shared/InputField';

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const session = await getSession(context);
  const username = session?.user?.username;

  if (username) {
    return {
      redirect: {
        destination: `/users/${username}`,
        permanent: false,
      },
    };
  } else {
    return {
      props: {},
    };
  }
};

const Signup: React.FC = ({}) => {
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [passwordConfirm, setPasswordConfirm] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { color } = useThemeContext();
  const { data: session, update } = useSession();
  const { email: providedEmail } = router.query;
  const fieldsValid = username && password && password === passwordConfirm && email && isValidEmail(email);

  useEffect(() => {
    // check for email url param
    if (providedEmail) {
      setEmail(providedEmail.toString());
    }
  }, [providedEmail]);

  const alertError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const attemptSignup = async () => {
    if (!username || !password || !passwordConfirm || !email) {
      return alertError('Fields cannot be empty.');
    }
    if (!isValidEmail(email)) {
      return alertError('Invalid email.');
    }

    setLoading(true);
    const result = await attemptSignupClient(username, password, email);
    if (result === 'name conflict') {
      alertError('This username is already in use.');
      return setLoading(false);
    } else if (result === 'email conflict') {
      alertError('This email is already in use.');
      return setLoading(false);
    } else if (result === ResponseStatus.UnknownError) {
      alertError('An error occurred when attempting to signup. Please try again or refresh the page.');
      return setLoading(false);
    } else {
      const newSessionUser = {
        id: result.id,
        username: result.username,
        admin: result.admin,
        avatarConfig: JSON.parse(JSON.stringify(result.avatar)) as AvatarConfig,
      };
      await update({ ...session, user: newSessionUser });
      router.push('/api/auth/signin?callbackUrl=/profile');
      //router.push(`/users/${result.username}`);
      //router.push(`/onboarding?userId=${result.id}`);
    }
  };

  return (
    <>
      <Head>
        <title>Signup | Go Phish</title>
      </Head>
      <div className="flex flex-col items-center w-full max-w-[500px] px-5 mx-auto">
        <p className="text-title-regular pt-5">Sign Up</p>
        {error && <p className="text-red mt-2">{error}</p>}
        {loading && <LoadingOverlay />}
        <div className="flex flex-col items-center w-full space-y-3 pt-3 pb-5">
          <InputField
            label="Username:"
            value={username}
            placeholder="username"
            onChange={setUsername}
            invalid={username === ''}
            invalidMessage="Username cannot be blank."
            showValidation={username !== null}
          />
          <InputField
            label="Password:"
            value={password}
            placeholder="password"
            onChange={setPassword}
            hideField
            invalid={password === ''}
            invalidMessage="Password cannot be blank."
            showValidation={password !== null}
          />
          <InputField
            label="Confirm Password:"
            value={passwordConfirm}
            placeholder="password"
            onChange={setPasswordConfirm}
            hideField
            invalid={password === '' || (!!password && password !== passwordConfirm)}
            invalidMessage="Passwords must match."
            showValidation={passwordConfirm !== null}
          />
          <InputField
            label="Email:"
            value={email}
            placeholder="email"
            onChange={setEmail}
            invalid={!isValidEmail(email || '')}
            invalidMessage="Invalid email format."
            showValidation={email !== null}
          />
        </div>
        <button
          className={`my-6 bg-${color} disabled:opacity-40 rounded-lg border border-${color} text-white px-3 py-1.5`}
          onClick={attemptSignup}
          disabled={!fieldsValid}
        >
          <p className="text-xl">Sign Up</p>
        </button>
      </div>
    </>
  );
};

export default Signup;
