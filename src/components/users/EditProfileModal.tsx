import CloseIcon from '@/media/CloseIcon.svg';
import {
  selectAvatar,
  selectBio,
  selectEditing,
  selectHometown,
  selectName,
  selectUpdatedUser,
  setAvatarModalOpen,
  setBio,
  setHometown,
  setName,
} from '@/store/profile.store';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TextInput from '../shared/TextInput';
import { AvatarIconSized } from '../shared/Avatar/AvatarIcon';
import EditIcon from '@/media/EditIcon.svg';

interface EditProfileModalProps {
  closeModal: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ closeModal }) => {
  const editing = useSelector(selectEditing);
  const avatar = useSelector(selectAvatar);
  const nameInput = useSelector(selectName);
  const hometownInput = useSelector(selectHometown);
  const bioInput = useSelector(selectBio);
  const dispatch = useDispatch();
  const updatedUser = useSelector(selectUpdatedUser);

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
        <p className="text-2xl mx-auto mt-4">Edit Profile</p>
        <div className="relative my-5 mx-auto">
          <AvatarIconSized type={avatar.type || 'user'} config={avatar} size={100} />
          {editing && (
            <>
              <div className="w-full h-full absolute top-0 left-0 bg-white opacity-5 rounded-full" />
              <div
                onClick={() => dispatch(setAvatarModalOpen(true))}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              >
                <EditIcon className="fill-black dark:fill-white" />
              </div>
            </>
          )}
        </div>
        <div className="flex flex-col space-y-4">
          <TextInput
            value={nameInput}
            onChange={(val) => dispatch(setName(val))}
            label="Name"
            placeholder="Enter name here"
          />
          <TextInput
            value={hometownInput}
            onChange={(val) => dispatch(setHometown(val))}
            label="Hometown"
            placeholder="Enter hometown here"
          />
          <TextInput
            value={bioInput}
            onChange={(val) => dispatch(setBio(val))}
            label="About Me"
            placeholder="Enter bio here"
            numLines={3}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
