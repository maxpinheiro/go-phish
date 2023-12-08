import { OrganizedRunItem } from '@/utils/guess.util';
import { User } from '@prisma/client';
import React from 'react';
import AboutMe from './AboutMe';
import RunRecord from './RunRecord';
import ProfileHeader from './ProfileHeader';
import { useDispatch, useSelector } from 'react-redux';
import { selectEditing, selectError, setEditing } from '@/store/profile.store';
import ErrorMessage from '../shared/ErrorMessage';
import ReactModal from 'react-modal';
import EditProfileModal from './EditProfileModal';

interface ProfileProps {
  user: User;
  runRecord: OrganizedRunItem[];
}

const Profile: React.FC<ProfileProps> = ({ user, runRecord }) => {
  const editing = useSelector(selectEditing);
  const clientError = useSelector(selectError);
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col w-full max-w-500 mt-2" id="user-info">
      <ProfileHeader user={user} />
      {clientError && <ErrorMessage error={clientError} />}
      <div className="flex flex-col mx-4">
        <AboutMe user={user} />
        <RunRecord runRecord={runRecord} />
      </div>
      {editing && <EditProfileModal closeModal={() => dispatch(setEditing(false))} />}
    </div>
  );
};

export default Profile;
