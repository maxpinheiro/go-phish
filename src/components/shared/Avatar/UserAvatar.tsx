import { AvatarConfig } from '@/types/main';
import { shiftColorValue } from '@/utils/color.util';
import { mapRange } from '@/utils/utils';
import React from 'react';

export const UserAvatar: React.FC<AvatarConfig> = (config) => <UserAvatarSized {...config} size={20} />;

export const UserAvatarSized: React.FC<AvatarConfig & { size: number }> = ({ background, torso, head, size }) => (
  <svg width={size} height={size} viewBox="-1 -1 102 102" fill="none">
    <circle
      cx="50"
      cy="50"
      r="49.875"
      fill={background}
      stroke={shiftColorValue(background, -40)}
      strokeWidth={mapRange(size, 16, 400, 0.25, 3)}
    />
    <path
      d="M26.3849 93.4512L26.3452 93.5449L26.4288 93.6028L26.5 93.5C26.4288 93.6028 26.4289 93.6028 26.429 93.6029L26.4293 93.6031L26.4303 93.6038L26.4341 93.6064L26.4488 93.6164C26.4618 93.6252 26.481 93.6381 26.5063 93.6549C26.5571 93.6886 26.6325 93.7379 26.7319 93.8009C26.9307 93.9269 27.2253 94.1075 27.6099 94.3273C28.3789 94.7668 29.508 95.3626 30.9502 95.9896C33.8342 97.2436 37.9719 98.6228 42.9876 99.1244C47.9903 99.6247 51.5669 99.7719 54.9248 99.469C58.2836 99.1661 61.4181 98.4133 65.5375 97.1193C68.5496 96.1731 71.8083 94.5432 74.3107 93.1525C75.5627 92.4567 76.6268 91.8199 77.3781 91.357C77.7537 91.1255 78.0512 90.9375 78.2548 90.8073C78.3567 90.7422 78.435 90.6915 78.488 90.6571L78.5482 90.6179L78.5635 90.6078L78.5674 90.6053L78.5684 90.6046L78.5687 90.6044C78.5688 90.6044 78.5688 90.6044 78.5 90.5L78.5688 90.6044L78.6633 90.542L78.6106 90.4418L63.4439 61.6085L63.4088 61.5417H63.3333H40H39.9172L39.8849 61.6179L26.3849 93.4512Z"
      fill={torso}
      stroke={shiftColorValue(torso, -40)}
      strokeWidth={mapRange(size, 16, 400, 0.25, 3)}
    />
    <circle
      cx="50"
      cy="43.3333"
      r="26.5667"
      fill={head}
      stroke={shiftColorValue(head, -40)}
      strokeWidth={mapRange(size, 16, 400, 0.25, 3)}
    />
  </svg>
);
