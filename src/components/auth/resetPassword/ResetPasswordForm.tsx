import InputField from '@/components/shared/InputField';
import { useThemeContext } from '@/store/theme.store';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface ResetPasswordFormProps {
  submit: (password: string) => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ submit }) => {
  const [password, setPassword] = useState<string | null>(null);
  const [passwordConfirm, setPasswordConfirm] = useState<string | null>(null);
  const { color } = useThemeContext();

  const onSubmit = () => {
    if (!password || !passwordConfirm) toast.error('Missing password!', { duration: 3000 });
    else if (password !== passwordConfirm) toast.error('Passwords must match!', { duration: 3000 });
    else submit(password);
  };
  return (
    <div className="flex flex-col">
      <InputField
        value={password}
        onChange={setPassword}
        onEnter={onSubmit}
        hideField
        label="Password:"
        placeholder="Enter new password"
        addOnClass="mt-2"
      />
      <InputField
        value={passwordConfirm}
        onChange={setPasswordConfirm}
        onEnter={onSubmit}
        hideField
        label="Confirm Password:"
        placeholder="Confirm new password"
        addOnClass="mt-6"
      />
      <button className={`w-full bg-${color} text-white py-2 rounded-lg mt-10`} onClick={onSubmit}>
        Reset Password
      </button>
    </div>
  );
};

export default ResetPasswordForm;
