import CheckIcon from '@/media/CheckIcon.svg';
import CloseIcon from '@/media/CloseIcon.svg';
import EditIcon from '@/media/EditIcon.svg';
import SignoutIcon from '@/media/SignoutIcon.svg';
import {
  saveProfile,
  selectEditing,
  setAvatar,
  setBio,
  setEditing,
  setHometown,
  setUserId,
} from '@/store/profile.store';
import { User } from '@prisma/client';
import Link from 'next/link';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface ProfileControlsProps {
  user: User;
}

const ProfileControls: React.FC<ProfileControlsProps> = ({ user }) => {
  const editing = useSelector(selectEditing);
  const dispatch = useDispatch();

  const startEditing = () => {
    dispatch(setUserId(user.id));
    dispatch(setBio(user.bio));
    dispatch(setHometown(user.hometown));
    dispatch(setAvatar(user.avatar));
    dispatch(setEditing(true));
  };

  const saveEdits = () => {
    dispatch(saveProfile());
  };

  const cancelEdits = () => {
    dispatch(setEditing(false));
  };

  return (
    <div className="flex items-center justify-end grow space-x-4 mr-2">
      <div className="cursor-pointer flex items-center">
        {editing ? (
          <>
            <div onClick={saveEdits}>
              <CheckIcon width={26} height={26} className="fill-black dark:fill-white" />
            </div>
            <div onClick={cancelEdits}>
              <CloseIcon width={26} height={26} className="fill-black dark:fill-white" />
            </div>
          </>
        ) : (
          <div onClick={startEditing}>
            <EditIcon width={26} height={26} className="fill-black dark:fill-white" />
          </div>
        )}
      </div>
      <Link href="/api/auth/signout" className="cursor-pointer">
        <SignoutIcon width={30} height={30} className="fill-black dark:fill-white" />
      </Link>
    </div>
  );
};

export default ProfileControls;
