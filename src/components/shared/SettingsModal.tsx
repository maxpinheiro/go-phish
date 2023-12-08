import React from 'react';
import { ThemeColor, useThemeContext } from '@/store/theme.store';
import CloseIcon from '@/media/CloseIcon.svg';
import DropdownInput from './DropdownInput';

interface SettingsModalProps {
  closeModal: () => void;
}

const themeOptions: ThemeColor[] = ['red', 'blue', 'green', 'purple'];

const SettingsModal: React.FC<SettingsModalProps> = ({ closeModal }) => {
  const { color, setThemeColor } = useThemeContext();

  return (
    <div
      className="absolute top-0 left-0 right-0 bottom-0 z-20 bg-black/10 flex items-center justify-center px-6 py-6"
      id="settings-modal"
    >
      <div
        className={`flex flex-col w-full h-full rounded-lg bg-white dark:bg-neutral-900 border border-black px-5 py-2 relative text-black dark:text-white`}
      >
        <div className="absolute top-3 right-3 cursor-pointer" onClick={closeModal}>
          <CloseIcon width={24} height={24} />
        </div>
        <p className="text-2xl mx-auto mt-4">Settings</p>
        <div className="flex flex-col my-5">
          <p className="mb-2">Theme:</p>
          <DropdownInput<ThemeColor>
            options={themeOptions}
            currentValue={color}
            placeholder="Select Theme"
            changeValue={setThemeColor}
          />
        </div>
        <div className="flex flex-col space-y-3">
          <p>Account Settings:</p>
          <ul className={`marker:text-${color} list-inside list-disc ml-4 space-y-2`}>
            <li>Add/Change Email</li>
            <li>Edit Username</li>
            <li>Reset Password</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
