import CheckIcon from '@/media/CheckIcon.svg';
import CloseIcon from '@/media/CloseIcon.svg';
import EyeIcon from '@/media/Eye.svg';
import EyeSlashIcon from '@/media/EyeSlash.svg';
import { useThemeContext } from '@/store/theme.store';
import { useState } from 'react';

interface InputFieldProps {
  label: string;
  value: string | null;
  placeholder: string;
  onChange: (val: string) => void;
  onEnter?: () => void;
  hideField?: boolean;
  showValidation?: boolean;
  invalid?: boolean;
  invalidMessage?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  placeholder,
  onChange,
  onEnter,
  hideField = false,
  showValidation = false,
  invalid = false,
  invalidMessage,
}) => {
  const { color } = useThemeContext();
  const [showField, setShowField] = useState(!hideField);
  const ValidationIcon = invalid ? CloseIcon : CheckIcon;

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (onEnter) onEnter();
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center mb-2">
        <p className="">{label}</p>
        {showValidation && (
          <div className={`flex items-center ml-2 ${invalid ? 'text-red' : 'text-green'}`}>
            <ValidationIcon width={18} height={18} />
            {invalid && <p className="ml-0.5">{invalidMessage || 'Invalid field.'}</p>}
          </div>
        )}
      </div>
      <div className={`flex items-center flex-1 px-2 py-1 rounded-lg border border-${color} bg-${color}/10`}>
        <input
          className="flex-1 bg-transparent outline-none"
          value={value || ''}
          type={showField ? 'text' : 'password'}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
        />
        {hideField && (
          <div className="cursor-pointer" onClick={() => setShowField((b) => !b)}>
            {showField ? <EyeIcon /> : <EyeSlashIcon />}
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
