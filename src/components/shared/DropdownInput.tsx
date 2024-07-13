import DropDownIcon from '@/media/Dropdown.svg';
import { useThemeContext } from '@/store/theme.store';
import { useState } from 'react';

export type Option<T> = {
  label: string;
  value: T;
};

interface DropdownInputProps<T> {
  //options: Option<T>[];
  options: T[];
  currentValue: T | undefined;
  placeholder?: string;
  changeValue: (val: T) => void;
}

const DropdownInput = <T extends string | number>({
  options,
  currentValue,
  placeholder,
  changeValue,
}: DropdownInputProps<T>): JSX.Element => {
  const { color } = useThemeContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className={`flex flex-col w-full rounded-lg border border-${color}`}>
      <div
        className={`flex w-full p-2 justify-between items-center space-x-2.5 rounded-lg cursor-pointer bg-${color}/10 ${
          dropdownOpen ? `border-b border-${color}` : ''
        }`}
        onClick={() => setDropdownOpen((b) => !b)}
      >
        <p className="">{currentValue || placeholder}</p>
        <DropDownIcon
          height={8}
          className={`fill-black dark:fill-white transition duration-300 ${dropdownOpen ? '' : '-rotate-180'}`}
        />
      </div>
      {dropdownOpen &&
        options.map((val) => (
          <div
            className={`px-2 py-1 cursor-pointer ${
              currentValue === val ? `bg-${color}/10 hover:bg-${color}/40` : `hover:bg-${color}/20`
            }`}
            onClick={() => {
              changeValue(val);
              setDropdownOpen(false);
            }}
            key={`option-${val}`}
          >
            {val}
          </div>
        ))}
    </div>
  );
};

export default DropdownInput;
