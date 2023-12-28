import React from 'react';
import { useThemeContext } from '@/store/theme.store';
import CheckIcon from '@/media/CheckIcon.svg';

interface CheckboxInputProps {
  checked: boolean;
  onToggle: () => void;
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({ checked, onToggle }) => {
  const { color } = useThemeContext();
  return (
    <div
      className={`w-6 h-6 rounded-[4px] border-[1.5px] border-${color} cursor-pointer flex items-center justify-center ${
        checked ? `bg-${color}/10` : ''
      }`}
      onClick={onToggle}
    >
      {checked && <CheckIcon className={`fill-${color} w-5 h-5`} />}
    </div>
  );
};

export default CheckboxInput;
