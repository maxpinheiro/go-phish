import DropDownIcon from '@/media/Dropdown.svg';
import { useThemeContext } from '@/store/theme.store';
import React, { useState } from 'react';

interface ToggleDropdownProps {
  header: JSX.Element;
  children: JSX.Element;
  defaultOpen?: boolean;
  disableTextClick?: boolean;
}

const ToggleDropdown: React.FC<ToggleDropdownProps> = ({
  header,
  children,
  defaultOpen = false,
  disableTextClick = false,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(defaultOpen);
  const { color } = useThemeContext();

  return (
    <div className={`w-full flex flex-col px-2.5 py-2.5 rounded-xl border border-${color} shadow`}>
      <div
        className={`flex items-center ${!disableTextClick && 'cursor-pointer'} `}
        onClick={() => !disableTextClick && setDropdownOpen((b) => !b)}
      >
        <div className="flex flex-1">{header}</div>
        <div onClick={() => setDropdownOpen((b) => !b)}>
          <DropDownIcon
            height={8}
            className={`transition duration-300 fill-black dark:fill-white ${
              dropdownOpen ? '-rotate-180' : ''
            } cursor-pointer`}
          />
        </div>
        {/* <div className="flex justify-end">
        </div> */}
      </div>
      {dropdownOpen && children}
    </div>
  );
};

export default ToggleDropdown;
