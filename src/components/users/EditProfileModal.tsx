import CloseIcon from '@/media/CloseIcon.svg';
import {
  selectAvatar,
  selectBio,
  selectEditing,
  selectHometown,
  selectName,
  selectUserId,
  setAvatar,
  setBio,
  setEditing,
  setHometown,
  setName,
  setUpdatedUser,
} from '@/store/profile.store';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AvatarIconSized } from '../shared/Avatar/AvatarIcon';
import EditIcon from '@/media/EditIcon.svg';
import Modal from 'react-modal';
import AvatarEditorModal from './AvatarEditor/AvatarEditor';
import { useThemeContext } from '@/store/theme.store';
import { updateUser } from '@/client/user.client';
import LoadingSpinner from '../shared/LoadingSpinner';
import { desaturateColor } from '@/utils/color.util';
import { ResponseStatus } from '@/types/main';
import InputField from '../shared/InputField';

Modal.setAppElement('#__next');

interface EditProfileModalProps {
  closeModal: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ closeModal }) => {
  const { color, hexColor } = useThemeContext();
  const desatColor = desaturateColor(hexColor, 0.5);
  const editing = useSelector(selectEditing);
  const userId = useSelector(selectUserId);
  const avatar = useSelector(selectAvatar);
  const nameInput = useSelector(selectName);
  const hometownInput = useSelector(selectHometown);
  const bioInput = useSelector(selectBio);
  const dispatch = useDispatch();
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const saveProfile = async () => {
    const userData = {
      name: nameInput,
      bio: bioInput,
      hometown: hometownInput,
    };
    if (userId === null) return;
    try {
      setLoading(true);
      const newUser = await updateUser(userId, userData);
      if (newUser === ResponseStatus.Unauthorized) {
        showError('You are not authorized to edit this account!');
      } else if (newUser === ResponseStatus.UnknownError) {
        showError('An unknown error occurred. Please try again or refresh the page.');
      } else {
        dispatch(setUpdatedUser(newUser));
        dispatch(setEditing(false));
      }
      setLoading(false);
    } catch (e) {
      showError(`An unknown error occurred: ${(e as Error).message}`);
      setLoading(false);
    }
  };

  return (
    <div
      className="absolute top-0 left-0 right-0 bottom-0 z-20 bg-black/10 flex items-center justify-center px-6 py-6"
      id="edit-profile-modal"
    >
      <div
        className={`flex flex-col w-full h-full rounded-lg bg-white dark:bg-neutral-900 border border-black px-5 py-2 relative text-black dark:text-white`}
      >
        <div className="absolute top-3 right-3 cursor-pointer" onClick={closeModal}>
          <CloseIcon width={24} height={24} />
        </div>
        {loading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/90 dark:bg-neutral-900/90 z-20">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <LoadingSpinner color={hexColor} secondaryColor={desatColor} />
            </div>
          </div>
        )}
        {error && <p className="my-2 text-red text-center">Error: {error || 'unknown error'}</p>}
        <p className="text-2xl mx-auto mt-4">Edit Profile</p>
        <div className="relative my-5 mx-auto">
          <AvatarIconSized type={avatar.type || 'user'} config={avatar} size={100} />
          {editing && (
            <>
              <div className="w-full h-full absolute top-0 left-0 bg-white opacity-5 rounded-full" />
              <div
                onClick={() => setAvatarModalOpen(true)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              >
                <EditIcon className="fill-black dark:fill-white" />
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col space-y-4">
          <InputField
            value={nameInput}
            onChange={(val) => dispatch(setName(val))}
            label="Name"
            placeholder="Enter name here"
          />
          <InputField
            value={hometownInput}
            onChange={(val) => dispatch(setHometown(val))}
            label="Hometown"
            placeholder="Enter hometown here"
          />
          <InputField
            value={bioInput}
            onChange={(val) => dispatch(setBio(val))}
            label="About Me"
            placeholder="Enter bio here"
            numLines={3}
          />
        </div>
        <button
          onClick={saveProfile}
          className={`absolute bottom-6 left-5 right-5 rounded-lg py-2 bg-${color} text-white`}
        >
          <p className="">Save</p>
        </button>
      </div>
      {avatarModalOpen && (
        <AvatarEditorModal
          initConfig={avatar}
          closeModal={(newConfig) => {
            setAvatarModalOpen(false);
            if (newConfig) dispatch(setAvatar(newConfig));
          }}
        />
      )}
    </div>
  );
};

export default EditProfileModal;
