import InputField from '@/components/shared/InputField';
import { useThemeContext } from '@/store/theme.store';
import React, { useState } from 'react';

interface ForgotPasswordFormProps {
  submit: (email: string) => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ submit }) => {
  const [email, setEmail] = useState<string | null>(null);
  const { color } = useThemeContext();
  return (
    <div className="flex flex-col">
      <p className="mt-2">Enter your email and we&apos;ll send you a link to reset your password.</p>
      <InputField
        value={email}
        onChange={setEmail}
        onEnter={() => email && submit(email)}
        label="Email:"
        placeholder="Enter email address"
        addOnClass="mt-6"
      />
      <button
        className={`w-full bg-${color} text-white py-2 rounded-lg mt-10`}
        onClick={() => email && submit(email)}
        disabled={!email}
      >
        Send Recovery Link
      </button>
    </div>
  );
};

export default ForgotPasswordForm;
