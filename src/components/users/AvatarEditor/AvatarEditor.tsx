import { updateAvatarForUser } from '@/client/user.client';
import { AvatarConfig, AvatarType, avatarTypes, ResponseStatus } from '@/types/main';
import { desaturateColor, randomHex } from '@/utils/color.util';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { AvatarIconSized } from '../../shared/Avatar/AvatarIcon';
import CloseIcon from '@/media/CloseIcon.svg';
import LoadingSpinner from '../../shared/LoadingSpinner';
import { avatarColorLabels } from '@/models/user.model';
import { useThemeContext } from '@/store/theme.store';
import AvatarColorControls from './AvatarColorControls';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUpdatedUser } from '@/store/profile.store';

interface AvatarEditorProps {
  initConfig: AvatarConfig;
  closeModal: (newConfig: AvatarConfig | null) => void;
}

export type AvatarPart = Exclude<keyof AvatarConfig, 'type'>;
export const avatarParts: AvatarPart[] = ['head', 'torso', 'background'];

const AvatarEditorModal: React.FC<AvatarEditorProps> = ({ initConfig, closeModal }) => {
  const { data: session } = useSession();
  const { color, hexColor } = useThemeContext();
  const desatColor = desaturateColor(hexColor, 0.5);
  const currentUserId = session?.user?.id;
  const [avatarConfig, setConfig] = useState<AvatarConfig>(initConfig);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const showError = (message: string) => {
    toast.error(message, { duration: 3000 });
  };

  const saveAvatar = async () => {
    if (currentUserId === undefined) return;
    setLoading(true);
    const result = await updateAvatarForUser(currentUserId, avatarConfig);
    if (result === ResponseStatus.Unauthorized) {
      showError('You are not authorized to edit this user!.');
    } else if (result === ResponseStatus.UnknownError) {
      showError('An unknown error occurred.');
    } else {
      toast.success('Succesfully saved avatar.', { duration: 3000 });
      dispatch(setUpdatedUser(result));
      closeModal(avatarConfig);
    }
    setLoading(false);
  };

  const randomColors = () => {
    const labels = avatarColorLabels[avatarConfig.type || 'user'];
    let newConfig: Partial<AvatarConfig> = {};
    if (labels.head) newConfig.head = randomHex();
    if (labels.torso) newConfig.torso = randomHex();
    if (labels.background) newConfig.background = randomHex();
    setConfig((c) => ({ ...c, ...newConfig }));
  };

  const setType = (type: AvatarType) => {
    setConfig((c) => ({ ...c, type }));
  };

  return (
    <div
      className="absolute top-0 left-0 right-0 bottom-0 z-20 bg-black/10 flex items-center justify-center px-6 py-6"
      id="edit-avatar-modal"
    >
      <div
        className={`flex flex-col items-center w-full h-full rounded-lg bg-white dark:bg-neutral-900 border border-black px-5 py-2 relative text-black dark:text-white`}
      >
        <div
          className="cursor-pointer absolute top-4 right-4"
          onClick={() => closeModal(avatarConfig === initConfig ? null : avatarConfig)}
        >
          <CloseIcon width={24} height={24} className="fill-black dark:fill-white" />
        </div>
        {loading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/90 dark:bg-neutral-900/90">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <LoadingSpinner color={hexColor} secondaryColor={desatColor} />
            </div>
          </div>
        )}
        <p className="text-2xl mx-auto mt-4">Edit Avatar</p>
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
        <AvatarColorControls avatarConfig={avatarConfig} setConfig={setConfig} />
        <button onClick={randomColors} className={`mt-3 w-full rounded-lg py-2 border border-${color} text-${color}`}>
          <p className="">Shuffle All</p>
        </button>
        <button onClick={saveAvatar} className={`mt-3 w-full rounded-lg py-2 bg-${color} text-white`}>
          <p className="">Save</p>
        </button>
      </div>
    </div>
  );
};

export default AvatarEditorModal;
