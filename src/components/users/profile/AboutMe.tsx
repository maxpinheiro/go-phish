import React from 'react';
import { User } from '@prisma/client';

interface AboutMeProps {
  user: User;
}

const AboutMe: React.FC<AboutMeProps> = ({ user }) => {
  return (
    <div className="flex flex-col space-y-4 my-4">
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <p className="font-medium">About Me</p>
        </div>
        <p className={`w-full ml-2.5 mt-2 ${!user.bio && 'opacity-50'}`}>{user.bio || 'No bio added yet'}</p>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <p className="font-medium m-0">Hometown</p>
        </div>
        <p className={`w-full ml-2.5 mt-2 ${!user.hometown && 'opacity-50'}`}>{user.hometown || "No-man's land"}</p>
      </div>
    </div>
  );
};

export default AboutMe;
