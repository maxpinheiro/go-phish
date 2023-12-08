import AdminIcon from '@/media/AdminIcon.svg';
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
import { useRouter } from 'next/router';
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
    <div className="flex items-center justify-end grow space-x-2">
      <div className="cursor-pointer flex items-center">
        {editing ? (
          <>
            <div onClick={saveEdits}>
              <CheckIcon width={22} height={22} className="fill-black dark:fill-white" />
            </div>
            <div onClick={cancelEdits}>
              <CloseIcon width={22} height={22} className="fill-black dark:fill-white" />
            </div>
          </>
        ) : (
          <div onClick={startEditing}>
            <EditIcon width={20} height={20} className="fill-black dark:fill-white" />
          </div>
        )}
      </div>
      {user.admin && (
        <Link href="/admin">
          <AdminIcon width={24} height={24} className="fill-black dark:fill-white" />
        </Link>
      )}
      <Link href="/api/auth/signout" className="cursor-pointer mt-0.5">
        <SignoutIcon width={22} height={22} className="fill-black dark:fill-white" />
      </Link>
    </div>
  );
};

export default ProfileControls;
