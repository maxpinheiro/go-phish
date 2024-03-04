import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useThemeContext } from '@/store/theme.store';
import InputField from '@/components/shared/InputField';
import Link from 'next/link';
import LoadingOverlay from '@/components/shared/LoadingOverlay';
import { signIn } from 'next-auth/react';
import { isValidEmail } from '@/utils/utils';
import { attemptSignupClient } from '@/client/user.client';
import { ResponseStatus } from '@/types/main';
import toast from 'react-hot-toast';

const SignUpContainer: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [passwordConfirm, setPasswordConfirm] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { color } = useThemeContext();

  const showError = (message: string) => {
    toast.error(message, { duration: 3000 });
  };

  const trySignup = async () => {
    if (username === null) {
      showError('Missing username.');
    } else if (password === null) {
      showError('Missing password.');
    } else if (password !== passwordConfirm) {
      showError('Passwords must match.');
    } else if (!email || !isValidEmail(email)) {
      showError('Invalid email.');
    } else {
      setLoading(true);
      const res = await attemptSignupClient(username, password, email);
      if (res === 'name conflict') {
        showError('Username already taken.');
      } else if (res === 'email conflict') {
        showError('Email already in use.');
      } else if (res === ResponseStatus.UnknownError) {
        showError('An unknown error occurred.');
      } else {
        // persist new account into auth session
        const authRes = await signIn('credentials', { username, password, redirect: false });
        if (authRes?.ok) {
          router.push('/onboarding');
        } else {
          showError(`Could not sign into new account: ${authRes?.error || 'unknown error'}`);
        }
        // TODO: update session directly rather than forcing login?
        // const newSessionUser = {
        //   id: res.id,
        //   username: res.username,
        //   admin: res.admin,
        //   avatarConfig: JSON.parse(JSON.stringify(res.avatar)) as AvatarConfig,
        // };
        // await update({ ...session, user: newSessionUser });
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-6">
      <p className="text-4xl my-5">Signup</p>
      <div className="flex flex-col space-y-4 w-full">
        <InputField
          label="Username:"
          value={username}
          placeholder="username"
          onChange={setUsername}
          onEnter={trySignup}
        />
        <InputField
          label="Password:"
          value={password}
          placeholder="password"
          hideField
          onChange={setPassword}
          onEnter={trySignup}
        />
        <InputField
          label="Confirm Password:"
          value={passwordConfirm}
          placeholder="password"
          hideField
          onChange={setPasswordConfirm}
          onEnter={trySignup}
        />
        <InputField label="Email:" value={email} placeholder="email" onChange={setEmail} onEnter={trySignup} />
      </div>
      <button
        onClick={trySignup}
        disabled={loading}
        className={`auth-button w-full bg-${color} text-white rounded-lg py-2 mt-10 mb-4`}
      >
        <p className="text-lg">Sign Up</p>
      </button>
      <div className="flex items-center space-x-2 mt-6">
        <p>Already have an account?</p>
        <Link href="/auth/signin" className={`font-semibold text-${color}`}>
          Login
        </Link>
      </div>
      {loading && <LoadingOverlay />}
    </div>
  );
};

export default SignUpContainer;
