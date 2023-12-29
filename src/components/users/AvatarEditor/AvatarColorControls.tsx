import React, { useState } from 'react';
import { AvatarPart } from './AvatarEditor';
import { AvatarConfig, AvatarType, Color } from '@/types/main';
import { avatarParts } from './AvatarEditor';
import { avatarColorLabels } from '@/models/user.model';
import { toTitleCase } from '@/utils/utils';
import { foregroundColor, randomHex } from '@/utils/color.util';
import CheckIcon from '@/media/CheckIcon.svg';
import EditIcon from '@/media/EditIcon.svg';
import ShuffleIcon from '@/media/ShuffleIcon.svg';
import { ChromePicker } from 'react-color';

interface AvatarColorControlsProps {
  avatarConfig: AvatarConfig;
  setConfig: (config: AvatarConfig) => void;
}

const AvatarColorControls: React.FC<AvatarColorControlsProps> = ({ avatarConfig, setConfig }) => {
  const [openColor, setOpenColor] = useState<AvatarPart | null>(null);

  const randomPart = (part: AvatarPart) => setPart(part, randomHex());

  const setPart = (part: AvatarPart, color: Color) => {
    let newConfig: AvatarConfig = { ...avatarConfig };
    newConfig[part] = color;
    setConfig(newConfig);
  };

  return (
    <div className="flex flex-col items-center w-full space-y-3 my-6">
      {avatarParts.map((part) => {
        const color = avatarConfig[part];
        const labels = avatarColorLabels[avatarConfig.type || 'user'];
        if (!labels[part]) return null;
        return (
          <>
            <div className="flex justify-between items-center w-3/4 space-x-2.5" key={`colorlabel${part}`}>
              <p className="flex-1 text-center">{toTitleCase(labels[part]!)}:</p>
              <p className="flex-1 text-center" style={{ backgroundColor: color, color: foregroundColor(color) }}>
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
                key={`colorpicker${part}`}
              />
            )}
          </>
        );
      })}
    </div>
  );
};

export default AvatarColorControls;
