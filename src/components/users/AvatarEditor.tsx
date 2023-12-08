import { updateAvatarForUser } from '@/client/user.client';
import CheckIcon from '@/media/CheckIcon.svg';
import EditIcon from '@/media/EditIcon.svg';
import { AvatarConfig, AvatarType, avatarTypes, Color, ResponseStatus } from '@/types/main';
import { randomHex } from '@/utils/color.util';
import { toTitleCase } from '@/utils/utils';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import { AvatarIconSized } from '../shared/Avatar/AvatarIcon';
import CloseIcon from '@/media/CloseIcon.svg';
import ShuffleIcon from '@/media/ShuffleIcon.svg';
import LoadingSpinner from '../shared/LoadingSpinner';

interface AvatarEditorProps {
  initConfig: AvatarConfig;
  closeModal: (newConfig: AvatarConfig) => void;
}

type AvatarPart = Exclude<keyof AvatarConfig, 'type'>;
const avatarParts: AvatarPart[] = ['head', 'torso', 'background'];

const AvatarEditorModal: React.FC<AvatarEditorProps> = ({ initConfig, closeModal }) => {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const [avatarConfig, setConfig] = useState<AvatarConfig>(initConfig);
  const [updatedAvatar, setUpdatedAvatar] = useState<AvatarConfig | null>(null);
  const [openColor, setOpenColor] = useState<AvatarPart | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'loaded'>('loaded');
  const [error, setError] = useState<string | null>(null);

  const saveAvatar = () => {
    if (currentUserId === undefined) return;
    setStatus('loading');
    updateAvatarForUser(currentUserId, avatarConfig).then((result) => {
      if (result === ResponseStatus.Success) {
        setStatus('success');
        setUpdatedAvatar(avatarConfig);
        setTimeout(() => setStatus('loaded'), 5000);
      } else {
        setError('An unknown error occurred.');
        setStatus('error');
        setTimeout(() => setStatus('loaded'), 5000);
      }
    });
  };

  const randomColors = () => {
    setConfig((c) => ({ ...c, head: randomHex(), torso: randomHex(), background: randomHex() }));
  };

  const randomPart = (part: AvatarPart) => setPart(part, randomHex());

  const setPart = (part: AvatarPart, color: Color) => {
    let newConfig = { ...avatarConfig };
    newConfig[part] = color;
    setConfig(newConfig);
  };

  const setType = (type: AvatarType) => {
    setConfig((c) => ({ ...c, type }));
  };

  return (
    <div className="flex flex-col items-center mt-4 w-full">
      <div className="cursor-pointer absolute top-4 right-4" onClick={() => closeModal(updatedAvatar || initConfig)}>
        <CloseIcon width={24} height={24} className="fill-black dark:fill-white" />
      </div>
      {status === 'loading' && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/90 dark:bg-neutral-900/90">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <LoadingSpinner />
          </div>
        </div>
      )}
      {status === 'success' && <p className="my-2">Succesfully saved avatar.</p>}
      {status === 'error' && <p className="my-2">Error: {error || 'unknown error'}</p>}

      <div className="flex items-center space-x-4 my-4">
        <p>Type: </p>
        <select value={avatarConfig.type || 'user'} onChange={(e) => setType(e.target.value as AvatarType)}>
          {avatarTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <AvatarIconSized type={avatarConfig.type || 'user'} config={{ ...avatarConfig }} size={200} />
      <div className="flex flex-col items-center w-full space-y-3 my-2">
        {avatarParts.map((part) => {
          const color = avatarConfig[part];
          return (
            <>
              <div className="flex justify-between items-center w-3/4 space-x-2.5">
                <p className="flex-1 text-center">{toTitleCase(part)}:</p>
                <p className="flex-1 text-center" style={{ color }}>
                  {color}
                </p>
                <div className="flex-1 flex justify-center items-center space-x-2">
                  <p onClick={() => setOpenColor((c) => (c === part ? null : part))} className="cursor-pointer">
                    {openColor === part ? (
                      <CheckIcon width={16} height={16} className="fill-black dark:fill-white" />
                    ) : (
                      <EditIcon width={16} height={16} className="fill-black dark:fill-white" />
                    )}
                  </p>
                  <p onClick={() => randomPart(part)} className="cursor-pointer">
                    <ShuffleIcon width={16} height={16} className="fill-black dark:fill-white" />
                  </p>
                </div>
              </div>
              {openColor === part && (
                <ChromePicker
                  color={color}
                  onChange={(color) => setPart(part, color.hex as Color)}
                  onChangeComplete={(color) => setPart(part, color.hex as Color)}
                />
              )}
            </>
          );
        })}
      </div>
      <div className="flex items-center space-x-4 mt-3">
        <p onClick={randomColors} className="cursor-pointer border-b dark:border-white pb-1">
          Shuffle All
        </p>
        <p onClick={saveAvatar} className="cursor-pointer border-b dark:border-white pb-1">
          Save
        </p>
      </div>
    </div>
  );
};

export default AvatarEditorModal;
