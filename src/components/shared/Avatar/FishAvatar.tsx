import { AvatarConfig } from '@/types/main';
import { shiftColorValue } from '@/utils/color.util';
import { mapRange } from '@/utils/utils';
import React from 'react';

export const FishAvatar: React.FC<AvatarConfig> = (config) => <FishAvatarSized {...config} size={20} />;

export const FishAvatarSized: React.FC<AvatarConfig & { size: number }> = ({ background, torso, head, size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 101 101" width={size} height={size} fill="none">
    <circle
      fill={background}
      stroke={shiftColorValue(background, -80)}
      strokeWidth={mapRange(size, 16, 400, 0.25, 2)}
      cx="49.63"
      cy="49.63"
      r="49.5"
    />
    <path
      fill={shiftColorValue(torso, -80)}
      stroke={shiftColorValue(torso, -90)}
      strokeWidth={mapRange(size, 16, 400, 0.2, 1.75)}
      d="M47.12,74.43c-1.58-.63-6.36-2.86-8.58-3.82l21.94-4.77a17.72,17.72,0,0,0-.6,2.32,11.77,11.77,0,0,0-.21,2.93c.08,1.41,2.72,5.25,3.68,6.2l-3.74,0a25.91,25.91,0,0,1-5.79-.72A49.28,49.28,0,0,1,47.12,74.43Z"
      transform="translate(-0.35 -0.37)"
    />
    <path
      fill={shiftColorValue(torso, -80)}
      stroke={shiftColorValue(torso, -90)}
      strokeWidth={mapRange(size, 16, 400, 0.2, 1.75)}
      d="M75.66,35.57a53.8,53.8,0,0,0-6.59,4.51l-.95,21a19.8,19.8,0,0,0,2.44,2.76c1.46,1.11,6.3,2.62,9.2,3.14a32.06,32.06,0,0,0,9.35-1.13c-1.59-.63-5.15-2.48-6.68-4.77-1.91-2.86-3.81-7.63-3.81-10.5S81,41.69,82.33,40.06c1.71-2.18,4.41-3.08,6.78-3.8A7.54,7.54,0,0,0,86.77,35a26.43,26.43,0,0,0-5.29-.69A12.71,12.71,0,0,0,75.66,35.57Z"
      transform="translate(-0.35 -0.37)"
    />
    <path
      fill={torso}
      stroke={shiftColorValue(torso, -60)}
      strokeWidth={mapRange(size, 16, 400, 0.2, 1.5)}
      d="M12.29,41.56c-1.54,3.88-1.7,6.76-1.43,10.92a16.72,16.72,0,0,0,1.91,7.64,16.55,16.55,0,0,0,4.77,5.72c5.32,4.49,13.36,4.77,17.18,4.77A104.57,104.57,0,0,0,51.9,68.7a102.68,102.68,0,0,0,13.36-4.77c1.9-1,8.09-3.81,8.58-11.45.17-3.92-1.26-6.61-3.3-10.45a29.13,29.13,0,0,0-6.24-7.68c-2-1.83-4.81-3.13-4.77-3.82a46.88,46.88,0,0,1,.95-7.63,30.58,30.58,0,0,1,2.87-7.64c-1.28.32-4.09.46-6.68,1-3,.58-4.8.73-7.64,1.91a38.47,38.47,0,0,0-9.54,5.72c-1.27.32-9.54,2.86-9.54,2.86s-5.6,1.69-8.59,3.82C16.8,33.78,14.34,36.37,12.29,41.56Z"
      transform="translate(-0.35 -0.37)"
    />
    <path
      fill={head}
      stroke={shiftColorValue(head, -80)}
      strokeWidth={mapRange(size, 16, 400, 0.15, 1)}
      d="M11.68,43.89c-1.06,4.3-.78,7.68-.22,12a16.59,16.59,0,0,0,4.09,7.82,19.81,19.81,0,0,0,7.27,4.89c4.18,1.52,9.16,2,14.79,1.64a28.5,28.5,0,0,0,11.77-2.89A17.07,17.07,0,0,0,55.89,62a17.93,17.93,0,0,0,3.45-9.85,19.86,19.86,0,0,0-1.46-8.87,15,15,0,0,0-4.39-5.8,22.4,22.4,0,0,0-4.11-2.2,41.8,41.8,0,0,0-9.87-2.44,47.4,47.4,0,0,0-12.34.3c-2.25.37-6,1-8.93,3A17.27,17.27,0,0,0,11.68,43.89Z"
      transform="translate(-0.35 -0.37)"
    />
    <path
      fill="#414042"
      stroke="none"
      d="M21.45,62.31c-2.29-.91-4.51-2.65-5.19-4a34.67,34.67,0,0,0,6.61,3.35,29.82,29.82,0,0,0,7.55.8,36.68,36.68,0,0,0,8.49-1.19A26.48,26.48,0,0,0,45,57.94c-1.52,3.05-3.89,3.8-6,4.54a24.2,24.2,0,0,1-9.08,1.41A21.84,21.84,0,0,1,21.45,62.31Z"
      transform="translate(-0.35 -0.37)"
    />
    <circle fill="#e9e9e9" stroke="#9c9c9c" strokeWidth="0.1px" cx="21.86" cy="46.65" r="7.89" />
    <circle fill="#e9e9e9" stroke="#9c9c9c" strokeWidth="0.1px" cx="40.71" cy="46.65" r="7.89" />
    <circle fill="#262626" stroke="none" cx="38.42" cy="46.65" r="3.41" />
    <circle fill="#262626" stroke="none" cx="20.17" cy="46.65" r="3.41" />
  </svg>
);
