import { useThemeContext } from '@/store/theme.store';
import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  labelClass?: string;
  placeholder?: string;
  numLines?: number;
}

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  label,
  labelClass = 'mb-2',
  placeholder,
  numLines = 1,
}) => {
  const { color } = useThemeContext();
  return (
    <div className="flex flex-col">
      {label && <p className={labelClass}>{label}</p>}
      <textarea
        className={`outline-none rounded-lg border border-${color} px-2 py-1 resize-none`}
        rows={numLines}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default TextInput;
