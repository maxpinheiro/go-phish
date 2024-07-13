import { resetProfile, selectEditing, selectUpdatedUser } from '@/store/profile.store';
import { OrganizedRunItem } from '@/utils/guess.util';
import { User } from '@prisma/client';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AboutMe from './AboutMe';
import EditProfileModal from './EditProfileModal';
import ProfileHeader from './ProfileHeader';
import RunRecord from './RunRecord';

interface ProfileContainerProps {
  user: User;
  runRecord: OrganizedRunItem[];
}

const ProfileContainer: React.FC<ProfileContainerProps> = ({ user: initUser, runRecord }) => {
  const editing = useSelector(selectEditing);
  const updatedUser = useSelector(selectUpdatedUser);
  const user = updatedUser || initUser;
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col w-full max-w-500 mt-2" id="user-info">
      <ProfileHeader user={user} />
      <div className="flex flex-col mx-4">
        <AboutMe user={user} />
        <RunRecord runRecord={runRecord} />
      </div>
      {editing && <EditProfileModal closeModal={() => dispatch(resetProfile())} />}
    </div>
  );
};

export default ProfileContainer;
